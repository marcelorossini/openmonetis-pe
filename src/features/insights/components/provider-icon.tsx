import Image from "next/image";
import { type AIProvider, PROVIDERS } from "@/features/insights/constants";

const PROVIDER_ICON_PATHS: Partial<
	Record<
		AIProvider,
		{ light: string; dark?: string; width?: number; height?: number }
	>
> = {
	openai: {
		light: "/providers/chatgpt.svg",
		dark: "/providers/chatgpt_dark_mode.svg",
	},
	anthropic: {
		light: "/providers/claude.svg",
	},
	google: {
		light: "/providers/gemini.svg",
	},
	minimax: {
		light: "/providers/minimax.svg",
	},
	openrouter: {
		light: "/providers/openrouter_light.svg",
		dark: "/providers/openrouter_dark.svg",
	},
	ollama: {
		light: "/providers/ollama_light.svg",
		dark: "/providers/ollama_dark.svg",
		width: 17,
		height: 22,
	},
};

export function ProviderIcon({ provider }: { provider: AIProvider }) {
	const iconPaths = PROVIDER_ICON_PATHS[provider];
	if (!iconPaths) return null;

	return (
		<div className="relative flex size-10 items-center justify-center">
			<Image
				src={iconPaths.light}
				alt={PROVIDERS[provider].name}
				width={iconPaths.width ?? 32}
				height={iconPaths.height ?? 32}
				className={iconPaths.dark ? "dark:hidden" : ""}
			/>
			{iconPaths.dark && (
				<Image
					src={iconPaths.dark}
					alt={PROVIDERS[provider].name}
					width={iconPaths.width ?? 32}
					height={iconPaths.height ?? 32}
					className="hidden dark:block"
				/>
			)}
		</div>
	);
}
