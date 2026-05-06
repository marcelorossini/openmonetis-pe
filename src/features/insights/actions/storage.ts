"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { savedInsights } from "@/db/schema";
import { getUser } from "@/shared/lib/auth/server";
import { db } from "@/shared/lib/db";
import type { InsightsResponse } from "@/shared/lib/schemas/insights";
import type { ActionResult } from "./types";

const periodSchema = z
	.string()
	.regex(/^\d{4}-\d{2}$/, "Período inválido (formato esperado: YYYY-MM)");

export async function saveInsightsAction(
	period: string,
	modelId: string,
	data: InsightsResponse,
): Promise<ActionResult<{ id: string; createdAt: Date }>> {
	try {
		const user = await getUser();
		const validatedPeriod = periodSchema.safeParse(period);
		if (!validatedPeriod.success) {
			return {
				success: false,
				error: validatedPeriod.error.issues[0]?.message ?? "Período inválido",
			};
		}
		period = validatedPeriod.data;

		const existing = await db
			.select()
			.from(savedInsights)
			.where(
				and(
					eq(savedInsights.userId, user.id),
					eq(savedInsights.period, period),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			const updated = await db
				.update(savedInsights)
				.set({
					modelId,
					data: JSON.stringify(data),
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(savedInsights.userId, user.id),
						eq(savedInsights.period, period),
					),
				)
				.returning({
					id: savedInsights.id,
					createdAt: savedInsights.createdAt,
				});

			const updatedRecord = updated[0];
			if (!updatedRecord) {
				return {
					success: false,
					error: "Falha ao atualizar a análise. Tente novamente.",
				};
			}

			return {
				success: true,
				data: {
					id: updatedRecord.id,
					createdAt: updatedRecord.createdAt,
				},
			};
		}

		const result = await db
			.insert(savedInsights)
			.values({
				userId: user.id,
				period,
				modelId,
				data: JSON.stringify(data),
			})
			.returning({
				id: savedInsights.id,
				createdAt: savedInsights.createdAt,
			});

		const insertedRecord = result[0];
		if (!insertedRecord) {
			return {
				success: false,
				error: "Falha ao salvar a análise. Tente novamente.",
			};
		}

		return {
			success: true,
			data: {
				id: insertedRecord.id,
				createdAt: insertedRecord.createdAt,
			},
		};
	} catch (error) {
		console.error("Error saving insights:", error);
		return {
			success: false,
			error: "Erro ao salvar análise. Tente novamente.",
		};
	}
}

export async function deleteSavedInsightsAction(
	period: string,
): Promise<ActionResult<void>> {
	try {
		const user = await getUser();
		const validatedPeriod = periodSchema.safeParse(period);
		if (!validatedPeriod.success) {
			return {
				success: false,
				error: validatedPeriod.error.issues[0]?.message ?? "Período inválido",
			};
		}
		period = validatedPeriod.data;

		await db
			.delete(savedInsights)
			.where(
				and(
					eq(savedInsights.userId, user.id),
					eq(savedInsights.period, period),
				),
			);

		return {
			success: true,
			data: undefined,
		};
	} catch (error) {
		console.error("Error deleting saved insights:", error);
		return {
			success: false,
			error: "Erro ao remover análise. Tente novamente.",
		};
	}
}
