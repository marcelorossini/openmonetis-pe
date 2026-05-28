"use server";

import { generateObject } from "ai";
import { getUser } from "@/shared/lib/auth/server";
import {
	type InsightsResponse,
	InsightsResponseSchema,
} from "@/shared/lib/schemas/insights";
import { INSIGHTS_SYSTEM_PROMPT } from "../constants";
import { resolveInsightsModel } from "../lib/model-provider";
import { USER_INSTRUCTIONS_MAX_LENGTH } from "../lib/user-instructions";
import { aggregateMonthData } from "./aggregate";
import type { ActionResult } from "./types";

const PERIOD_REGEX = /^\d{4}-\d{2}$/;

export async function generateInsightsAction(
	period: string,
	modelId: string,
	userInstructions?: string,
): Promise<ActionResult<InsightsResponse>> {
	try {
		const user = await getUser();

		if (!PERIOD_REGEX.test(period)) {
			return {
				success: false,
				error: "Período inválido (formato esperado: YYYY-MM)",
			};
		}

		const normalizedUserInstructions = userInstructions?.trim() ?? "";
		if (normalizedUserInstructions.length > USER_INSTRUCTIONS_MAX_LENGTH) {
			return {
				success: false,
				error: `As orientações devem ter no máximo ${USER_INSTRUCTIONS_MAX_LENGTH} caracteres.`,
			};
		}

		const resolvedModel = resolveInsightsModel(modelId);
		if (!resolvedModel.success) {
			return resolvedModel;
		}

		const aggregatedData = await aggregateMonthData(user.id, period);

		const result = await generateObject({
			model: resolvedModel.model,
			schema: InsightsResponseSchema,
			system: INSIGHTS_SYSTEM_PROMPT,
			prompt: `Analise os seguintes dados financeiros agregados do período ${period}.

Dados agregados:
${JSON.stringify(aggregatedData, null, 2)}

DADOS IMPORTANTES PARA SUA ANÁLISE:

**Tendência de 3 meses:**
- Os dados incluem tendência dos últimos 3 meses (threeMonthTrend)
- Use isso para identificar padrões crescentes, decrescentes ou estáveis
- Compare o mês atual com a média dos 3 meses

**Análise de Recorrência:**
- Gastos recorrentes representam ${aggregatedData.recurringExpenses.percentageOfTotal.toFixed(1)}% das despesas
- ${aggregatedData.recurringExpenses.count} gastos identificados como recorrentes
- Use isso para avaliar previsibilidade e oportunidades de otimização

**Gastos Parcelados:**
- ${aggregatedData.installments.currentMonthInstallments} parcelas ativas no mês
- Comprometimento futuro de R$ ${aggregatedData.installments.futureCommitment.toFixed(2)}
- Use isso para alertas sobre comprometimento de renda futura

ORIENTAÇÕES DO USUÁRIO PARA ESTA ANÁLISE:
${normalizedUserInstructions || "Nenhuma orientação adicional."}

Use as orientações do usuário apenas para priorizar achados, ajustar foco e calibrar o tom da análise. Não ignore o schema obrigatório, não invente dados que não estejam nos agregados e não execute ações ou alterações no sistema.

Organize suas observações nas 4 categories especificadas no prompt do sistema:
1. Comportamentos Observados (behaviors): 3-6 itens
2. Gatilhos de Consumo (triggers): 3-6 itens
3. Recomendações Práticas (recommendations): 3-6 itens
4. Melhorias Sugeridas (improvements): 3-6 itens

Cada item deve ser conciso, direto e acionável. Use os novos dados para dar contexto temporal e identificar padrões mais profundos.

Responda APENAS com um JSON válido seguindo exatamente o schema especificado.`,
		});

		const validatedData = InsightsResponseSchema.parse(result.object);

		return {
			success: true,
			data: validatedData,
		};
	} catch (error) {
		console.error("Error generating insights:", error);
		return {
			success: false,
			error: "Erro ao gerar insights. Tente novamente.",
		};
	}
}
