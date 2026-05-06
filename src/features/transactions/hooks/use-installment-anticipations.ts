"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchJson } from "@/shared/utils/fetch-json";

const anticipationItemSchema = z.object({
	id: z.string().uuid(),
	anticipationPeriod: z.string().regex(/^\d{4}-\d{2}$/),
	anticipationDate: z.string().min(1),
	installmentCount: z.number().int(),
	totalAmount: z.string(),
	discount: z.string(),
	transactionId: z.string().uuid(),
	note: z.string().nullable(),
	transaction: z
		.object({
			isSettled: z.boolean().nullable(),
		})
		.nullable(),
	payer: z
		.object({
			name: z.string().min(1),
		})
		.nullable(),
	category: z
		.object({
			name: z.string().min(1),
		})
		.nullable(),
});

export type InstallmentAnticipationListItem = z.infer<
	typeof anticipationItemSchema
>;

export const installmentAnticipationsQueryKey = (seriesId: string) =>
	["transactions", "installment-anticipations", seriesId] as const;

export function useInstallmentAnticipations(
	seriesId: string,
	enabled: boolean,
) {
	return useQuery({
		queryKey: installmentAnticipationsQueryKey(seriesId),
		queryFn: async () => {
			const payload = await fetchJson<unknown>(
				`/api/transactions/installments/${seriesId}/anticipations`,
			);

			return z.array(anticipationItemSchema).parse(payload);
		},
		enabled: enabled && Boolean(seriesId),
		staleTime: 30_000,
	});
}
