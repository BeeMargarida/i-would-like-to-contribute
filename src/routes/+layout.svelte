<script lang="ts">
	import { colorScheme, dark, globalCss, ActionIcon, SvelteUIProvider } from '@svelteuidev/core';
	import Sun from '$lib/icons/Sun.svelte';
	import Moon from '$lib/icons/Moon.svelte';

	const globalStyles = globalCss({
		body: {
			[`${dark.selector} &`]: {
				backgroundColor: '$dark400',
				color: '$dark50'
			},
			backgroundColor: '$blue50',
			color: '$black'
		}
	});
	globalStyles();

	function toggleTheme() {
		colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
	}
</script>

<svelte:head>
	<title>I would like to contribute</title>
</svelte:head>

<SvelteUIProvider themeObserver={$colorScheme} withNormalizeCSS>
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
