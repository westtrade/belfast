// vite-plugin-moleculer.js
import { ServiceBroker, type BrokerOptions } from 'moleculer';
import fg from 'fast-glob';
import type { ModuleNode, Plugin } from 'vite';
import path from 'node:path';

declare global {
	var broker: ServiceBroker;
}

declare module 'virtual:example' {
	const broker: ServiceBroker;
	export default broker;
}

const SERVICES_PATH = './src/services';

export default function moleculerPlugin(options: BrokerOptions = {}): Plugin {
	async function generateServicesModule() {
		const services = await fg(`${SERVICES_PATH}/*.service.ts`, { absolute: true });
		const servicesImport = services
			.map((servicePath, index) => {
				return `
                const service${index} = await import('${servicePath}');
                if(broker?.registry?.hasService(service${index}.default.name)) {
                    await broker.destroyService(service${index}.default); 
                }
                await broker?.createService(service${index}.default); 
            `;
			})
			.join('\n');

		return `
            const broker = global.broker ;

            ${servicesImport}
            export default broker;
        `;
	}

	return {
		name: 'vite-plugin-moleculer',
		config() {
			global.broker = new ServiceBroker({ logLevel: 'warn', ...options });
		},

		async configureServer(server) {
			const servicesPath = path.resolve(SERVICES_PATH);
			await broker.start();

			// server.middlewares.use('/api/jsonrpc', async (req, res, next) => {
			// 	if (req.method === 'POST') {
			// 		// const body = await  req.
			// 		const body = await new Promise((resolve, reject) => {
			// 			let body = '';
			// 			req.on('data', (chunk) => (body += chunk));
			// 			req.on('end', async () => resolve(body));
			// 		});

			// 		const requestData = JSON.parse(body as string);

			// 		let result;
			// 		try {
			// 			result = await broker.call(requestData.method, requestData.params);
			// 		} catch (error) {
			// 			console.error(error);
			// 		}

			// 		let responseData = { jsonrpc: '2.0', result };
			// 		if (requestData.id !== undefined) {
			// 			responseData.id = requestData.id;
			// 		}

			// 		res.setHeader('Content-Type', 'application/json');
			// 		res.statusCode = 200;
			// 		res.write(JSON.stringify(responseData));
			// 		res.end();

			// 		return;
			// 	}

			// 	return next();
			// });

			server.watcher.add(servicesPath).on('change', async (filePath) => {
				await broker.stop();

				const moduleNode = server.moduleGraph.getModuleById('virtual:broker');

				if (moduleNode) {
					const invalidatedModules: Set<ModuleNode> = new Set();

					server.moduleGraph.invalidateModule(moduleNode, invalidatedModules, Date.now(), true);
					server.ws.send({ type: 'full-reload' });
				}

				await broker.start();
			});
		},

		// async handleHotUpdate({ server, modules, file, timestamp }) {
		// 	// do pre-flight checks
		// 	// ...
		// 	await broker.stop();

		// 	server.hot.send({ type: 'full-reload' });
		// 	server.moduleGraph.invalidateAll();
		// 	await broker.start();

		// 	return [];
		// },

		resolveId(id: string) {
			if (id === 'virtual:broker') {
				return id; // Подтверждаем, что это виртуальный модуль
			}
			return null;
		},

		async load(id) {
			if (id === 'virtual:broker') {
				return generateServicesModule();
			}
			return null;
		},

		closeWatcher() {
			broker.stop();
		}
	};
}
