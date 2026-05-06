/**
 * Parcela elegível para antecipação
 */
export type EligibleInstallment = {
	id: string;
	name: string;
	amount: string;
	period: string;
	purchaseDate: Date;
	dueDate: Date | null;
	currentInstallment: number | null;
	installmentCount: number | null;
	paymentMethod: string;
	categoryId: string | null;
	payerId: string | null;
};

/**
 * Input para criar antecipação
 */
export type CreateAnticipationInput = {
	seriesId: string;
	installmentIds: string[];
	anticipationPeriod: string;
	discount?: number;
	payerId?: string;
	categoryId?: string;
	note?: string;
};

/**
 * Input para cancelar antecipação
 */
export type CancelAnticipationInput = {
	anticipationId: string;
};
