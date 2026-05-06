import { and, eq } from "drizzle-orm";
import { payerShares, payers, user as usersTable } from "@/db/schema";
import { db } from "@/shared/lib/db";

type PayerWithAccess = Omit<typeof payers.$inferSelect, "shareCode"> & {
	shareCode: string | null;
	canEdit: boolean;
	sharedByName: string | null;
	sharedByEmail: string | null;
	shareId: string | null;
};

export async function fetchPayersWithAccess(
	userId: string,
): Promise<PayerWithAccess[]> {
	const [owned, shared] = await Promise.all([
		db.query.payers.findMany({
			where: eq(payers.userId, userId),
		}),
		db
			.select({
				shareId: payerShares.id,
				payer: payers,
				ownerName: usersTable.name,
				ownerEmail: usersTable.email,
			})
			.from(payerShares)
			.innerJoin(payers, eq(payerShares.payerId, payers.id))
			.leftJoin(usersTable, eq(payers.userId, usersTable.id))
			.where(eq(payerShares.sharedWithUserId, userId)),
	]);

	const ownedMapped: PayerWithAccess[] = owned.map((item) => ({
		...item,
		canEdit: true,
		sharedByName: null,
		sharedByEmail: null,
		shareId: null,
	}));

	const sharedMapped: PayerWithAccess[] = shared.map((item) => ({
		...(item.payer as typeof payers.$inferSelect),
		shareCode: null,
		canEdit: false,
		sharedByName: item.ownerName ?? null,
		sharedByEmail: item.ownerEmail ?? null,
		shareId: item.shareId,
	}));

	return [...ownedMapped, ...sharedMapped];
}

export async function getPayerAccess(userId: string, payerId: string) {
	const pagador = await db.query.payers.findFirst({
		where: and(eq(payers.id, payerId)),
	});

	if (!pagador) {
		return null;
	}

	if (pagador.userId === userId) {
		return {
			pagador,
			canEdit: true,
			share: null as typeof payerShares.$inferSelect | null,
		};
	}

	const share = await db.query.payerShares.findFirst({
		where: and(
			eq(payerShares.payerId, payerId),
			eq(payerShares.sharedWithUserId, userId),
		),
	});

	if (!share) {
		return null;
	}

	return { pagador, canEdit: false, share };
}
