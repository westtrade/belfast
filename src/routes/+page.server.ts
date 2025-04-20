import { bindMethods, method as serverMethod } from '$lib/server/method.js';

export const load = async (event) => {
	const some2Greet = serverMethod(event, 'some2.greet', { name: 'some2' });
	return { some2Greet };
};

export const actions = bindMethods('some2.greet');
