import type { Context } from 'moleculer';

export default {
	name: 'some2',
	actions: {
		greet: {
			handler(ctx: Context<{ name: string }>) {
				console.log(ctx.options);
				return `${new Date()} from some${ctx.params.name}`;
			}
		}
	}
};
