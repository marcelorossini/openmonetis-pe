import { AnimatedThemeToggler } from "@/shared/components/animated-theme-toggler";
import { NotificationBell } from "@/shared/components/navigation/navbar/notification-bell";
import { RefreshPageButton } from "@/shared/components/refresh-page-button";
import type { DashboardNotificationsSnapshot } from "@/shared/lib/types/notifications";
import { checkForUpdate } from "@/shared/lib/version/check-update";
import { NavMenu } from "./nav-menu";
import { NavbarShell } from "./navbar-shell";
import { NavbarUser } from "./navbar-user";

type AppNavbarProps = {
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	payerAvatarUrl: string | null;
	inboxPendingCount?: number;
	notificationsSnapshot: DashboardNotificationsSnapshot;
};

export async function AppNavbar({
	user,
	payerAvatarUrl,
	inboxPendingCount = 0,
	notificationsSnapshot,
}: AppNavbarProps) {
	const updateCheck = await checkForUpdate();

	return (
		<NavbarShell logoHref="/dashboard" fixed>
			<NavMenu />
			<div className="ml-auto flex items-center gap-2">
				<NotificationBell
					notifications={notificationsSnapshot.notifications}
					unreadCount={notificationsSnapshot.unreadCount}
					visibleCount={notificationsSnapshot.visibleCount}
					budgetNotifications={notificationsSnapshot.budgetNotifications}
					inboxPendingCount={inboxPendingCount}
				/>
				<RefreshPageButton variant="navbar" />
				<AnimatedThemeToggler variant="navbar" />
			</div>
			<NavbarUser
				user={user}
				payerAvatarUrl={payerAvatarUrl}
				updateCheck={updateCheck}
			/>
		</NavbarShell>
	);
}
