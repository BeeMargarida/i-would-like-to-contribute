<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Badge,
		Card,
		Center,
		Container,
		Group,
		SimpleGrid,
		Skeleton,
		Stack,
		Text,
		Title
	} from '@svelteuidev/core';
	import { searchProjects, type Repo } from '$lib/search';

	let reposPromise: Promise<{ items: Repo[]; total_count: number }>;
	let repos: Repo[] = [];
	let count = 0;

	onMount(async () => {
		reposPromise = searchProjects({
			topic: undefined,
			stars: '2..200',
			forks: '2..200',
			followers: '2..200',
			license: ['apache-2.0', 'mit'],
			archived: false,
			readme: ['contributing'],
			language: ['javascript']
		});
		const response = await reposPromise;
		repos = response.items;
		count = response.total_count;

		console.log('repos', repos);
	});

	function onCardClick(repo: Repo) {
		window.open(repo.url, '_blank');
	}
</script>

<Container>
	<Center>
		<Title order={1} override={{ fontFamily: 'Fredoka One, sans-serif', marginBottom: '3rem' }}>
			I would like to contribute
		</Title>
	</Center>
	<Group>@TODO: filters....</Group>
	{#await reposPromise}
		<SimpleGrid
			cols={4}
			breakpoints={[
				{ maxWidth: 980, cols: 3, spacing: 'md' },
				{ maxWidth: 755, cols: 2, spacing: 'sm' },
				{ maxWidth: 600, cols: 1, spacing: 'sm' }
			]}
		>
			{#each Array.from(Array(10).keys()) as _i (_i)}
				<Card shadow="sm" p="lg">
					<Skeleton height={15} radius="sm" />
					<Skeleton height={40} radius="sm" override={{ marginTop: '1rem' }} />
					<Skeleton height={20} radius="sm" override={{ marginTop: '1rem' }} />
				</Card>
			{/each}
		</SimpleGrid>
	{:then}
		<SimpleGrid
			cols={4}
			breakpoints={[
				{ maxWidth: 980, cols: 3, spacing: 'md' },
				{ maxWidth: 755, cols: 2, spacing: 'sm' },
				{ maxWidth: 600, cols: 1, spacing: 'sm' }
			]}
		>
			{#each repos as repo (repo.id)}
				<Card shadow="sm" p="lg" on:click={() => onCardClick(repo)}>
					<Stack>
						<Text weight={'bold'}>{repo.name}</Text>
						<Text size="sm">{repo.description}</Text>
						<Group position="apart">
							<Badge color="yellow" variant="light">{repo.stargazers_count} stars</Badge>
							<Badge color="blue" variant="light">{repo.forks_count} forks</Badge>
						</Group>
					</Stack>
				</Card>
			{/each}
		</SimpleGrid>
	{:catch error}
		<!-- @TODO: prettify this -->
		<p style="color: red">{error.message}</p>
	{/await}
</Container>
