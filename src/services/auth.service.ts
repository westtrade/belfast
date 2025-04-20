import type { Service, Context, ServiceSchema } from 'moleculer';
import argon2 from 'argon2';
import DbService from 'moleculer-db';
import { redirect } from '@sveltejs/kit';

const service: ServiceSchema = {
	name: 'auth',

	mixins: [DbService],
	settings: { fields: ['_id', 'login', 'passwordHash', 'userId'] },

	actions: {
		signIn: {
			async handler(ctx: Context<{ login: string; password: string }>) {
				await ctx.broker.waitForServices(['users', 'sessions']);
				let [auth] = await this.actions.find({
					query: { login: ctx.params.login },
					limit: 1
				});

				let user;

				if (!auth) {
					user = await ctx.broker.call('users.create', {
						login: ctx.params.login
					});

					auth = await this.actions.create({
						login: ctx.params.login,
						passwordHash: await argon2.hash(ctx.params.password),
						userId: user._id
					});
				} else {
					if (!(await argon2.verify(auth.passwordHash, ctx.params.password))) {
						throw new Error('invalid_password');
					}
				}

				if (!user) {
					[user] = await ctx.broker.call('users.find', {
						query: {
							userId: auth.userId
						}
					});
				}

				const sessionToken = await argon2.hash(new Date().toISOString());

				await ctx.broker.call('sessions.create', {
					_id: sessionToken,
					userId: auth.userId
				});

				return {
					result: 'ok',
					'#meta': {
						redirect: [304, '/'],
						cookies: {
							sessionToken: [sessionToken, { path: '/' }]
						}
					}
				};
			}
		}
	}
};

export default service;
