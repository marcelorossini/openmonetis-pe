import {
	type RemixiconComponentType,
	RiChatAi3Line,
	RiEyeLine,
	RiFlashlightLine,
	RiLightbulbLine,
	RiRocketLine,
	RiSparklingLine,
} from "@remixicon/react";
import type React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import type {
	InsightCategoryId,
	InsightsResponse,
} from "@/shared/lib/schemas/insights";
import { INSIGHT_CATEGORIES } from "@/shared/lib/schemas/insights";
import { displayPeriod } from "@/shared/utils/period";
import { cn } from "@/shared/utils/ui";

interface InsightsGridProps {
	insights: InsightsResponse;
	action?: React.ReactNode;
}

const CATEGORY_ICONS: Record<InsightCategoryId, RemixiconComponentType> = {
	behaviors: RiEyeLine,
	triggers: RiFlashlightLine,
	recommendations: RiLightbulbLine,
	improvements: RiRocketLine,
};

const CATEGORY_COLORS: Record<
	InsightCategoryId,
	{ titleText: string; chatAiIcon: string }
> = {
	behaviors: {
		titleText: "text-orange-700 dark:text-orange-400",
		chatAiIcon: "text-orange-600 dark:text-orange-400",
	},
	triggers: {
		titleText: "text-amber-700 dark:text-amber-400 ",
		chatAiIcon: "text-amber-600 dark:text-amber-400",
	},
	recommendations: {
		titleText: "text-sky-700 dark:text-sky-400",
		chatAiIcon: "text-sky-600 dark:text-sky-400",
	},
	improvements: {
		titleText: "text-emerald-700 dark:text-emerald-400",
		chatAiIcon: "text-emerald-600 dark:text-emerald-400",
	},
};

export function InsightsGrid({ insights, action }: InsightsGridProps) {
	const formattedPeriod = displayPeriod(insights.month);

	return (
		<div className="space-y-6">
			<Card className="overflow-hidden border-primary/10 bg-linear-to-br from-primary/10 via-card to-card">
				<CardContent className="px-4 py-1">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex gap-3">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
								<RiSparklingLine className="size-5" />
							</div>
							<div className="space-y-1">
								<p className="font-semibold text-lg tracking-tight">
									Análise pronta para {formattedPeriod}
								</p>
								<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
									Organizamos os sinais mais relevantes do período em quatro
									blocos: comportamentos, gatilhos, recomendações e
									oportunidades de melhoria.
								</p>
							</div>
						</div>
						{action && <div className="shrink-0">{action}</div>}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{insights.categories.map((categoryData) => {
					const categoryConfig = INSIGHT_CATEGORIES[categoryData.category];
					const colors = CATEGORY_COLORS[categoryData.category];
					const Icon = CATEGORY_ICONS[categoryData.category];

					return (
						<Card
							key={categoryData.category}
							className="relative overflow-hidden"
						>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Icon className={cn("size-5", colors.chatAiIcon)} />
									<CardTitle className={cn("font-semibold", colors.titleText)}>
										{categoryConfig.title}
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								{categoryData.items.map((item, index) => (
									<div
										key={index}
										className="flex flex-1 border-b border-dashed py-2.5 gap-2 items-start last:border-0"
									>
										<RiChatAi3Line
											className={cn("size-4 shrink-0", colors.chatAiIcon)}
										/>
										<span className="text-sm">{item.text}</span>
									</div>
								))}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
