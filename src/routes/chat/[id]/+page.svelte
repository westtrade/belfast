<script lang="ts">
	import { page } from '$app/state';
	import { method } from '$lib/method.svelte.js';
	import { blur } from 'svelte/transition';

	const { data } = $props();

	const createMessage = method('messages.create', {
		params: {
			message: ''
		}
	});
	const messages = method('messages.list', data.messages);

	$effect(() => {
		const interval = setInterval(messages.call, 1_000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between bg-green-400 p-4">
		<!-- Back button -->

		<a href="../chat">
			<svg xmlns="[invalid url, do not cite]" viewBox="0 0 24 24" class="h-12 w-12 text-white">
				<path
					class="fill-current"
					d="M9.41 11H17a1 1 0 0 1 0 2H9.41l2.3 2.3a1 1 0 1 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L9.4 11z"
				/>
			</svg>
		</a>
		<!-- Title -->
		<div class="text-lg font-bold text-white">@rallipi</div>
		<!-- Menu button -->
		<svg xmlns="[invalid url, do not cite]" viewBox="0 0 24 24" class="h-8 w-8 text-white">
			<path
				class="fill-current"
				fill-rule="evenodd"
				d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
			/>
		</svg>
	</header>

	<!-- Main content (messages area) -->
	<main class="flex-grow overflow-y-auto bg-white p-4 dark:bg-gray-800">
		{#each messages.data?.rows as message}
			<div class="mb-4 flex items-start justify-end gap-2.5" transition:blur={{ amount: 10 }}>
				<div>
					<div class="rounded-lg bg-blue-500 p-2.5 text-white">
						<p class="text-sm font-normal">
							{message.message}
						</p>
					</div>
					<p class="mt-1 text-right text-sm font-normal text-gray-500 dark:text-gray-400">
						2:35 PM
					</p>
				</div>
			</div>
		{/each}

		<!-- <div class="flex items-start gap-2.5 mb-4">
			<img class="w-10 h-10 rounded-full" src="[invalid url, do not cite]" alt="Jese Leos image" />
			<div>
				<div class="flex items-center gap-1.5">
					<p class="text-sm font-semibold text-gray-900 dark:text-white">Jese Leos</p>
					<p class="text-sm font-normal text-gray-500 dark:text-gray-400">2:30 PM</p>
				</div>
				<div class="bg-white dark:bg-gray-700 rounded-lg p-2.5 mt-1">
					<p class="text-sm font-normal text-gray-900 dark:text-white">
						Hey, how are you? I'm looking for a new job and I'm wondering if you have any advice.
					</p>
				</div>
			</div>
		</div>

		<div class="flex items-start justify-end gap-2.5 mb-4">
			<div>
				<div class="bg-blue-500 text-white rounded-lg p-2.5">
					<p class="text-sm font-normal">
						That's awesome. I think our users will really appreciate the improvements.
					</p>
				</div>
				<p class="text-sm font-normal text-gray-500 dark:text-gray-400 text-right mt-1">2:35 PM</p>
			</div>
		</div> -->
	</main>

	<!-- Footer (input area) -->
	<form
		class="flex items-center bg-white p-4 dark:bg-gray-800"
		use:createMessage.enhance={{
			onFinish(error, data) {
				createMessage.params.message = '';
			}
		}}
	>
		<textarea
			class="flex-grow resize-none rounded-lg border border-gray-300 p-2"
			rows="1"
			placeholder="Type a message..."
			name="message"
			bind:value={createMessage.params.message}
		></textarea>

		<input type="hidden" value={page.params?.id} name="chatId" />

		<button class="ml-2 rounded-lg bg-blue-500 p-2 text-white">
			<svg xmlns="[invalid url, do not cite]" viewBox="0 0 24 24" class="h-6 w-6">
				<path class="fill-current" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
			</svg>
		</button>
	</form>
</div>
