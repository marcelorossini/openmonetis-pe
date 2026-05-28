import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import { minimax } from "vercel-minimax-ai-provider";
import { AVAILABLE_MODELS } from "../constants";

const OPENROUTER_MODEL_REGEX = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._:-]+$/;

type ResolveInsightsModelResult =
	| { success: true; model: LanguageModel }
	| { success: false; error: string };

function stripProviderPrefix(
	modelId: string,
	provider: "openrouter" | "ollama",
) {
	return modelId.startsWith(`${provider}:`)
		? modelId.slice(`${provider}:`.length).trim()
		: modelId.trim();
}

export function resolveInsightsModel(
	modelId: string,
): ResolveInsightsModelResult {
	const normalizedModelId = modelId.trim();
	const selectedModel = AVAILABLE_MODELS.find(
		(m) => m.id === normalizedModelId,
	);
	const isOpenRouterModel =
		normalizedModelId.startsWith("openrouter:") ||
		(!selectedModel && OPENROUTER_MODEL_REGEX.test(normalizedModelId));
	const isOllamaModel = normalizedModelId.startsWith("ollama:");

	if (!selectedModel && !isOpenRouterModel && !isOllamaModel) {
		return {
			success: false,
			error: "Modelo inválido.",
		};
	}

	if (isOpenRouterModel) {
		const apiKey = process.env.OPENROUTER_API_KEY;
		if (!apiKey) {
			return {
				success: false,
				error:
					"OPENROUTER_API_KEY não configurada. Adicione a chave no arquivo .env",
			};
		}

		const openrouterModelId = stripProviderPrefix(
			normalizedModelId,
			"openrouter",
		);

		if (!openrouterModelId) {
			return {
				success: false,
				error: "Informe um modelo válido do OpenRouter.",
			};
		}

		const openrouter = createOpenRouter({ apiKey });
		return { success: true, model: openrouter.chat(openrouterModelId) };
	}

	if (isOllamaModel || selectedModel?.provider === "ollama") {
		const ollamaModelId = stripProviderPrefix(normalizedModelId, "ollama");
		if (!ollamaModelId) {
			return {
				success: false,
				error: "Informe um modelo válido do Ollama.",
			};
		}

		const ollama = createOpenAICompatible({
			name: "ollama",
			baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
			apiKey: process.env.OLLAMA_API_KEY || "ollama",
			supportsStructuredOutputs: false,
		});

		return { success: true, model: ollama.chatModel(ollamaModelId) };
	}

	if (selectedModel?.provider === "openai") {
		return { success: true, model: openai(normalizedModelId) };
	}

	if (selectedModel?.provider === "anthropic") {
		return { success: true, model: anthropic(normalizedModelId) };
	}

	if (selectedModel?.provider === "google") {
		return { success: true, model: google(normalizedModelId) };
	}

	if (selectedModel?.provider === "minimax") {
		return { success: true, model: minimax(normalizedModelId) };
	}

	return {
		success: false,
		error: "Provider de modelo não suportado.",
	};
}
