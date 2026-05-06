"use client";

import StatusDot from "@/shared/components/feedback/status-dot";
import { getAccountTypeIcon } from "@/shared/utils/icons";

export function AccountTypeSelectContent({ label }: { label: string }) {
	const icon = getAccountTypeIcon(label);

	return (
		<span className="flex items-center gap-2">
			{icon}
			<span>{label}</span>
		</span>
	);
}

export function StatusSelectContent({ label }: { label: string }) {
	const isActive = label === "Ativa";

	return (
		<span className="flex items-center gap-2">
			<StatusDot
				color={isActive ? "bg-success" : "bg-slate-400 dark:bg-slate-500"}
			/>
			<span>{label}</span>
		</span>
	);
}
