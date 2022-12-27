<script lang="ts">
	import {
		Alert,
		Anchor,
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

	const MAX_TOPICS = 3;
	const PAGE_ITEMS = 12;

	let loading = false;
	let topic = '';
	let language = 'JavaScript';
	let licenses: string[] = ['mit', 'apache-2.0', 'gpl'];

	let page = 1;
	let reposPromise: Promise<{ items: Repo[]; total_count: number }>;
	let totalCount = 0;

	async function search() {
		loading = true;
		try {
			reposPromise = searchProjects(
				{
					topic: topic ? [topic] : undefined,
					stars: '2..200',
					forks: '2..200',
					followers: '2..200',
					license: licenses,
					archived: false,
					readme: ['contributing'],
					language: [language]
				},
				page,
				PAGE_ITEMS
			);
			const response = await reposPromise;
			totalCount = response.total_count;
		} catch {
			// do nothing
		} finally {
			loading = false;
		}
	}

	async function onPagination(delta: number) {
		page += delta;
		await search();
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
		<Group position="center">
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
			<Button size="md" variant="gradient" ripple disabled={loading} on:click={() => search()}>
				Find me something!
			</Button>
		</Center>
	</Card>
	{#if reposPromise}
		{#await reposPromise}
			<SimpleGrid
				cols={3}
				breakpoints={[
					{ maxWidth: 980, cols: 3, spacing: 'md' },
					{ maxWidth: 755, cols: 2, spacing: 'sm' },
					{ maxWidth: 600, cols: 1, spacing: 'sm' }
				]}
			>
				{#each Array.from(Array(PAGE_ITEMS).keys()) as _i (_i)}
					<Card shadow="sm" p="lg">
						<Skeleton height={15} radius="sm" />
						<Skeleton height={40} radius="sm" override={{ marginTop: '1rem' }} />
						<Skeleton height={30} radius="sm" override={{ marginTop: '1rem' }} />
						<Skeleton height={20} radius="sm" override={{ marginTop: '1rem' }} />
					</Card>
				{/each}
			</SimpleGrid>
		{:then response}
			<Container override={{ padding: 0 }}>
				<SimpleGrid
					cols={3}
					breakpoints={[
						{ maxWidth: 980, cols: 3, spacing: 'md' },
						{ maxWidth: 755, cols: 2, spacing: 'sm' },
						{ maxWidth: 600, cols: 1, spacing: 'sm' }
					]}
				>
					{#each response.items as repo (repo.id)}
						<Card shadow="sm" p="lg" withBorder>
							<Stack>
								<Anchor href={repo.html_url} external weight={'bold'}>{repo.name}</Anchor>
								<Text size="sm" lineClamp={4} override={{ lineHeight: '16px' }}
									>{repo.description}</Text
								>
								<Group>
									{#each repo.topics.slice(0, MAX_TOPICS) as topic (topic)}
										<Badge size="sm" radius="sm" color="blue" variant="light">{topic}</Badge>
									{/each}
								</Group>
								<Group position="apart">
									<Badge size="sm" radius="sm" color="yellow" variant="light"
										>{repo.stargazers_count} stars</Badge
									>
									<Badge size="sm" radius="sm" color="orange" variant="light"
										>{repo.forks_count} forks</Badge
									>
								</Group>
							</Stack>
						</Card>
					{/each}
				</SimpleGrid>
				<Center override={{ margin: '1rem 0' }}>
					<Button
						variant="light"
						disabled={page === 1}
						override={{ marginRight: '0.5rem' }}
						on:click={() => onPagination(-1)}>Previous</Button
					>
					<Button
						variant="light"
						disabled={page >= Math.ceil(totalCount / PAGE_ITEMS)}
						on:click={() => onPagination(1)}>Next</Button
					>
				</Center>
			</Container>
		{:catch error}
			<Alert title="Oops!">
				{#if error.message.includes('limit')}
					<Group position="apart">
						<Text>
							The maximum number of requests per minute was exceeded, please try again in the next
							minute.
						</Text>
						<Button variant="subtle" color="red" compact on:click={search}>Reload page</Button>
					</Group>
				{:else}
					<Text>An error occurred, please try again later.</Text>
				{/if}
			</Alert>
		{/await}
	{/if}
</Container>
