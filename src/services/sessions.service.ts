import type { Service, Context, ServiceSchema } from 'moleculer';
import argon2 from 'argon2';
import DbService from 'moleculer-db';
import { redirect } from '@sveltejs/kit';

const service: ServiceSchema = {
	name: 'sessions',

	mixins: [DbService],
	settings: { fields: ['_id', 'userId', 'data'] }
};

export default service;
