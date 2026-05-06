import { connection } from "next/server";
import { ImportPage } from "@/features/transactions/components/import/import-page";
import {
	buildOptionSets,
	buildSluggedFilters,
} from "@/features/transactions/lib/page-helpers";
import { fetchTransactionFilterSources } from "@/features/transactions/queries";
import { getUserId } from "@/shared/lib/auth/server";

export default async function Page() {
	await connection();
	const userId = await getUserId();
	const filterSources = await fetchTransactionFilterSources(userId);
	const sluggedFilters = buildSluggedFilters(filterSources);
	const {
		payerOptions,
		accountOptions,
		cardOptions,
		categoryOptions,
		defaultPayerId,
	} = buildOptionSets({
		...sluggedFilters,
		payerRows: filterSources.payerRows,
	});

	return (
		<main className="flex flex-col gap-6">
			<ImportPage
				payerOptions={payerOptions}
				accountOptions={accountOptions}
				cardOptions={cardOptions}
				categoryOptions={categoryOptions}
				defaultPayerId={defaultPayerId}
			/>
		</main>
	);
}
