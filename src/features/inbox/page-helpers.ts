import type { InboxPaginationState, InboxStatus } from "./components/types";

export type ResolvedInboxSearchParams =
	| Record<string, string | string[] | undefined>
	| undefined;

export const INBOX_DEFAULT_PAGE_SIZE = 12;
export const INBOX_PAGE_SIZE_OPTIONS = [12, 24, 48];

const INBOX_STATUSES = ["pending", "processed", "discarded"] as const;

const getSingleParam = (
	params: ResolvedInboxSearchParams,
	key: string,
): string | null => {
	const value = params?.[key];
	if (!value) {
		return null;
	}

	return Array.isArray(value) ? (value[0] ?? null) : value;
};

export const resolveInboxStatus = (
	params: ResolvedInboxSearchParams,
): InboxStatus => {
	const status = getSingleParam(params, "status");

	return INBOX_STATUSES.includes(status as InboxStatus)
		? (status as InboxStatus)
		: "pending";
};

export const resolveInboxApp = (
	params: ResolvedInboxSearchParams,
): string | null => getSingleParam(params, "app");

export const resolveInboxPagination = (
	params: ResolvedInboxSearchParams,
): Pick<InboxPaginationState, "page" | "pageSize"> => {
	const pageParam = Number.parseInt(getSingleParam(params, "page") ?? "", 10);
	const pageSizeParam = Number.parseInt(
		getSingleParam(params, "pageSize") ?? "",
		10,
	);

	return {
		page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
		pageSize: INBOX_PAGE_SIZE_OPTIONS.includes(pageSizeParam)
			? pageSizeParam
			: INBOX_DEFAULT_PAGE_SIZE,
	};
};
