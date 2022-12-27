export type Params = {
	topic?: string[];
	stars?: string;
	forks?: string;
	followers?: string;
	license?: string[];
	archived?: boolean;
	readme?: string[];
	language?: string[];
};

export type Repo = {
	id: string;
	name: string;
	description: string;
	url: string;
	stargazers_count: number;
	forks_count: number;
	license: { name: string };
};

export async function searchProjects(
	params: Params,
	page = 0,
	entries = 10
): Promise<{ items: Repo[]; total_count: number }> {
	const filters: Record<string, string> = {};
	for (const [key, param] of Object.entries(params)) {
		if (!param) continue;
		if (key === 'readme') {
			filters[key] = `${(param as string[]).join(' ')} in:readme`;
		} else if (Array.isArray(param)) {
			filters[key] = param.map((p) => `${key}:${p}`).join(' ');
		} else {
			filters[key] = `${key}:${param}`;
		}
	}

	// @TODO: check if necessary to use Authenticated requests to get more
	// than 10 requests per minute
	const response = await fetch(
		`https://api.github.com/search/repositories?q=${encodeURIComponent(
			Object.values(filters).join(' ')
		)}&per_page=${entries}&page=${page}`
	);
	return await response.json();
}
