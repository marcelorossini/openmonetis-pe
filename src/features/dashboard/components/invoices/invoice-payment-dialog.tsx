import {
	RiCalendarLine,
	RiLoader4Line,
	RiMoneyDollarCircleLine,
} from "@remixicon/react";
import {
	formatInvoicePaymentDate,
	getInvoiceStatusBadgeVariant,
	type InvoiceDialogState,
	parseInvoiceDueDate,
} from "@/features/dashboard/invoices/invoices-helpers";
import type {
	DashboardInvoice,
	InvoicePaymentAccountOption,
} from "@/features/dashboard/invoices/invoices-queries";
import { AccountCardSelectContent } from "@/features/transactions/components/select-items";
import { PaymentSuccess } from "@/shared/components/feedback/payment-success";
import MoneyValues from "@/shared/components/money-values";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import {
	INVOICE_PAYMENT_STATUS,
	INVOICE_STATUS_LABEL,
} from "@/shared/lib/invoices";
import { InvoiceLogo } from "./invoice-logo";

type InvoicePaymentDialogProps = {
	invoice: DashboardInvoice | null;
	open: boolean;
	modalState: InvoiceDialogState;
	isPending: boolean;
	paymentAccountId: string;
	onPaymentAccountChange: (accountId: string) => void;
	paymentDate: Date;
	onPaymentDateChange: (date: Date) => void;
	paymentAccountOptions: InvoicePaymentAccountOption[];
	onClose: () => void;
	onConfirm: () => void;
};

export function InvoicePaymentDialog({
	invoice,
	open,
	modalState,
	isPending,
	paymentAccountId,
	onPaymentAccountChange,
	paymentDate,
	onPaymentDateChange,
	paymentAccountOptions,
	onClose,
	onConfirm,
}: InvoicePaymentDialogProps) {
	const isProcessing = modalState === "processing" || isPending;
	const paymentInfo = invoice ? formatInvoicePaymentDate(invoice.paidAt) : null;
	const dueInfo = invoice
		? parseInvoiceDueDate(invoice.period, invoice.dueDay)
		: null;
	const isInvoicePending =
		invoice?.paymentStatus === INVOICE_PAYMENT_STATUS.PENDING;
	const paymentDateValue = paymentDate.toISOString().split("T")[0] ?? "";
	const selectedAccount = paymentAccountOptions.find(
		(option) => option.value === paymentAccountId,
	);

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (nextOpen || isProcessing) {
					return;
				}
				onClose();
			}}
		>
			<DialogContent
				className="max-w-[calc(100%-2rem)] sm:max-w-md sm:p-8"
				onEscapeKeyDown={(event) => {
					if (isProcessing) {
						event.preventDefault();
					}
				}}
				onPointerDownOutside={(event) => {
					if (isProcessing) {
						event.preventDefault();
					}
				}}
			>
				{modalState === "success" ? (
					<PaymentSuccess
						title="Pagamento confirmado!"
						description="Atualizamos o status da fatura. O lançamento do pagamento aparecerá no extrato em instantes."
						onClose={onClose}
					/>
				) : (
					<>
						<DialogHeader>
							<div className="mb-1 flex items-center gap-3">
								<div>
									<DialogTitle>Confirmar pagamento</DialogTitle>
									<DialogDescription className="mt-1 text-xs">
										{isInvoicePending
											? "Escolha a conta de origem e a data em que a fatura foi paga."
											: "Fatura do cartão"}
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>

						{invoice ? (
							<div className="space-y-3">
								<Card className="flex flex-row items-start gap-2 p-4">
									<InvoiceLogo
										cardName={invoice.cardName}
										logo={invoice.logo}
										size={36}
										tone="accent"
										containerClassName="size-9 shrink-0"
										fallbackClassName="text-xs"
									/>
									<div className="min-w-0">
										<p className="text-xs font-medium text-muted-foreground uppercase">
											Cartão
										</p>
										<p className="truncate text-base font-semibold text-foreground">
											{invoice.cardName}
										</p>
									</div>
								</Card>

								<div className="grid grid-cols-2 gap-3">
									<Card className="p-3">
										<div className="flex items-center gap-1.5 text-muted-foreground">
											<RiMoneyDollarCircleLine className="size-3.5" />
											<span className="text-xs font-medium uppercase">
												Total da fatura
											</span>
										</div>
										<MoneyValues
											amount={Math.abs(invoice.totalAmount)}
											className="text-xl font-semibold"
										/>
									</Card>

									<Card className="p-3">
										<div className="flex items-center gap-1.5 text-muted-foreground">
											<RiCalendarLine className="size-3.5" />
											<span className="text-xs font-medium uppercase">
												{invoice.paymentStatus === INVOICE_PAYMENT_STATUS.PAID
													? "Pago em"
													: "Vencimento"}
											</span>
										</div>
										<div className="font-semibold">
											{invoice.paymentStatus === INVOICE_PAYMENT_STATUS.PAID
												? (paymentInfo?.label?.replace(/^Pago em\s*/u, "") ??
													"—")
												: (dueInfo?.label?.replace(/^Vence (em|dia)\s*/u, "") ??
													"—")}
										</div>
									</Card>
								</div>

								<Separator />

								{isInvoicePending ? (
									<div className="space-y-3">
										<div className="space-y-2">
											<Label htmlFor="invoice-widget-payment-account">
												Conta de pagamento
											</Label>
											<Select
												value={paymentAccountId}
												onValueChange={onPaymentAccountChange}
												disabled={
													isProcessing || paymentAccountOptions.length === 0
												}
											>
												<SelectTrigger
													id="invoice-widget-payment-account"
													className="w-full"
												>
													<SelectValue placeholder="Selecione uma conta">
														{selectedAccount ? (
															<AccountCardSelectContent
																label={selectedAccount.label}
																logo={selectedAccount.logo}
															/>
														) : null}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													{paymentAccountOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															<AccountCardSelectContent
																label={option.label}
																logo={option.logo}
															/>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="invoice-widget-payment-date">
												Data do pagamento
											</Label>
											<DatePicker
												id="invoice-widget-payment-date"
												value={paymentDateValue}
												onChange={(value) => {
													if (value) {
														onPaymentDateChange(new Date(`${value}T00:00:00`));
													}
												}}
												disabled={isProcessing}
											/>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between rounded-xl border p-3">
										<span className="text-sm text-muted-foreground">
											Status atual
										</span>
										<Badge
											variant={getInvoiceStatusBadgeVariant(
												INVOICE_STATUS_LABEL[invoice.paymentStatus],
											)}
										>
											{INVOICE_STATUS_LABEL[invoice.paymentStatus]}
										</Badge>
									</div>
								)}
							</div>
						) : null}

						<DialogFooter className="sm:justify-end">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isProcessing}
							>
								Cancelar
							</Button>
							<Button
								type="button"
								onClick={onConfirm}
								disabled={
									isProcessing ||
									!invoice ||
									(isInvoicePending &&
										(!paymentAccountId || paymentAccountOptions.length === 0))
								}
							>
								{isProcessing ? (
									<>
										<RiLoader4Line className="mr-1.5 size-4 animate-spin" />
										Processando...
									</>
								) : (
									"Confirmar"
								)}
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
