import assert from "node:assert/strict";
import { resolveInboxMappingIds } from "./mapping";

const baseItem = {
	sourceApp: "bank-api",
	profileKey: "inter-webhook",
	partyId: null,
	categoryId: null,
	partyExternalKey: "pix:cnpj:12345678000199",
	categoryExternalKey: "categoria:servicos-prestados",
};

const mappings = {
	parties: [
		{
			sourceApp: "bank-api",
			profileKey: "inter-webhook",
			externalKey: "pix:cnpj:12345678000199",
			partyId: "party-1",
		},
	],
	categories: [
		{
			sourceApp: "bank-api",
			profileKey: "inter-webhook",
			externalKey: "categoria:servicos-prestados",
			categoryId: "category-1",
		},
	],
};

assert.deepEqual(resolveInboxMappingIds(baseItem, mappings), {
	partyId: "party-1",
	categoryId: "category-1",
});

assert.deepEqual(
	resolveInboxMappingIds(
		{
			...baseItem,
			partyId: "party-explicito",
			categoryId: "category-explicita",
		},
		mappings,
	),
	{
		partyId: "party-explicito",
		categoryId: "category-explicita",
	},
);

assert.deepEqual(
	resolveInboxMappingIds(
		{
			...baseItem,
			profileKey: "outro-perfil",
		},
		mappings,
	),
	{
		partyId: null,
		categoryId: null,
	},
);

assert.deepEqual(
	resolveInboxMappingIds(
		{
			...baseItem,
			partyExternalKey: "12345678000199",
		},
		mappings,
	),
	{
		partyId: null,
		categoryId: "category-1",
	},
);
