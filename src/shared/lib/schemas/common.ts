import { z } from "zod";

/**
 * Common Zod schemas for reuse across the application
 */

/**
 * UUID schema with custom error message
 */
export const uuidSchema = (entityName: string = "ID") =>
	z
		.string({ message: `${entityName} inválido.` })
		.uuid(`${entityName} inválido.`);

/**
 * Required positive decimal schema — accepts number or numeric string.
 */
export const requiredDecimalSchema = (fieldName: string = "valor") =>
	z
		.union([
			z.number(),
			z
				.string()
				.trim()
				.min(1, `Informe o ${fieldName}.`)
				.transform((value) => value.replace(",", ".")),
		])
		.transform((value, ctx) => {
			const parsed =
				typeof value === "number" ? value : Number.parseFloat(value);
			if (Number.isNaN(parsed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Informe um valor numérico válido.",
				});
				return z.NEVER;
			}
			if (parsed <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Informe um ${fieldName} maior que zero.`,
				});
				return z.NEVER;
			}
			return parsed;
		});

/**
 * Day of month schema (1-31)
 */
export const dayOfMonthSchema = z
	.string({ message: "Informe o dia." })
	.trim()
	.min(1, "Informe o dia.")
	.refine((value) => {
		const parsed = Number.parseInt(value, 10);
		return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 31;
	}, "Informe um dia entre 1 e 31.");

/**
 * Period schema (YYYY-MM format)
 */
export const periodSchema = z
	.string({ message: "Informe o período." })
	.trim()
	.regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Período inválido.");

/**
 * Note/observation schema (max 500 chars, trimmed, nullable)
 */
export const noteSchema = z
	.string()
	.trim()
	.max(500, "A anotação deve ter no máximo 500 caracteres.")
	.nullable()
	.optional()
	.transform((value) => (value && value.length > 0 ? value : null));
