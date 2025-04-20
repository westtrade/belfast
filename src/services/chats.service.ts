import type { Context, Service } from 'moleculer';
import DbService from 'moleculer-db';

export default {
	name: 'chats',
	mixins: [DbService],
	settings: { fields: ['_id', 'title', 'createdAt'] },
	hooks: {
		before: {
			create: [
				function addTimestamp(ctx: Context<{ createdAt: Date }>) {
					ctx.params.createdAt = new Date();
					return ctx;
				}
			]
		}
	}
} satisfies Service;
