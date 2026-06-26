import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandingProvider } from "@/shared/components/providers/branding-provider";
import { QueryProvider } from "@/shared/components/providers/query-provider";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { buildBrandingCssVariables } from "@/shared/lib/branding/color";
import { fetchAppBranding } from "@/shared/lib/branding/queries";
import "./globals.css";
import { bricolage } from "@/public/fonts/font_index";

export const metadata: Metadata = {
	title: {
		default: "OpenMonetis | Suas finanças, do seu jeito",
		template: "OpenMonetis | %s",
	},
	description:
		"Controle suas finanças pessoais de forma simples e transparente.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const branding = await fetchAppBranding();
	const brandingStyle = buildBrandingCssVariables(branding.primaryColorHex);

	return (
		<html
			data-scroll-behavior="smooth"
			lang="pt-BR"
			className={`${bricolage.className}`}
			suppressHydrationWarning
		>
			<head>
				<meta name="apple-mobile-web-app-title" content="OpenMonetis" />
				{process.env.UMAMI_URL && process.env.UMAMI_WEBSITE_ID && (
					<script
						defer
						src={`${process.env.UMAMI_URL}/script.js`}
						data-website-id={process.env.UMAMI_WEBSITE_ID}
						{...(process.env.UMAMI_DOMAINS
							? { "data-domains": process.env.UMAMI_DOMAINS }
							: {})}
					/>
				)}
			</head>
			<body
				className="antialiased"
				style={brandingStyle}
				suppressHydrationWarning
			>
				<BrandingProvider
					logoUrl={branding.logoUrl}
					logoFileName={branding.logoFileName}
				>
					<ThemeProvider attribute="class" defaultTheme="light">
						<QueryProvider>
							<Suspense>{children}</Suspense>
							<Toaster position="top-right" />
						</QueryProvider>
					</ThemeProvider>
				</BrandingProvider>
			</body>
		</html>
	);
}
