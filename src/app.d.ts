// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface DBListResult<T = unknown> {
		rows: T[];
		total: number;
		page: number;
		pageSize: number;
		totalPages: number;
	}
}

export {};
