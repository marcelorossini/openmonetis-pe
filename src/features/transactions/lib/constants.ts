export const TRANSACTION_TYPES = [
	"Despesa",
	"Receita",
	"Transferência",
] as const;

export const TRANSACTION_CONDITIONS = [
	"À vista",
	"Parcelado",
	"Recorrente",
] as const;

export const PAYMENT_METHODS = [
	"Cartão de crédito",
	"Cartão de débito",
	"Pix",
	"Dinheiro",
	"Boleto",
	"Pré-Pago | VR/VA",
	"Transferência bancária",
] as const;

export const CREDIT_CARD_PAYMENT_METHOD = "Cartão de crédito" as const;

export const SETTLEABLE_PAYMENT_METHODS = PAYMENT_METHODS.filter(
	(method) => method !== CREDIT_CARD_PAYMENT_METHOD,
);

export const SETTLED_FILTER_VALUES = {
	PAID: "pago",
	UNPAID: "nao-pago",
} as const;
