<script lang="ts">
	import { method } from '$lib/method.svelte.js';

	const { data } = $props();
	$inspect(data);

	const signIn = method('auth.signIn', {
		params: {
			login: '',
			password: '',
			rememberMe: true
		}
	});
</script>

<form
	use:signIn.enhance
	action="?/auth.signIn"
	method="POST"
	class="relative bg-cover bg-center bg-no-repeat"
	style="background-image: url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80);"
>
	<div class="absolute inset-0 z-0 bg-gradient-to-b from-green-500 to-green-400 opacity-75"></div>
	<div class="mx-0 min-h-screen justify-center sm:flex sm:flex-row">
		<div class="z-10 flex flex-col self-center p-10 sm:max-w-5xl xl:max-w-2xl">
			<div class="hidden flex-col self-start text-white lg:flex">
				<img src="" class="mb-3" />
				<h1 class="mb-3 text-5xl font-bold">Hi ? Welcome Back Aji</h1>
				<p class="pr-3">
					Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
					industries for previewing layouts and visual mockups
				</p>
			</div>
		</div>
		<div class="z-10 flex justify-center self-center">
			<div class="mx-auto w-100 rounded-2xl bg-white p-12">
				<div class="mb-4">
					<h3 class="text-2xl font-semibold text-gray-800">Sign In</h3>
					<p class="text-gray-500">Please sign in to your account.</p>
				</div>
				<div class="space-y-5">
					<div class="space-y-2">
						<label class="text-sm font-medium tracking-wide text-gray-700">Email</label>
						<input
							class=" w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-green-400 focus:outline-none"
							type=""
							placeholder="mail@gmail.com"
							name="login"
						/>
					</div>
					<div class="space-y-2">
						<label class="mb-5 text-sm font-medium tracking-wide text-gray-700"> Password </label>
						<input
							class="w-full content-center rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-green-400 focus:outline-none"
							type="password"
							placeholder="Enter your password"
							name="password"
						/>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<input
								id="remember_me"
								name="rememberMe"
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 bg-blue-500 focus:ring-blue-400"
								bind:checked={signIn.params.rememberMe}
							/>
							<label for="remember_me" class="ml-2 block text-sm text-gray-800">
								Remember me
							</label>
						</div>
						<div class="text-sm">
							<a href="#" class="text-green-400 hover:text-green-500"> Forgot your password? </a>
						</div>
					</div>
					<div>
						<button
							type="submit"
							class="flex w-full cursor-pointer justify-center rounded-full bg-green-400 p-3 font-semibold tracking-wide text-gray-100 shadow-lg transition duration-500 ease-in hover:bg-green-500"
						>
							Sign in
						</button>
					</div>
				</div>
				<div class="pt-5 text-center text-xs text-gray-400">
					<span>
						Copyright © 2021-2022
						<a
							href="https://codepen.io/uidesignhub"
							rel=""
							target="_blank"
							title="Ajimon"
							class="text-green hover:text-green-500">AJI</a
						></span
					>
				</div>
			</div>
		</div>
	</div>
</form>
