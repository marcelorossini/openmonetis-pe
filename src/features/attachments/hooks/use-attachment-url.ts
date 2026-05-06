"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchJson } from "@/shared/utils/fetch-json";

const ATTACHMENT_URL_STALE_TIME = 4 * 60 * 1000;

const attachmentUrlQueryKey = (attachmentId: string) =>
	["attachments", "url", attachmentId] as const;

export function useAttachmentUrlQuery(attachmentId: string, enabled: boolean) {
	return useQuery({
		queryKey: attachmentUrlQueryKey(attachmentId),
		queryFn: async () => {
			const payload = await fetchJson<{ url: string }>(
				`/api/attachments/${attachmentId}/presign`,
			);

			return payload.url;
		},
		enabled: enabled && Boolean(attachmentId),
		staleTime: ATTACHMENT_URL_STALE_TIME,
		gcTime: ATTACHMENT_URL_STALE_TIME * 2,
	});
}

export function useAttachmentUrl(attachmentId: string) {
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		void attachmentId;
		setIsVisible(false);
		const el = containerRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				observer.disconnect();
				setIsVisible(true);
			},
			{ rootMargin: "150px" },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [attachmentId]);

	const { data: url } = useAttachmentUrlQuery(attachmentId, isVisible);

	return { url: url ?? null, containerRef };
}
