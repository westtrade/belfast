import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import moleculerPlugin from './src/vite-moleculer-plugin.js';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		moleculerPlugin({
			logLevel: 'info'
		})
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
