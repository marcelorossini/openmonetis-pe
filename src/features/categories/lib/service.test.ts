import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { and, eq } from "drizzle-orm";
import { categories, integrationCategoryMappings, user } from "@/db/schema";
import { db } from "@/shared/lib/db";
import { updateCategoryFromApi, upsertCategoryFromApi } from "./service";

test("upsertCategoryFromApi vincula categoria protegida existente sem duplicar nem editar metadados protegidos", async () => {
	const testId = randomUUID();
	const userId = `test-user-${testId}`;
	const email = `test-${testId}@example.com`;
	const now = new Date();

	try {
		await db.insert(user).values({
			id: userId,
			name: "Test User",
			email,
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		});

		const [existingCategory] = await db
			.insert(categories)
			.values({
				userId,
				name: "Transferência interna",
				type: "receita",
				icon: "RiArrowLeftRightLine",
				partyKind: null,
			})
			.returning({
				id: categories.id,
				icon: categories.icon,
			});

		assert.ok(existingCategory?.id, "A categoria protegida de teste deve existir.");

		const payload = {
			name: "Transferência interna",
			type: "receita" as const,
			icon: null,
			partyKind: null,
			integration: {
				sourceApp: "assa-asaas",
				profileKey: null,
				externalKey: "asaas:type:TRANSFER",
			},
		};

		const first = await upsertCategoryFromApi({
			userId,
			input: payload,
		});

		assert.equal(first.mode, "updated");
		assert.equal(first.item.id, existingCategory.id);
		assert.equal(first.item.icon, "RiArrowLeftRightLine");
		assert.equal(first.item.integrations.length, 1);
		assert.equal(first.item.integrations[0]?.externalKey, "asaas:type:TRANSFER");

		const second = await upsertCategoryFromApi({
			userId,
			input: payload,
		});

		assert.equal(second.mode, "updated");
		assert.equal(second.item.id, existingCategory.id);
		assert.equal(second.item.icon, "RiArrowLeftRightLine");
		assert.equal(second.item.integrations.length, 1);
		assert.equal(second.item.integrations[0]?.externalKey, "asaas:type:TRANSFER");

		const allTransferCategories = await db.query.categories.findMany({
			where: and(
				eq(categories.userId, userId),
				eq(categories.name, "Transferência interna"),
			),
		});

		assert.equal(allTransferCategories.length, 1);

		const bindings = await db.query.integrationCategoryMappings.findMany({
			where: and(
				eq(integrationCategoryMappings.userId, userId),
				eq(integrationCategoryMappings.sourceApp, "assa-asaas"),
				eq(integrationCategoryMappings.profileKey, ""),
				eq(integrationCategoryMappings.externalKey, "asaas:type:TRANSFER"),
			),
		});

		assert.equal(bindings.length, 1);
		assert.equal(bindings[0]?.categoryId, existingCategory.id);
	} finally {
		await db.delete(user).where(eq(user.id, userId));
	}
});

test("updateCategoryFromApi permite anexar integração em categoria protegida sem alterar seus metadados", async () => {
	const testId = randomUUID();
	const userId = `test-user-${testId}`;
	const email = `test-${testId}@example.com`;
	const now = new Date();

	try {
		await db.insert(user).values({
			id: userId,
			name: "Test User",
			email,
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		});

		const [existingCategory] = await db
			.insert(categories)
			.values({
				userId,
				name: "Transferência interna",
				type: "receita",
				icon: "RiArrowLeftRightLine",
				partyKind: null,
			})
			.returning({
				id: categories.id,
			});

		assert.ok(existingCategory?.id, "A categoria protegida de teste deve existir.");

		const item = await updateCategoryFromApi({
			userId,
			categoryId: existingCategory.id,
			input: {
				name: "Transferência interna",
				type: "receita",
				icon: null,
				partyKind: null,
				integration: {
					sourceApp: "assa-asaas",
					profileKey: null,
					externalKey: "asaas:type:TRANSFER_PATCH",
				},
			},
		});

		assert.ok(item, "O PATCH deve retornar a categoria protegida.");
		assert.equal(item.id, existingCategory.id);
		assert.equal(item.icon, "RiArrowLeftRightLine");
		assert.equal(item.integrations.length, 1);
		assert.equal(item.integrations[0]?.externalKey, "asaas:type:TRANSFER_PATCH");
	} finally {
		await db.delete(user).where(eq(user.id, userId));
	}
});
