import { NextResponse } from "next/server";
import { fetchTransactionAttachments } from "@/features/transactions/lib/attachment-queries";
import { getOptionalUserSession } from "@/shared/lib/auth/server";

const PRIVATE_RESPONSE_HEADERS = {
	"Cache-Control": "private, no-store",
};

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ transactionId: string }> },
) {
	const [session, { transactionId }] = await Promise.all([
		getOptionalUserSession(),
		params,
	]);

	if (!session?.user) {
		return NextResponse.json(
			{ error: "Não autenticado" },
			{ status: 401, headers: PRIVATE_RESPONSE_HEADERS },
		);
	}

	const userId = session.user.id;
	const attachments = await fetchTransactionAttachments(userId, transactionId);

	return NextResponse.json(attachments, {
		headers: PRIVATE_RESPONSE_HEADERS,
	});
}
