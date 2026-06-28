import type { MetadataRoute } from "next";

const BASE_URL = process.env.PUBLIC_DOMAIN
	? `https://${process.env.PUBLIC_DOMAIN.replace(/^https?:\/\//, "")}`
	: "https://openmonetis-pe.com";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
	];
}
