import { logoDisplayNames } from "./display-names";

/**
 * Normalizes logo path to get just the filename
 */
export const normalizeLogo = (logo?: string | null) =>
	logo?.split("/").filter(Boolean).pop() ?? "";

/**
 * Normalizes a string for accent-insensitive search.
 * Removes diacritics and converts to lowercase.
 */
export const normalizeForSearch = (text: string): string =>
	text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

/**
 * Gets the display name for a logo, using a manual dictionary first
 * and falling back to deriveNameFromLogo for unknown logos.
 */
export const getLogoDisplayName = (logo?: string | null): string => {
	if (!logo) return "";

	const fileName = normalizeLogo(logo);
	if (!fileName) return "";

	return logoDisplayNames[fileName.toLowerCase()] ?? deriveNameFromLogo(logo);
};

/**
 * Derives a display name from a logo filename
 * @param logo - Logo path or filename
 * @returns Formatted display name
 * @example
 * deriveNameFromLogo("my-company-logo.png") // "My Company Logo"
 */
export const deriveNameFromLogo = (logo?: string | null) => {
	if (!logo) {
		return "";
	}

	const fileName = normalizeLogo(logo);

	if (!fileName) {
		return "";
	}

	const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
	return withoutExtension
		.split(/[-_.\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join(" ");
};

/**
 * Normaliza o nome do estabelecimento para usar como chave de lookup no banco.
 */
export const toNameKey = (name: string): string => name.trim().toLowerCase();

// === Logo.dev ===
//
// A construção de URLs e a leitura do token acontecem server-side em
// `./server.ts`. O cliente consome `logoUrl` pré-construída a partir das
// API routes (`/api/logo/mapping` e `/api/logo/search`) e usa o
// `LogoDevProvider` para saber se a integração está habilitada.

export const logoQueryKeys = {
	mapping: (nameKey: string) => ["logo-mapping", nameKey] as const,
	search: (query: string) => ["logo-search", query] as const,
};

// === Local logo resolution ===

const LOGO_SRC_PATTERN = /^(https?:\/\/|data:)/;

type ResolveLogoSrcOptions = {
	basePath?: string;
};

export const resolveLogoSrc = (
	logo?: string | null,
	options?: ResolveLogoSrcOptions,
) => {
	if (!logo) {
		return null;
	}

	if (LOGO_SRC_PATTERN.test(logo)) {
		return logo;
	}

	if (logo.startsWith("/")) {
		return logo;
	}

	const fileName = normalizeLogo(logo);
	if (!fileName) {
		return null;
	}

	const basePath = options?.basePath?.replace(/\/$/, "") || "/logos";
	return `${basePath}/${fileName}`;
};
