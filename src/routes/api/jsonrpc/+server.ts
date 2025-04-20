import broker from 'virtual:broker';
import isArray from 'lodash/isArray.js';
import isObject from 'lodash/isObject.js';
import { redirect } from '@sveltejs/kit';
import isObject from 'lodash.isobject';

interface JSONRpcError {
	code: number;
	message: string;
	data?: any; //Использовать для кастомной ошибки?
}

export async function POST({ request, locals, cookies }) {
	let error: JSONRpcError | undefined = undefined;
	let status = 200;

	let requestData;

	try {
		requestData = await request.json();
	} catch {
		error = {
			code: -32700,
			message: 'Parse error'
		};

		status = 400;
	}

	if (
		requestData?.jsonrpc !== '2.0' ||
		!requestData?.method ||
		(!isObject(requestData?.params) && !isArray(requestData?.params))
	) {
		error = {
			code: -32600,
			message: 'Invalid Request'
		};

		status = 400;
	}

	let result;

	if (!error) {
		// const methodExists = await broker.registry.hasMethod(requestData.method);

		// if (!methodExists) {
		// 	error = {
		// 		code: -32601,
		// 		message: 'Method not found'
		// 	};

		// 	status = 404;
		// } else {

		// }

		try {
			result = await broker.call(requestData.method, requestData.params, locals);
		} catch (brokerError) {
			let errorMessage = brokerError.message;
			let errorCode = -32603;

			if (brokerError.code === 404) {
				errorCode = -32601;
				errorMessage = 'Method not found';
			}

			if (brokerError.code === 500) {
				errorCode = -32603;
				errorMessage = 'Internal error';
				console.error(brokerError);
			}

			status = brokerError.code;
			error = {
				code: errorCode,
				message: errorMessage,
				data: {
					errorSlug: brokerError.message,
					...brokerError
				}
			};
		}
	}

	if (isObject(result) && '#meta' in result) {
		const meta = result['#meta'];
		delete result['#meta'];

		if (meta.cookies) {
			for (const cookie of Object.entries(meta.cookies)) {
				cookies.set(...cookie.flat());
			}
		}

		if (meta.redirect) {
			return redirect(...meta.redirect);
		}
	}

	const responseData = {
		jsonrpc: '2.0',
		id: requestData?.id || null,
		result,
		error
	};

	return new Response(JSON.stringify(responseData), {
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
