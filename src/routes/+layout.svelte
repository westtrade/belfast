<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<a class="btn btn-ghost text-xl">BELFAST</a>

	<div class="ml-auto flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/user/login">Login</a></li>
		</ul>
	</div>
</div>

{@render children()}
