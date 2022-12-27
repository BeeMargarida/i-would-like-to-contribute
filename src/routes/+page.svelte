<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Center,
		ChipGroup,
		Container,
		Group,
		InputWrapper,
		NativeSelect,
		SimpleGrid,
		Skeleton,
		Stack,
		Text,
		TextInput,
		Title
	} from '@svelteuidev/core';
	import { searchProjects, type Repo } from '$lib/search';
	import { LANGUAGES } from '$lib/languages';

	let loading = false;
	let topic = '';
	let language = '';
	let licenses: string[] = ['mit', 'apache-2.0', 'gpl'];

	let reposPromise: Promise<{ items: Repo[]; total_count: number }>;
	let repos: Repo[] = [];
	let count = 0;

	async function search() {
		loading = true;
		try {
			reposPromise = searchProjects({
				topic: [topic],
				stars: '2..200',
				forks: '2..200',
				followers: '2..200',
				license: licenses,
				archived: false,
				readme: ['contributing'],
				language: [language]
			});
			const response = await reposPromise;
			repos = response.items;
			count = response.total_count;
		} catch (err) {
			// @TODO: show error in pretty way - specifically the one with the requests per minute
			console.log('err', err);
		} finally {
			loading = false;
		}
	}

	function onCardClick(repo: Repo) {
		window.open(repo.url, '_blank');
	}
</script>

<Container>
	<Center>
		<Title
			order={1}
			override={{ fontFamily: 'Fredoka One, sans-serif', marginBottom: '3rem', fontSize: '4rem' }}
		>
			I would like to contribute
		</Title>
	</Center>
	<Card p="xl" shadow="sm" radius="md" override={{ marginBottom: '2rem' }} withBorder>
		<Group>
			<TextInput bind:value={topic} label="Topic" placeholder="Search for a topic..." />
			<NativeSelect
				data={LANGUAGES}
				bind:value={language}
				placeholder="Pick one language"
				label="Language"
			/>
			<InputWrapper label="Licenses">
				<ChipGroup
					multiple
					bind:value={licenses}
					items={[
						{ label: 'MIT', value: 'mit' },
						{ label: 'Apache 2.0', value: 'apache-2.0' },
						{ label: 'GPL', value: 'gpl' }
					]}
				/>
			</InputWrapper>
		</Group>
		<Center override={{ marginTop: '2rem' }}>
			<Button size="md" variant="gradient" ripple {loading} on:click={() => search()}>
				Find me something!
			</Button>
		</Center>
	</Card>
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
						<Badge color="gray" variant="light">{repo.license.name}</Badge>
					</Stack>
				</Card>
			{/each}
		</SimpleGrid>
	{:catch error}
		<!-- @TODO: prettify this -->
		<p style="color: red">{error.message}</p>
	{/await}
</Container>
