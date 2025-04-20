import { json, redirect, type Action, type Actions } from '@sveltejs/kit';
import isObject from 'lodash.isobject';
import broker from 'virtual:broker';

export const method = async <T, P>(
	event,
	methodName: string,
	params?: P
): Promise<{ data: T; params?: P }> => {
	const [service] = methodName.split('.');

	try {
		await broker.waitForServices(service);
		event.depends?.(methodName);

		const data = await broker.call(methodName, params, event.locals);
		return { data, params };
	} catch (error) {
		return {
			data: null,
			params,
			error: error
		};
	}
};

export const bindMethods = (...methods: string[]) => {
	const actions: Actions = {};

	for (const methodName of methods) {
		actions[methodName] = async (event) => {
			const params = await event.request.formData();

			const result = await method(event, methodName, Object.fromEntries(params.entries()));

			if (isObject(result.data) && '#meta' in result.data) {
				const meta = result.data['#meta'];
				console.log(meta);
				delete result.data['#meta'];

				if (meta.cookies) {
					for (const cookie of Object.entries(meta.cookies)) {
						event.cookies.set(...cookie.flat());
					}
				}

				if (meta.redirect) {
					return redirect(...meta.redirect);
				}
			}

			return result;
		};
	}

	return actions;
};
