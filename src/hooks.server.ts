import broker from 'virtual:broker';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	await broker.waitForServices('sessions', 'users');
	let session: Record<string, unknown> | undefined;
	try {
		session = await broker.call('sessions.get', { id: event.cookies.get('sessionToken') });
	} catch (error) {
		session = await broker.call('sessions.create', { _id: event.cookies.get('sessionToken') });
	}

	try {
		event.locals.user = await broker.call('users.get', { id: session?.userId });
	} catch (error) {
		event.locals.user = null;
	}

	const response = await resolve(event);

	return response;
};
