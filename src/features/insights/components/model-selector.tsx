"use client";

import { useEffect, useMemo, useState } from "react";
import {
	type AIProvider,
	AVAILABLE_MODELS,
	DEFAULT_PROVIDER,
} from "@/features/insights/constants";
import { AnalysisSummaryCard } from "./analysis-summary-card";
import { CUSTOM_MODEL_VALUE, ModelSelectionCard } from "./model-selection-card";
import { ProviderSelectionCard } from "./provider-selection-card";

interface ModelSelectorProps {
	value: string;
	onValueChange: (value: string) => void;
	period: string;
	onAnalyze: () => void;
	userInstructions: string;
	onUserInstructionsChange: (value: string) => void;
	onCancel?: () => void;
	disabled?: boolean;
	isLoadingSavedInsights?: boolean;
}

const CUSTOM_MODEL_PROVIDERS = ["openrouter", "ollama"] as const;

function isCustomModelProvider(
	provider: AIProvider,
): provider is (typeof CUSTOM_MODEL_PROVIDERS)[number] {
	return CUSTOM_MODEL_PROVIDERS.includes(
		provider as (typeof CUSTOM_MODEL_PROVIDERS)[number],
	);
}

function getProviderFromValue(value: string): AIProvider | null {
	if (value.startsWith("openrouter:")) {
		return "openrouter";
	}

	if (value.startsWith("ollama:")) {
		return "ollama";
	}

	if (value.includes("/")) {
		return "openrouter";
	}

	return AVAILABLE_MODELS.find((model) => model.id === value)?.provider ?? null;
}

function stripCustomProviderPrefix(value: string, provider: AIProvider) {
	if (!isCustomModelProvider(provider)) {
		return value;
	}

	return value.startsWith(`${provider}:`)
		? value.slice(`${provider}:`.length)
		: value;
}

function getModelLabel(modelId: string) {
	const model = AVAILABLE_MODELS.find((item) => item.id === modelId);
	if (model) return model.name;

	const provider = getProviderFromValue(modelId);
	return provider ? stripCustomProviderPrefix(modelId, provider) : modelId;
}

export function ModelSelector({
	value,
	onValueChange,
	period,
	onAnalyze,
	userInstructions,
	onUserInstructionsChange,
	onCancel,
	disabled,
	isLoadingSavedInsights,
}: ModelSelectorProps) {
	const [customModel, setCustomModel] = useState(value);

	useEffect(() => {
		const detectedProvider = getProviderFromValue(value);
		if (detectedProvider && isCustomModelProvider(detectedProvider)) {
			setCustomModel(stripCustomProviderPrefix(value, detectedProvider));
			return;
		}

		setCustomModel(value);
	}, [value]);

	const currentProvider = getProviderFromValue(value) ?? DEFAULT_PROVIDER;

	const modelsByProvider = useMemo(() => {
		const grouped: Record<
			AIProvider,
			Array<(typeof AVAILABLE_MODELS)[number]>
		> = {
			openai: [],
			anthropic: [],
			google: [],
			minimax: [],
			openrouter: [],
			ollama: [],
		};

		AVAILABLE_MODELS.forEach((model) => {
			grouped[model.provider].push(model);
		});

		return grouped;
	}, []);

	const providerModels = modelsByProvider[currentProvider];
	const selectedModelIsKnown = providerModels.some(
		(model) => model.id === value,
	);
	const selectValue = selectedModelIsKnown ? value : CUSTOM_MODEL_VALUE;
	const isCustomModelActive =
		isCustomModelProvider(currentProvider) && !selectedModelIsKnown;
	const selectedModelLabel = getModelLabel(value);
	const canAnalyze =
		!disabled &&
		!isLoadingSavedInsights &&
		selectedModelLabel.trim().length > 0;

	const handleProviderChange = (newProvider: AIProvider) => {
		if (newProvider === "openrouter") {
			setCustomModel("");
			onValueChange("openrouter:");
			return;
		}

		const firstModel = modelsByProvider[newProvider][0];
		if (firstModel) {
			onValueChange(firstModel.id);
			return;
		}

		if (isCustomModelProvider(newProvider)) {
			onValueChange(
				customModel ? `${newProvider}:${customModel}` : `${newProvider}:`,
			);
		}
	};

	const handleModelSelect = (modelId: string) => {
		if (modelId === CUSTOM_MODEL_VALUE) {
			setCustomModel("");
			onValueChange(`${currentProvider}:`);
			return;
		}

		onValueChange(modelId);
	};

	const handleCustomModelChange = (modelName: string) => {
		setCustomModel(modelName);
		onValueChange(`${currentProvider}:${modelName}`);
	};

	return (
		<section className="space-y-4">
			<div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-4">
					<ProviderSelectionCard
						currentProvider={currentProvider}
						disabled={disabled}
						onProviderChange={handleProviderChange}
					/>

					<ModelSelectionCard
						currentProvider={currentProvider}
						providerModels={providerModels}
						selectValue={selectValue}
						customModel={customModel}
						isCustomModelActive={isCustomModelActive}
						canUseCustomModel={isCustomModelProvider(currentProvider)}
						canAnalyze={canAnalyze}
						disabled={disabled}
						onModelSelect={handleModelSelect}
						onCustomModelChange={handleCustomModelChange}
						onCancel={onCancel}
						onAnalyze={onAnalyze}
					/>
				</div>

				<AnalysisSummaryCard
					period={period}
					currentProvider={currentProvider}
					selectedModelLabel={selectedModelLabel}
					userInstructions={userInstructions}
					onUserInstructionsChange={onUserInstructionsChange}
				/>
			</div>
		</section>
	);
}
