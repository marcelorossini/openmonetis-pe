export type InboxMappingLookupInput = {
	sourceApp: string;
	profileKey?: string | null;
	partyId?: string | null;
	categoryId?: string | null;
	partyExternalKey?: string | null;
	categoryExternalKey?: string | null;
};

export type InboxPartyMappingRecord = {
	sourceApp: string;
	profileKey: string | null;
	externalKey: string;
	partyId: string;
};

export type InboxCategoryMappingRecord = {
	sourceApp: string;
	profileKey: string | null;
	externalKey: string;
	categoryId: string;
};

export function normalizeOptionalText(value?: string | null): string | null {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

export function resolveInboxMappingIds(
	item: InboxMappingLookupInput,
	mappings: {
		parties: InboxPartyMappingRecord[];
		categories: InboxCategoryMappingRecord[];
	},
): {
	partyId: string | null;
	categoryId: string | null;
} {
	if (item.partyId && item.categoryId) {
		return {
			partyId: item.partyId,
			categoryId: item.categoryId,
		};
	}

	const profileKey = normalizeOptionalText(item.profileKey);
	const partyExternalKey = normalizeOptionalText(item.partyExternalKey);
	const categoryExternalKey = normalizeOptionalText(item.categoryExternalKey);

	const partyMapping = item.partyId
		? null
		: mappings.parties.find(
				(mapping) =>
					mapping.sourceApp === item.sourceApp &&
					normalizeOptionalText(mapping.profileKey) === profileKey &&
					normalizeOptionalText(mapping.externalKey) === partyExternalKey,
			);

	const categoryMapping = item.categoryId
		? null
		: mappings.categories.find(
				(mapping) =>
					mapping.sourceApp === item.sourceApp &&
					normalizeOptionalText(mapping.profileKey) === profileKey &&
					normalizeOptionalText(mapping.externalKey) === categoryExternalKey,
			);

	return {
		partyId: item.partyId ?? partyMapping?.partyId ?? null,
		categoryId: item.categoryId ?? categoryMapping?.categoryId ?? null,
	};
}
