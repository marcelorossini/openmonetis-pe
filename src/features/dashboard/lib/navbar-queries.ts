import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { payers } from "@/db/schema";
import { fetchPendingInboxCount } from "@/features/inbox/queries";
import { db } from "@/shared/lib/db";
import { getAdminPayerId } from "@/shared/lib/payers/get-admin-id";
import { getBusinessDateString } from "@/shared/utils/date";
import {
	type DashboardNotificationsSnapshot,
	fetchDashboardNotifications,
} from "../notifications/notifications-queries";

type DashboardNavbarData = {
	payerAvatarUrl: string | null;
	inboxPendingCount: number;
	notificationsSnapshot: DashboardNotificationsSnapshot;
};

async function fetchAdminPayerAvatarUrl(
	userId: string,
): Promise<string | null> {
	const adminPayerId = await getAdminPayerId(userId);

	if (!adminPayerId) {
		return null;
	}

	const payer = await db.query.payers.findFirst({
		columns: {
			avatarUrl: true,
		},
		where: eq(payers.id, adminPayerId),
	});

	return payer?.avatarUrl ?? null;
}

async function fetchDashboardNavbarDataInternal(
	userId: string,
): Promise<DashboardNavbarData> {
	const currentPeriod = getBusinessDateString().slice(0, 7);
	const [payerAvatarUrl, notificationsSnapshot, inboxPendingCount] =
		await Promise.all([
			fetchAdminPayerAvatarUrl(userId),
			fetchDashboardNotifications(userId, currentPeriod),
			fetchPendingInboxCount(userId),
		]);

	return {
		payerAvatarUrl,
		inboxPendingCount,
		notificationsSnapshot,
	};
}

export async function fetchDashboardNavbarData(userId: string) {
	"use cache";
	cacheTag(`dashboard-${userId}`);
	cacheLife({ revalidate: 3 });
	return fetchDashboardNavbarDataInternal(userId);
}
