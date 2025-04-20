<script lang="ts">
	import { method } from '$lib/method.svelte.js';

	const { data } = $props();

	const greet = method('some2.greet', data.some2Greet);
</script>

<button use:greet.enhance data-name="John">
	{greet.data || 'Get time'}
</button>

<form action="/?some2.greet" use:greet.enhance>
	<input name="name" bind:value={greet.params.name} type="number" />
	<input type="submit" />
</form>
