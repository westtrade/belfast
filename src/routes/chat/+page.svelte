<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { method } from '$lib/method.svelte.js';
	import { quintOut } from 'svelte/easing';
	import { blur, fly } from 'svelte/transition';

	const { data } = $props();

	const createChat = method('chats.create');
	const chats = method('chats.list', data.chats);
</script>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between bg-green-400 p-4">
		<div></div>
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

	<select name="" id="" bind:value={chats.params.sort} onchange={() => chats.call()}>
		<option value="-createdAt">Вверх</option>
		<option value="createdAt">Вниз</option>
	</select>

	<div class="divided relative flex flex-col gap-5">
		{#each chats.data?.rows as chat}
			<a href="/chat/{chat._id}">{chat.title || chat._id}</a>
		{/each}
	</div>

	<form
		class="mt-5 flex-row"
		use:createChat.enhance={{
			onFinish(error, data) {
				createChat.params.title = '';
				// invalidate('chats.list');
				// goto(`/chat/${data._id}`);

				chats.call();
			}
		}}
	>
		<input type="text" bind:value={createChat.params.title} name="title" />
		<button class="ml-2 rounded-lg bg-blue-500 p-2 text-white"> Create chat </button>
	</form>
</div>
