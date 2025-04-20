import type { PageServerLoad, PageServerLoadEvent } from './$types.js';
import { method } from '$lib/server/method.js';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const messages = await method<
		DBListResult<{ id: string; message: string; createdAt: string; chatId: string }>,
		{ query: { chatId: string } }
	>(event, 'messages.list', { query: { chatId: event.params.id } });

	return { messages };
};
