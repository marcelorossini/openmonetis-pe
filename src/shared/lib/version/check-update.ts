import { version as currentVersion } from "@/package.json";

const GITHUB_REPO = "marcelorossini/openmonetis-pe";
const RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

export type UpdateCheckResult = {
	hasUpdate: boolean;
	latestVersion: string;
	releaseUrl: string;
};

function compareVersions(a: string, b: string): number {
	const normalize = (v: string) => v.replace(/^v/, "").split(".").map(Number);
	const partsA = normalize(a);
	const partsB = normalize(b);

	for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
		const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}

export async function checkForUpdate(): Promise<UpdateCheckResult> {
	const fallback: UpdateCheckResult = {
		hasUpdate: false,
		latestVersion: currentVersion,
		releaseUrl: RELEASES_URL,
	};

	try {
		// GitHub redireciona /releases/latest para a URL com a tag — sem API, sem rate limit
		const response = await fetch(
			`https://github.com/${GITHUB_REPO}/releases/latest`,
			{ redirect: "manual", next: { revalidate: 86400 } },
		);

		const location = response.headers.get("location");
		if (!location) return fallback;

		const match = location.match(/releases\/tag\/v?(.+)$/);
		if (!match) return fallback;

		const latestVersion = match[1];
		const releaseUrl = `https://github.com/${GITHUB_REPO}/releases/tag/v${latestVersion}`;

		return {
			hasUpdate: compareVersions(latestVersion, currentVersion) > 0,
			latestVersion,
			releaseUrl,
		};
	} catch {
		return fallback;
	}
}
