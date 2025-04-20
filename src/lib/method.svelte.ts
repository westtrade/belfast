import { enhance } from '$app/forms';
import { goto } from '$app/navigation';
import type { Action } from 'svelte/action';

// import { nanoid } from 'nanoid';
import { ulid } from 'ulid';

interface EnhanceOptions<T> {
	onFinish?(error: Error | null, data: T): void;
}

interface MethodFabricOptions<T, P> {
	data?: T;
	params?: P;
	interval?: number;
	errors?: string[];
	onFinish?(errors: Error[] | null, data: T): void | Promise<void>;
}

export const method = <T, P>(
	method: string,
	options?: MethodFabricOptions<T, P> | Promise<MethodFabricOptions<T, P>>
) => {
	let loading = $state(false);
	let data = $state();
	let errors = $state<string[] | null>(null);
	let params = $state<P>({});

	$effect(() => {
		if (options instanceof Promise) {
			loading = true;
			options
				.then((options) => {
					data = options.data;
					params = options.params;
					errors = options.errors;

					loading = false;
				})
				.catch((error) => {
					data = null;
					errors = [error.message];
					loading = false;
				});
		} else {
			data = options?.data;
			params = options?.params;
			errors = options?.errors;
		}
	});

	const call = async (inputParams?: P) => {
		loading = true;

		if (inputParams !== undefined) {
			params = inputParams;
		}

		const responseData = await fetch('/api/jsonrpc', {
			method: 'POST',
			body: JSON.stringify({ jsonrpc: '2.0', method, params, id: ulid() })
		}).then(async (response) => {
			return response.json();
		});

		data = responseData.result;
		loading = false;
		options?.onFinish?.(errors, responseData.result);

		return responseData.result;
	};

	$effect(() => {
		const interval = options?.interval;
		let timeout: Timeout | null = null;

		function tick() {
			timeout = setTimeout(async () => {
				await call();
				tick();
			}, interval);
		}

		if (interval !== undefined) {
			tick();
		}

		return () => {
			clearTimeout(timeout);
		};
	});

	const methodEnhance: Action<HTMLElement> = (node, options?: EnhanceOptions<T>) => {
		if (node instanceof HTMLFormElement && node.method.toLowerCase() === 'post') {
			enhance(node, (event) => {
				return async (response) => {
					if (response.result.type === 'redirect') {
						goto(response.result.location);
					}
				};
			});

			return;
		}

		$effect(() => {
			let eventName = 'click';

			if (node instanceof HTMLFormElement) {
				eventName = 'submit';
			}

			async function dispatcher(event: Event) {
				event.preventDefault();
				let params: Record<string, string | undefined> = node.dataset;

				if (node instanceof HTMLFormElement) {
					const formData = new FormData(node);
					params = {};
					for (const [key, value] of formData.entries()) {
						if (typeof value === 'string' || value === undefined) {
							params[key] = value;
						}
					}
				}

				const result = await call(params);

				options?.onFinish?.(null, result);
			}

			node.addEventListener(eventName, dispatcher);

			return () => {
				node.removeEventListener(eventName, dispatcher);
			};
		});
	};

	return {
		get loading() {
			return loading;
		},

		get enhance() {
			return methodEnhance;
		},

		call,

		get data() {
			return data;
		},

		set data(newData: T) {
			data = newData;
		},
		get params() {
			return params;
		},

		set params(newParams: P) {
			params = newParams;
		}
	};
};
