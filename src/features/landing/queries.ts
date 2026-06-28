export async function fetchGitHubStats(): Promise<{
	stars: number;
	forks: number;
}> {
	try {
		const res = await fetch(
			"https://api.github.com/repos/marcelorossini/openmonetis-pe",
			{ next: { revalidate: 3600 } },
		);
		if (!res.ok) return { stars: 200, forks: 60 };
		const data = await res.json();
		return {
			stars: data.stargazers_count as number,
			forks: data.forks_count as number,
		};
	} catch {
		return { stars: 200, forks: 60 };
	}
}
