<script lang="ts">
	import { SvelteUIProvider } from '@svelteuidev/core';

	let theme: 'dark' | 'light' = 'light';
</script>

<SvelteUIProvider themeObserver={theme} withGlobalStyles withNormalizeCSS>
	<div class="app">
		<slot />
	</div>
</SvelteUIProvider>

<style>
	@font-face {
		font-family: 'Fredoka One';
		src: url('FredokaOne-Regular.woff2') format('woff2'),
			url('FredokaOne-Regular.woff') format('woff');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
	.app {
		margin-top: 2rem;
	}
</style>
