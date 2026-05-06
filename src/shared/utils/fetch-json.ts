export async function fetchJson<T>(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(input, {
		cache: "no-store",
		...init,
	});

	if (!response.ok) {
		let message = `Erro na requisição (${response.status})`;

		try {
			const payload = (await response.json()) as { error?: string };
			if (payload.error) {
				message = payload.error;
			}
		} catch {
			// noop
		}

		throw new Error(message);
	}

	return response.json() as Promise<T>;
}
