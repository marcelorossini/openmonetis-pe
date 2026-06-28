"use client";

import {
	RiDownload2Line,
	RiExternalLinkLine,
	RiNotification3Line,
	RiQrCodeLine,
	RiShieldCheckLine,
} from "@remixicon/react";
import type { ReactNode } from "react";
import { ApiTokensForm } from "./api-tokens-form";

interface ApiToken {
	id: string;
	name: string;
	tokenPrefix: string;
	lastUsedAt: Date | null;
	lastUsedIp: string | null;
	createdAt: Date;
	expiresAt: Date | null;
	revokedAt: Date | null;
}

interface CompanionTabProps {
	tokens: ApiToken[];
}

const steps: {
	icon: typeof RiDownload2Line;
	title: string;
	description: ReactNode;
}[] = [
	{
		icon: RiDownload2Line,
		title: "Instale o app",
		description: (
			<>
				Baixe o APK no{" "}
				<a
					href="https://github.com/felipegcoutinho/openmonetis-companion"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-0.5 text-primary hover:underline"
				>
					GitHub
					<RiExternalLinkLine className="h-3 w-3" />
				</a>
			</>
		),
	},
	{
		icon: RiQrCodeLine,
		title: "Gere um token",
		description: "Crie um token abaixo para autenticar.",
	},
	{
		icon: RiNotification3Line,
		title: "Configure permissões",
		description: "Conceda acesso às notificações.",
	},
	{
		icon: RiShieldCheckLine,
		title: "Pronto!",
		description: "Notificações serão enviadas ao OpenMonetis PE.",
	},
];

export function CompanionTab({ tokens }: CompanionTabProps) {
	return (
		<div className="space-y-6">
			{/* Steps */}
			<div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
				{steps.map((step, index) => (
					<div key={step.title} className="flex items-start gap-2">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
							<step.icon className="h-4 w-4" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-medium leading-tight">
								{index + 1}. {step.title}
							</p>
							<p className="text-xs text-muted-foreground">
								{step.description}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Devices */}
			<ApiTokensForm tokens={tokens} />
		</div>
	);
}
