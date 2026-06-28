"use client";

import { LogoIcon } from "@/shared/components/brand/logo-icon";
import { useBranding } from "@/shared/components/providers/branding-provider";
import { cn } from "@/shared/utils/ui";

interface LogoProps {
	variant?: "full" | "small" | "compact";
	className?: string;
	/** Apenas nos variants "full" e "compact" */
	invertTextOnDark?: boolean;
	/** Exibe o ícone na cor original, sem filtro preto. Apenas nos variants "full" e "compact" */
	colorIcon?: boolean;
	/** Classes extras aplicadas na imagem do ícone */
	iconClassName?: string;
	/** Classes extras aplicadas na imagem do texto */
	textClassName?: string;
}

const iconFilterClass = "brightness-0 saturate-0";

export function Logo({
	variant = "full",
	className,
	colorIcon = false,
	iconClassName,
	textClassName,
}: LogoProps) {
	const { logoUrl, logoFileName } = useBranding();
	const customLogoAlt = logoFileName
		? `Logo personalizada: ${logoFileName}`
		: "Logo personalizada";

	if (logoUrl) {
		if (variant === "small") {
			return (
				<img
					src={logoUrl}
					alt={customLogoAlt}
					className={cn("size-8 shrink-0 object-contain", className)}
				/>
			);
		}

		return (
			<div className={cn("flex items-center py-3", className)}>
				<img
					src={logoUrl}
					alt={customLogoAlt}
					className={cn(
						"h-9 w-auto max-w-[150px] shrink-0 object-contain",
						iconClassName,
					)}
				/>
			</div>
		);
	}

	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-1", className)}>
				<LogoIcon
					className={cn(
						"size-8 shrink-0",
						!colorIcon && iconFilterClass,
						iconClassName,
					)}
				/>
				<span
					className={cn(
						"hidden shrink-0 text-lg font-semibold tracking-normal sm:block",
						textClassName,
					)}
				>
					OpenMonetis PE
				</span>
			</div>
		);
	}

	if (variant === "small") {
		return <LogoIcon className={cn("size-8 shrink-0", className)} />;
	}

	return (
		<div className={cn("flex items-center gap-1.5 py-4", className)}>
			<LogoIcon
				className={cn("size-7 shrink-0", !colorIcon && iconFilterClass)}
			/>
			<span className="shrink-0 text-base font-semibold tracking-normal">
				OpenMonetis PE
			</span>
		</div>
	);
}
