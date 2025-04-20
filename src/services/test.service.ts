import type { Context } from 'moleculer';

export default {
	name: 'test',
	actions: {
		greet(ctx: Context<{ name: string }>) {
			return new Date();
		}
	}
};
