"use client";

import {
	RiDeleteBinLine,
	RiEyeLine,
	RiFlashlightLine,
	RiLightbulbLine,
	RiLoader4Line,
	RiRocketLine,
	RiSaveLine,
} from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	deleteSavedInsightsAction,
	generateInsightsAction,
	saveInsightsAction,
} from "@/features/insights/actions";
import { DEFAULT_MODEL } from "@/features/insights/constants";
import {
	savedInsightsQueryKey,
	useSavedInsights,
} from "@/features/insights/hooks/use-saved-insights";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { InsightsResponse } from "@/shared/lib/schemas/insights";
import { InsightsGrid } from "./insights-grid";
import { ModelSelector } from "./model-selector";

interface InsightsPageProps {
	period: string;
	onAnalyze?: () => void;
}

export function InsightsPage({ period, onAnalyze }: InsightsPageProps) {
	const queryClient = useQueryClient();
	const savedInsightsQuery = useSavedInsights(period);
	const [isPending, startTransition] = useTransition();
	const [isSaving, startSaveTransition] = useTransition();
	const [draftInsights, setDraftInsights] = useState<InsightsResponse | null>(
		null,
	);
	const [selectedModelOverride, setSelectedModelOverride] = useState<
		string | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [userInstructions, setUserInstructions] = useState("");
	const [shouldScrollToAnalysis, setShouldScrollToAnalysis] = useState(false);
	const analysisAreaRef = useRef<HTMLDivElement>(null);
	const savedInsights = savedInsightsQuery.data ?? null;
	const insights = draftInsights ?? savedInsights?.insights ?? null;
	const selectedModel =
		selectedModelOverride ?? savedInsights?.modelId ?? DEFAULT_MODEL;
	const isSaved = draftInsights === null && savedInsights !== null;
	const savedDate = isSaved ? (savedInsights?.createdAt ?? null) : null;
	const isLoadingSavedInsights =
		savedInsightsQuery.isLoading && draftInsights === null;
	const savedInsightsError =
		draftInsights === null && savedInsightsQuery.error instanceof Error
			? savedInsightsQuery.error.message
			: null;
	const shouldShowAnalysisArea = Boolean(
		isPending ||
			isLoadingSavedInsights ||
			insights ||
			error ||
			savedInsightsError,
	);

	useEffect(() => {
		void period;
		setDraftInsights(null);
		setSelectedModelOverride(null);
		setError(null);
		setShouldScrollToAnalysis(false);
	}, [period]);

	useEffect(() => {
		if (!shouldScrollToAnalysis || !shouldShowAnalysisArea) return;

		requestAnimationFrame(() => {
			analysisAreaRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});
		setShouldScrollToAnalysis(false);
	}, [shouldScrollToAnalysis, shouldShowAnalysisArea]);

	const handleAnalyze = () => {
		setError(null);
		setShouldScrollToAnalysis(true);
		onAnalyze?.();
		startTransition(async () => {
			try {
				const result = await generateInsightsAction(
					period,
					selectedModel,
					userInstructions,
				);

				if (result.success) {
					setDraftInsights(result.data);
					setSelectedModelOverride(selectedModel);
					toast.success("Insights gerados com sucesso!");
				} else {
					setError(result.error);
					toast.error(result.error);
				}
			} catch (err) {
				const errorMessage = "Erro inesperado ao gerar insights.";
				setError(errorMessage);
				toast.error(errorMessage);
				console.error("Error generating insights:", err);
			}
		});
	};

	const handleSave = () => {
		if (!insights) return;

		startSaveTransition(async () => {
			try {
				const result = await saveInsightsAction(
					period,
					selectedModel,
					insights,
				);

				if (result.success) {
					queryClient.setQueryData(savedInsightsQueryKey(period), {
						insights,
						modelId: selectedModel,
						createdAt: result.data.createdAt.toISOString(),
					});
					setDraftInsights(null);
					setSelectedModelOverride(null);
					toast.success("Análise salva com sucesso!");
				} else {
					toast.error(result.error);
				}
			} catch (err) {
				toast.error("Erro ao salvar análise.");
				console.error("Error saving insights:", err);
			}
		});
	};

	const handleDelete = () => {
		if (!insights) return;

		startSaveTransition(async () => {
			try {
				const result = await deleteSavedInsightsAction(period);

				if (result.success) {
					queryClient.setQueryData(savedInsightsQueryKey(period), null);
					setDraftInsights(insights);
					setSelectedModelOverride(selectedModel);
					toast.success("Análise removida com sucesso!");
				} else {
					toast.error(result.error);
				}
			} catch (err) {
				toast.error("Erro ao remover análise.");
				console.error("Error deleting insights:", err);
			}
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<ModelSelector
				value={selectedModel}
				onValueChange={setSelectedModelOverride}
				period={period}
				onAnalyze={handleAnalyze}
				userInstructions={userInstructions}
				onUserInstructionsChange={setUserInstructions}
				onCancel={() => {
					setSelectedModelOverride(null);
					setError(null);
				}}
				disabled={isPending}
				isLoadingSavedInsights={isLoadingSavedInsights}
			/>

			{shouldShowAnalysisArea && (
				<div className="min-h-[320px] scroll-mt-6" ref={analysisAreaRef}>
					{(isPending || isLoadingSavedInsights) && <LoadingState />}
					{!isPending && !isLoadingSavedInsights && error && (
						<ErrorState
							title="Erro ao gerar insights"
							error={error}
							onRetry={handleAnalyze}
						/>
					)}
					{!isPending &&
						!isLoadingSavedInsights &&
						!error &&
						savedInsightsError && (
							<ErrorState
								title="Erro ao carregar insights salvos"
								error={savedInsightsError}
								onRetry={() => void savedInsightsQuery.refetch()}
							/>
						)}
					{!isPending &&
						!isLoadingSavedInsights &&
						insights &&
						!error &&
						!savedInsightsError && (
							<InsightsGrid
								insights={insights}
								action={
									<div className="flex flex-col items-start sm:items-end">
										<Button
											onClick={isSaved ? handleDelete : handleSave}
											disabled={isSaving || isPending || isLoadingSavedInsights}
											variant={isSaved ? "destructive" : "secondary"}
										>
											{isSaved ? (
												<>
													<RiDeleteBinLine className="mr-2 size-4" />
													{isSaving ? "Removendo..." : "Remover análise"}
												</>
											) : (
												<>
													<RiSaveLine className="mr-2 size-4" />
													{isSaving ? "Salvando..." : "Salvar análise"}
												</>
											)}
										</Button>
										{isSaved && savedDate && (
											<span className="text-muted-foreground text-xs">
												Salva em{" "}
												{format(new Date(savedDate), "dd/MM/yyyy 'às' HH:mm", {
													locale: ptBR,
												})}
											</span>
										)}
									</div>
								}
							/>
						)}
				</div>
			)}
		</div>
	);
}

function LoadingState() {
	const categories = [
		{
			label: "Comportamentos",
			icon: RiEyeLine,
			color: "text-orange-600 dark:text-orange-400",
		},
		{
			label: "Gatilhos",
			icon: RiFlashlightLine,
			color: "text-amber-600 dark:text-amber-400",
		},
		{
			label: "Recomendações",
			icon: RiLightbulbLine,
			color: "text-sky-600 dark:text-sky-400",
		},
		{
			label: "Melhorias",
			icon: RiRocketLine,
			color: "text-emerald-600 dark:text-emerald-400",
		},
	];

	return (
		<div className="space-y-4">
			<Card className="overflow-hidden border-primary/10 bg-linear-to-br from-primary/10 via-card to-card">
				<CardContent className="px-4 py-1">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex gap-3">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
								<RiLoader4Line className="size-5 animate-spin" />
							</div>
							<div className="space-y-2">
								<div className="space-y-1">
									<p className="font-semibold text-lg tracking-tight">
										Preparando sua análise
									</p>
									<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
										Estamos consolidando os dados do período e organizando os
										achados em comportamentos, gatilhos, recomendações e
										melhorias.
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((category) => {
					const Icon = category.icon;

					return (
						<Card
							key={category.label}
							className="relative min-h-[390px] overflow-hidden"
						>
							<CardHeader className="pb-3">
								<div className="flex items-center gap-2">
									<Icon className={`size-5 ${category.color}`} />
									<span className={`font-semibold ${category.color}`}>
										{category.label}
									</span>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-4">
									{Array.from({ length: 5 }).map((_, index) => (
										<div className="space-y-2" key={index}>
											<div className="flex items-start gap-2">
												<Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
												<div className="flex-1 space-y-2">
													<Skeleton className="h-3.5 w-full" />
													<Skeleton className="h-3.5 w-[82%]" />
												</div>
											</div>
											{(index === 1 || index === 3) && (
												<Skeleton className="ml-6 h-10 w-[72%] rounded-xl" />
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

function ErrorState({
	title,
	error,
	onRetry,
}: {
	title: string;
	error: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
			<div className="flex flex-col gap-2">
				<h3 className="text-lg font-semibold text-destructive">{title}</h3>
				<p className="text-sm text-muted-foreground max-w-md">{error}</p>
			</div>
			<Button onClick={onRetry} variant="outline">
				Tentar novamente
			</Button>
		</div>
	);
}
