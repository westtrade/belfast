import type { Service } from 'moleculer';
import DbService from 'moleculer-db';

export default {
	name: 'messages',
	mixins: [DbService],
	settings: { fields: ['_id', 'message', 'createdAt', 'chatId'] }
};
