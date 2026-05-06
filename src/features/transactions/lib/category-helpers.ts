import type { SelectOption } from "@/features/transactions/components/types";
import { capitalize } from "@/shared/utils/string";

/**
 * Group label for category options
 */
type CategoryGroup = {
	label: string;
	options: SelectOption[];
};

/**
 * Normalizes category group labels (Despesa -> Despesas, Receita -> Receitas)
 */
function normalizeCategoryGroupLabel(value: string): string {
	const lower = value.toLowerCase();
	if (lower === "despesa") {
		return "Despesas";
	}
	if (lower === "receita") {
		return "Receitas";
	}
	return capitalize(value);
}

/**
 * Groups and sorts category options by their group property
 * @param categoryOptions - Array of category select options
 * @returns Array of grouped and sorted category options
 */
export function groupAndSortCategories(
	categoryOptions: SelectOption[],
): CategoryGroup[] {
	// Group category options by their group property
	const groups = categoryOptions.reduce<Record<string, SelectOption[]>>(
		(acc, option) => {
			const key = option.group ?? "Outros";
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(option);
			return acc;
		},
		{},
	);

	// Define preferred order (Despesa first, then Receita, then others)
	const preferredOrder = ["Despesa", "Receita"];
	const orderedKeys = [
		...preferredOrder.filter((key) => groups[key]?.length),
		...Object.keys(groups).filter((key) => !preferredOrder.includes(key)),
	];

	// Map to final structure with normalized labels and sorted options
	return orderedKeys.map((key) => ({
		label: normalizeCategoryGroupLabel(key),
		options: groups[key]
			.slice()
			.sort((a, b) =>
				a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" }),
			),
	}));
}

/**
 * Filters secondary payer options to exclude the primary payer
 */
export function filterSecondaryPayerOptions(
	allOptions: SelectOption[],
	primaryPayerId?: string,
): SelectOption[] {
	return allOptions.filter((option) => option.value !== primaryPayerId);
}
