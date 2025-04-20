import broker from 'virtual:broker';
import type { PageLoad } from './$types';
import { method } from '$lib/server/method.js';

export const load: PageLoad = async (event) => {
	const chats = await method<DBListResult<{ id: string; name: string; createdAt: string }>>(
		event,
		'chats.list',
		{ sort: '-createdAt' }
	);

	return { chats };
};
