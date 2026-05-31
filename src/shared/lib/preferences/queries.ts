import { eq } from "drizzle-orm";
import { db, schema } from "@/shared/lib/db";

export type AppPreferences = {
	showTransactionSummary: boolean;
};

const DEFAULT_APP_PREFERENCES: AppPreferences = {
	showTransactionSummary: true,
};

export async function fetchAppPreferences(
	userId: string,
): Promise<AppPreferences> {
	const [preferences] = await db
		.select({
			showTransactionSummary: schema.userPreferences.showTransactionSummary,
		})
		.from(schema.userPreferences)
		.where(eq(schema.userPreferences.userId, userId))
		.limit(1);

	return preferences ?? DEFAULT_APP_PREFERENCES;
}
