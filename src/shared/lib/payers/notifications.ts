import { inArray } from "drizzle-orm";
import { Resend } from "resend";
import { payers } from "@/db/schema";
import { db } from "@/shared/lib/db";
import { getResendFromEmail } from "@/shared/lib/email/resend";
import { formatCurrency } from "@/shared/utils/currency";
import { formatDateTime } from "@/shared/utils/date";

type ActionType = "created" | "deleted";

type NotificationEntry = {
	payerId: string;
	name: string | null;
	amount: number;
	transactionType: string | null;
	paymentMethod: string | null;
	condition: string | null;
	purchaseDate: Date | null;
	period: string | null;
	note: string | null;
};

type PayerNotificationRequest = {
	userLabel: string;
	action: ActionType;
	entriesByPayer: Map<string, NotificationEntry[]>;
};

type PayerNotificationRecipient = {
	id: string;
	name: string | null;
	email: string | null;
	isAutoSend: boolean | null;
};

const formatDate = (value: Date | null) => {
	return (
		formatDateTime(value, {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}) ?? "—"
	);
};

const buildHtmlBody = ({
	userLabel,
	action,
	entries,
}: {
	userLabel: string;
	action: ActionType;
	entries: NotificationEntry[];
}) => {
	const actionLabel =
		action === "created" ? "Novo lançamento registrado" : "Lançamento removido";
	const actionDescription =
		action === "created"
			? "Um novo lançamento foi registrado em seu nome."
			: "Um lançamento anteriormente registrado em seu nome foi removido.";

	const rows = entries
		.map((entry) => {
			const label =
				entry.transactionType === "Despesa"
					? `${formatCurrency(Math.abs(entry.amount))} (Despesa)`
					: `${formatCurrency(Math.abs(entry.amount))} (Receita)`;
			return `<tr>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${formatDate(
					entry.purchaseDate,
				)}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${
					entry.name ?? "Sem descrição"
				}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${
					entry.paymentMethod ?? "—"
				}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${
					entry.condition ?? "—"
				}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${label}</td>
      </tr>`;
		})
		.join("");

	return `
    <div style="font-family:'Inter',Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h2 style="margin:0 0 8px 0;font-size:20px;">${actionLabel}</h2>
      <p style="margin:0 0 16px 0;color:#475569;">${actionDescription}</p>

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;">Data</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;">Descrição</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;">Pagamento</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;">Condição</th>
            <th style="text-align:right;padding:8px;border-bottom:1px solid #e2e8f0;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="margin:0;font-size:12px;color:#94a3b8;">
        Enviado automaticamente por ${userLabel} via OpenMonetis.
      </p>
    </div>
  `;
};

export async function sendPayerAutoEmails({
	userLabel,
	action,
	entriesByPayer,
}: PayerNotificationRequest) {
	"use server";

	if (entriesByPayer.size === 0) {
		return;
	}

	const resendApiKey = process.env.RESEND_API_KEY;
	const resendFrom = getResendFromEmail();

	if (!resendApiKey) {
		console.warn(
			"RESEND_API_KEY não configurada. Envio automático de lançamentos ignorado.",
		);
		return;
	}

	const pagadorIds = Array.from(entriesByPayer.keys());
	if (pagadorIds.length === 0) {
		return;
	}

	const payerRows = (await db.query.payers.findMany({
		where: inArray(payers.id, pagadorIds),
	})) as PayerNotificationRecipient[];

	if (payerRows.length === 0) {
		return;
	}

	const resend = new Resend(resendApiKey);
	const subjectPrefix =
		action === "created" ? "Novo lançamento" : "Lançamento removido";

	const results = await Promise.allSettled(
		payerRows.map(async (payer: PayerNotificationRecipient) => {
			if (!payer.email || !payer.isAutoSend) {
				return;
			}

			const entries = entriesByPayer.get(payer.id);
			if (!entries || entries.length === 0) {
				return;
			}

			const html = buildHtmlBody({
				userLabel,
				action,
				entries,
			});

			await resend.emails.send({
				from: resendFrom,
				to: payer.email,
				subject: `${subjectPrefix} - ${payer.name}`,
				html,
			});
		}),
	);

	// Log any failed email sends
	results.forEach((result: PromiseSettledResult<void>, index: number) => {
		if (result.status === "rejected") {
			const pagador = payerRows[index];
			console.error(
				`Failed to send email notification to ${pagador?.name} (${pagador?.email}):`,
				result.reason,
			);
		}
	});
}

type RawNotificationRecord = {
	payerId: string | null;
	name: string | null;
	amount: string | number | null;
	transactionType: string | null;
	paymentMethod: string | null;
	condition: string | null;
	purchaseDate: Date | string | null;
	period: string | null;
	note: string | null;
};

export const buildEntriesByPayer = (
	records: RawNotificationRecord[],
): Map<string, NotificationEntry[]> => {
	const map = new Map<string, NotificationEntry[]>();

	records.forEach((record) => {
		if (!record.payerId) {
			return;
		}

		const amount =
			typeof record.amount === "number"
				? record.amount
				: Number(record.amount ?? 0);
		const purchaseDate =
			record.purchaseDate instanceof Date
				? record.purchaseDate
				: record.purchaseDate
					? new Date(record.purchaseDate)
					: null;

		const entry: NotificationEntry = {
			payerId: record.payerId,
			name: record.name ?? null,
			amount,
			transactionType: record.transactionType ?? null,
			paymentMethod: record.paymentMethod ?? null,
			condition: record.condition ?? null,
			purchaseDate,
			period: record.period ?? null,
			note: record.note ?? null,
		};

		const list = map.get(record.payerId) ?? [];
		list.push(entry);
		map.set(record.payerId, list);
	});

	return map;
};
