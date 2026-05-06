import {
	RiArrowLeftDoubleLine,
	RiArrowLeftSLine,
	RiArrowRightDoubleLine,
	RiArrowRightSLine,
} from "@remixicon/react";
import { INBOX_PAGE_SIZE_OPTIONS } from "@/features/inbox/page-helpers";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import type { InboxPaginationState, InboxStatus } from "./types";

type InboxPaginationProps = {
	pagination: InboxPaginationState;
	activeStatus: InboxStatus;
	isPending: boolean;
	onNavigate: (status: InboxStatus, page: number, pageSize: number) => void;
};

export function InboxPagination({
	pagination,
	activeStatus,
	isPending,
	onNavigate,
}: InboxPaginationProps) {
	if (pagination.totalItems === 0) return null;

	const canPreviousPage = pagination.page > 1;
	const canNextPage = pagination.page < pagination.totalPages;

	return (
		<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					{pagination.totalItems} notificações
				</span>
				<Select
					disabled={isPending}
					value={pagination.pageSize.toString()}
					onValueChange={(value) => {
						onNavigate(activeStatus, 1, Number(value));
					}}
				>
					<SelectTrigger className="w-max">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{INBOX_PAGE_SIZE_OPTIONS.map((option) => (
							<SelectItem key={option} value={option.toString()}>
								{option} itens
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					Página {pagination.page} de {pagination.totalPages}
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() => onNavigate(activeStatus, 1, pagination.pageSize)}
						disabled={!canPreviousPage || isPending}
						aria-label="Primeira página"
					>
						<RiArrowLeftDoubleLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() =>
							onNavigate(activeStatus, pagination.page - 1, pagination.pageSize)
						}
						disabled={!canPreviousPage || isPending}
						aria-label="Página anterior"
					>
						<RiArrowLeftSLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() =>
							onNavigate(activeStatus, pagination.page + 1, pagination.pageSize)
						}
						disabled={!canNextPage || isPending}
						aria-label="Próxima página"
					>
						<RiArrowRightSLine className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={() =>
							onNavigate(
								activeStatus,
								pagination.totalPages,
								pagination.pageSize,
							)
						}
						disabled={!canNextPage || isPending}
						aria-label="Última página"
					>
						<RiArrowRightDoubleLine className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
