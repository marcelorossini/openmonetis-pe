import { RiCheckLine } from "@remixicon/react";
import { type AIProvider, PROVIDERS } from "@/features/insights/constants";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/ui";
import { ProviderIcon } from "./provider-icon";

const PROVIDER_DETAILS: Record<AIProvider, { description: string }> = {
	openai: {
		description: "Qualidade e equilíbrio entre análise e custo.",
	},
	anthropic: {
		description: "Forte em raciocínio e análises profundas.",
	},
	google: {
		description: "Ideal para integração e velocidade.",
	},
	minimax: {
		description: "Eficiente para grandes volumes de dados.",
	},
	openrouter: {
		description: "Acesso a múltiplos modelos via API.",
	},
	ollama: {
		description: "Execução local com privacidade total.",
	},
};

interface ProviderSelectionCardProps {
	currentProvider: AIProvider;
	disabled?: boolean;
	onProviderChange: (provider: AIProvider) => void;
}

export function ProviderSelectionCard({
	currentProvider,
	disabled,
	onProviderChange,
}: ProviderSelectionCardProps) {
	return (
		<Card className="border-border/70 bg-card/95 shadow-sm">
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<h2 className="font-semibold text-2xl tracking-tight">
						Definir modelo de análise
					</h2>
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						Escolha o provedor de IA e o modelo específico que serão usados para
						gerar insights sobre seus dados financeiros. Diferentes modelos
						podem oferecer perspectivas variadas na análise.
					</p>
				</div>

				<div className="space-y-3">
					<div className="space-y-1">
						<h3 className="font-semibold text-sm">1. Provedor de IA</h3>
						<p className="text-muted-foreground text-xs">
							Selecione o provedor que melhor atende às suas necessidades.
						</p>
					</div>

					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{(Object.keys(PROVIDERS) as AIProvider[]).map((providerId) => {
							const provider = PROVIDERS[providerId];
							const details = PROVIDER_DETAILS[providerId];
							const isSelected = currentProvider === providerId;

							return (
								<button
									type="button"
									key={providerId}
									onClick={() => onProviderChange(providerId)}
									disabled={disabled}
									className={cn(
										"group relative rounded-2xl border p-4 text-left transition-all hover:border-primary/60 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-70",
										isSelected &&
											"border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20",
									)}
								>
									<div className="flex items-start gap-3">
										<div
											className={cn(
												"mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border text-transparent transition-colors",
												isSelected &&
													"border-primary bg-primary text-primary-foreground",
											)}
										>
											<RiCheckLine className="size-3" />
										</div>

										<ProviderIcon provider={providerId} />

										<div className="min-w-0 flex-1 space-y-2">
											<span className="font-semibold text-sm leading-none">
												{provider.name}
											</span>
											<p className="text-muted-foreground text-xs leading-relaxed">
												{details.description}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
