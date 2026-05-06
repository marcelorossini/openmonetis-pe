"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { refundTransactionAction } from "@/features/transactions/actions/refund-action";
import { deriveCreditCardPeriod } from "@/features/transactions/lib/form-helpers";
import { formatDate } from "@/features/transactions/lib/formatting-helpers";
import { PeriodPicker } from "@/shared/components/period-picker";
import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { formatCurrency } from "@/shared/utils/currency";
import { derivePeriodFromDate, displayPeriod } from "@/shared/utils/period";
import type { SelectOption, TransactionItem } from "../types";

type RefundTransactionDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transaction: TransactionItem | null;
	cardOptions: SelectOption[];
};

const todayIso = () => new Date().toISOString().split("T")[0] ?? "";

function deriveDefaultRefundPeriod(
	refundDate: string,
	transaction: TransactionItem | null,
	card: SelectOption | null,
) {
	if (transaction?.cardId) {
		return deriveCreditCardPeriod(
			refundDate,
			card?.closingDay ?? null,
			card?.dueDay ?? null,
		);
	}

	return derivePeriodFromDate(refundDate);
}

export function RefundTransactionDialog({
	open,
	onOpenChange,
	transaction,
	cardOptions,
}: RefundTransactionDialogProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [refundDate, setRefundDate] = useState<string>(todayIso());
	const [refundPeriod, setRefundPeriod] = useState<string>("");

	const card = useMemo(() => {
		if (!transaction?.cardId) return null;
		return cardOptions.find((opt) => opt.value === transaction.cardId) ?? null;
	}, [transaction?.cardId, cardOptions]);

	useEffect(() => {
		if (open) {
			const today = todayIso();
			setRefundDate(today);
			setRefundPeriod(deriveDefaultRefundPeriod(today, transaction, card));
		}
	}, [open, transaction, card]);

	const defaultPeriod = useMemo(
		() => deriveDefaultRefundPeriod(refundDate, transaction, card),
		[refundDate, transaction, card],
	);

	if (!transaction) return null;

	const amountAbs = Math.abs(transaction.amount);
	const periodLabel = refundPeriod ? displayPeriod(refundPeriod) : "—";
	const destinationLabel = transaction.cardId
		? `na fatura de ${periodLabel}`
		: `no extrato de ${periodLabel}`;

	const handleSubmit = () => {
		if (!refundDate) {
			toast.error("Informe a data do reembolso.");
			return;
		}

		if (!refundPeriod) {
			toast.error("Informe o período do reembolso.");
			return;
		}

		startTransition(async () => {
			const result = await refundTransactionAction({
				originalTransactionId: transaction.id,
				refundDate,
				refundPeriod,
			});

			if (result.success) {
				toast.success(result.message);
				onOpenChange(false);
				router.refresh();
				return;
			}

			toast.error(result.error);
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Registrar reembolso</DialogTitle>
					<DialogDescription>
						Será criado um lançamento de reembolso espelhando esta despesa. O
						lançamento original será mantido.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
						<p className="font-medium text-foreground">{transaction.name}</p>
						<p className="text-muted-foreground">
							{formatCurrency(amountAbs)} •{" "}
							{formatDate(transaction.purchaseDate)} •{" "}
							{transaction.paymentMethod}
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="refund-date">Data do reembolso</Label>
						<DatePicker
							id="refund-date"
							value={refundDate}
							onChange={(value) => {
								if (!value) return;
								setRefundDate(value);
								setRefundPeriod(
									deriveDefaultRefundPeriod(value, transaction, card),
								);
							}}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="refund-period">
							{transaction.cardId
								? "Fatura do reembolso"
								: "Período do reembolso"}
						</Label>
						<PeriodPicker
							value={refundPeriod || defaultPeriod}
							onChange={setRefundPeriod}
							disabled={isPending}
							className="w-full"
						/>
						<p className="text-xs text-muted-foreground">
							O reembolso será lançado {destinationLabel}.
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={isPending}>
						{isPending ? "Registrando..." : "Registrar reembolso"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
