import { asc, eq } from "drizzle-orm";
import { type Category, categories } from "@/db/schema";
import { db } from "@/shared/lib/db";

export async function fetchUserCategories(userId: string): Promise<Category[]> {
	return db.query.categories.findMany({
		where: eq(categories.userId, userId),
		orderBy: [asc(categories.name)],
	});
}
