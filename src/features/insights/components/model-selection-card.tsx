import { RiExternalLinkLine, RiSparklingLine } from "@remixicon/react";
import Link from "next/link";
import type {
	AIProvider,
	AVAILABLE_MODELS,
} from "@/features/insights/constants";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";

interface ModelSelectionCardProps {
	currentProvider: AIProvider;
	providerModels: Array<(typeof AVAILABLE_MODELS)[number]>;
	selectValue: string;
	customModel: string;
	isCustomModelActive: boolean;
	canUseCustomModel: boolean;
	canAnalyze: boolean;
	disabled?: boolean;
	onModelSelect: (modelId: string) => void;
	onCustomModelChange: (modelName: string) => void;
	onCancel?: () => void;
	onAnalyze: () => void;
}

export const CUSTOM_MODEL_VALUE = "custom";

export function ModelSelectionCard({
	currentProvider,
	providerModels,
	selectValue,
	customModel,
	isCustomModelActive,
	canUseCustomModel,
	canAnalyze,
	disabled,
	onModelSelect,
	onCustomModelChange,
	onCancel,
	onAnalyze,
}: ModelSelectionCardProps) {
	return (
		<Card className="border-border/70 bg-card/95 shadow-sm">
			<CardContent className="space-y-6">
				<div className="space-y-3">
					<div className="space-y-1">
						<h3 className="font-semibold text-sm">2. Modelo específico</h3>
						<p className="text-muted-foreground text-xs">
							Escolha o modelo do provedor selecionado para esta análise.
						</p>
					</div>

					<div className="flex flex-col gap-2 lg:flex-row lg:items-center">
						<div className="flex min-w-0 flex-col gap-2 lg:flex-row">
							<div className="w-full lg:w-72">
								{currentProvider === "openrouter" ? (
									<Input
										value={customModel}
										onChange={(event) =>
											onCustomModelChange(event.target.value)
										}
										placeholder="anthropic/claude-opus-4.8-fast"
										disabled={disabled}
										className="h-9 w-full border-border/70 bg-background"
									/>
								) : (
									<Select
										value={selectValue}
										onValueChange={onModelSelect}
										disabled={disabled}
									>
										<SelectTrigger className="h-9 w-full border-border/70 bg-background">
											<SelectValue placeholder="Selecione um modelo" />
										</SelectTrigger>
										<SelectContent>
											{providerModels.map((model) => (
												<SelectItem key={model.id} value={model.id}>
													{model.name}
													{model.id === "gpt-5.5" ? " (Recomendado)" : ""}
												</SelectItem>
											))}
											{canUseCustomModel && (
												<SelectItem value={CUSTOM_MODEL_VALUE}>
													Modelo customizado
												</SelectItem>
											)}
										</SelectContent>
									</Select>
								)}
							</div>

							{isCustomModelActive && currentProvider === "ollama" && (
								<div className="w-full lg:w-72">
									<Input
										value={customModel}
										onChange={(event) =>
											onCustomModelChange(event.target.value)
										}
										placeholder="Ex: llama3.2"
										disabled={disabled}
										className="h-9 w-full border-border/70 bg-background"
									/>
								</div>
							)}
						</div>

						<div className="flex min-h-9 shrink-0 items-center text-muted-foreground text-xs lg:max-w-none">
							{currentProvider === "openrouter" && (
								<Link
									href="https://openrouter.ai/models"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
								>
									<RiExternalLinkLine className="size-3" />
									Ver modelos do OpenRouter
								</Link>
							)}

							{currentProvider === "ollama" && (
								<span>
									O modelo precisa estar instalado na instância Ollama
									configurada.
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between gap-3">
					<Button
						disabled={disabled}
						onClick={onCancel}
						type="button"
						variant="outline"
					>
						Cancelar
					</Button>
					<Button onClick={onAnalyze} disabled={!canAnalyze}>
						<RiSparklingLine className="size-4" />
						{disabled ? "Analisando..." : "Gerar insights"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
