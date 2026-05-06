import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { InboxStatusCounts } from "./types";

type InboxTabsProps = {
	counts: InboxStatusCounts;
	isPending: boolean;
};

export function InboxTabs({ counts, isPending }: InboxTabsProps) {
	return (
		<TabsList className="grid h-auto w-full grid-cols-3 sm:inline-flex sm:h-9 sm:grid-cols-none">
			<TabsTrigger
				value="pending"
				disabled={isPending}
				className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
			>
				<span>Pendentes</span>
				<span>({counts.pending})</span>
			</TabsTrigger>
			<TabsTrigger
				value="processed"
				disabled={isPending}
				className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
			>
				<span>Processados</span>
				<span>({counts.processed})</span>
			</TabsTrigger>
			<TabsTrigger
				value="discarded"
				disabled={isPending}
				className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
			>
				<span>Descartados</span>
				<span>({counts.discarded})</span>
			</TabsTrigger>
		</TabsList>
	);
}
