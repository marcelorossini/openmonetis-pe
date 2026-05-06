import {
	PAYMENT_METHODS,
	TRANSACTION_CONDITIONS,
	TRANSACTION_TYPES,
} from "@/features/transactions/lib/constants";

export const INITIAL_BALANCE_CATEGORY_NAME = "Saldo inicial";
export const INITIAL_BALANCE_NOTE = "saldo inicial";

export const INITIAL_BALANCE_CONDITION =
	TRANSACTION_CONDITIONS.find((condition) => condition === "À vista") ??
	"À vista";
export const INITIAL_BALANCE_PAYMENT_METHOD =
	PAYMENT_METHODS.find((method) => method === "Pix") ?? "Pix";
export const INITIAL_BALANCE_TRANSACTION_TYPE =
	TRANSACTION_TYPES.find((type) => type === "Receita") ?? "Receita";

export const ACCOUNT_AUTO_INVOICE_NOTE_PREFIX = "AUTO_FATURA:";

export const buildInvoicePaymentNote = (cardId: string, period: string) =>
	`${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}${cardId}:${period}`;

export const INVOICE_ADJUSTMENT_NAME = "Ajuste de fatura";

export const ACCOUNT_BALANCE_ADJUSTMENT_NAME = "Ajuste de saldo";

export const REFUND_NOTE_PREFIX = "AUTO_REEMBOLSO:";

export const buildRefundNote = (originalTransactionId: string) =>
	`${REFUND_NOTE_PREFIX}${originalTransactionId}`;

export const isRefundNote = (note: string | null | undefined) =>
	note?.startsWith(REFUND_NOTE_PREFIX) ?? false;

export const isAccountInactive = (status: string | null | undefined) =>
	status?.toLowerCase() === "inativa";
