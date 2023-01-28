<script lang="ts">
	import { colorScheme, ActionIcon, SvelteUIProvider } from '@svelteuidev/core';
	import Sun from '$lib/icons/Sun.svelte';
	import Moon from '$lib/icons/Moon.svelte';

	function toggleTheme() {
		colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
	}
</script>

<SvelteUIProvider themeObserver={$colorScheme} withGlobalStyles withNormalizeCSS>
	<ActionIcon
		override={{ position: 'absolute', top: 0, right: 0, margin: '1rem' }}
		variant="default"
		on:click={toggleTheme}
		size={30}
	>
		{#if $colorScheme === 'dark'}
			<Moon />
		{:else}
			<Sun />
		{/if}
	</ActionIcon>
	<div class="app">
		<slot />
	</div>
</SvelteUIProvider>

<style>
	@font-face {
		font-family: 'Fredoka One';
		src: url('/fonts/FredokaOne-Regular.woff2') format('woff2'),
			url('/fonts/FredokaOne-Regular.woff') format('woff');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
	.app {
		margin-top: 2rem;
	}
</style>
