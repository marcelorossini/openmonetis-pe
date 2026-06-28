import {
	RiBankCard2Line,
	RiBarChartBoxLine,
	RiCalendarLine,
	RiCheckLine,
	RiCodeSSlashLine,
	RiDatabase2Line,
	RiDeviceLine,
	RiDownloadCloudLine,
	RiErrorWarningLine,
	RiEyeOffLine,
	RiFileTextLine,
	RiFlashlightLine,
	RiGitBranchLine,
	RiLayoutGridLine,
	RiLineChartLine,
	RiLockLine,
	RiNotification3Line,
	RiPercentLine,
	RiPieChartLine,
	RiRobot2Line,
	RiShieldCheckLine,
	RiSmartphoneLine,
	RiStarLine,
	RiTeamLine,
	RiTimeLine,
	RiWalletLine,
} from "@remixicon/react";
import type { ComponentType } from "react";

type FeatureItem = {
	icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
	title: string;
	description: string;
	colorVar: string;
};

export const navLinks = [
	{ href: "#funcionalidades", label: "Funcionalidades" },
	{ href: "#mobile", label: "Mobile" },
	{ href: "#stack", label: "Stack" },
	{ href: "#como-usar", label: "Como usar" },
	{ href: "#para-quem-e", label: "Para quem é" },
] as const;

export const mainFeatures: FeatureItem[] = [
	{
		icon: RiWalletLine,
		title: "Contas e transações",
		description:
			"Contas bancárias, cartões, dinheiro, entradas e saídas em um só lugar.",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiPercentLine,
		title: "Parcelamentos avançados",
		description:
			"Controle compras parceladas e antecipe parcelas com cálculo automático de desconto.",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiRobot2Line,
		title: "Insights com IA",
		description:
			"Análises por IA com insights sobre padrões de caixa, despesas e receitas.",
		colorVar: "var(--data-6)",
	},
	{
		icon: RiBarChartBoxLine,
		title: "Relatórios e gráficos",
		description:
			"20+ widgets interativos, relatórios por categoria e exportação em PDF e Excel.",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiBankCard2Line,
		title: "Faturas de cartão",
		description:
			"Acompanhe faturas por período, limites e vencimentos de cada cartão.",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiTeamLine,
		title: "Gestão colaborativa",
		description:
			"Compartilhe acesso com permissões granulares e notificações por e-mail.",
		colorVar: "var(--data-3)",
	},
];

export const extraFeatures: FeatureItem[] = [
	{
		icon: RiPieChartLine,
		title: "Categorias e orçamentos",
		description:
			"Categorias personalizadas para acompanhar limites, centros de custo e metas.",
		colorVar: "var(--data-6)",
	},
	{
		icon: RiFileTextLine,
		title: "Anotações e tarefas",
		description:
			"Notas, tarefas e anexos para manter contexto junto aos lançamentos.",
		colorVar: "var(--data-6)",
	},
	{
		icon: RiCalendarLine,
		title: "Calendário financeiro",
		description:
			"Visualize transações em calendário mensal para não perder prazos.",
		colorVar: "var(--data-2)",
	},
	{
		icon: RiDownloadCloudLine,
		title: "Importação em massa",
		description: "Importe extratos e múltiplos lançamentos de uma só vez.",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiEyeOffLine,
		title: "Modo privacidade",
		description:
			"Oculte valores com um clique. Tema dark/light e calculadora integrada.",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiFlashlightLine,
		title: "Performance otimizada",
		description: "Interface rápida e otimizada para uso diário.",
		colorVar: "var(--data-5)",
	},
];

export const companionBanks = [
	{ name: "Nubank", logo: "/logos/nubank.png" },
	{ name: "Itaú", logo: "/logos/itau.png" },
	{ name: "Inter", logo: "/logos/intermedium.png" },
	{ name: "Mercado Pago", logo: "/logos/mercadopagocartao.png" },
];

export const pwaHighlights: FeatureItem[] = [
	{
		icon: RiSmartphoneLine,
		title: "Instale direto da web",
		description: "Adicione à tela inicial e abra como app, sem loja.",
		colorVar: "var(--data-3)",
	},
	{
		icon: RiLayoutGridLine,
		title: "Acesso rápido ao que importa",
		description: "Dashboard, inbox e lançamentos a um toque.",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiFlashlightLine,
		title: "Experiência mobile mais direta",
		description: "Modo standalone com navegação limpa e fluida.",
		colorVar: "var(--data-4)",
	},
];

export const companionSteps: FeatureItem[] = [
	{
		icon: RiNotification3Line,
		title: "Notificação bancária chega",
		description: "O Companion identifica movimentações dos apps bancários",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiSmartphoneLine,
		title: "Dados extraídos e enviados",
		description: "Valor, descrição e banco são identificados",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiCheckLine,
		title: "Revise e confirme no OpenMonetis PE",
		description: "Pré-lançamentos ficam na inbox para sua aprovação",
		colorVar: "var(--data-5)",
	},
];

export const stackItems = [
	{
		icon: RiCodeSSlashLine,
		title: "Frontend",
		subtitle: "Next.js, TypeScript, Tailwind CSS, shadcn/ui",
		description: "Interface moderna e responsiva com React 19 e App Router",
		colorVar: "var(--data-3)",
	},
	{
		icon: RiDatabase2Line,
		title: "Backend",
		subtitle: "PostgreSQL, Drizzle ORM, Better Auth",
		description: "Banco relacional robusto com type-safe ORM",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiShieldCheckLine,
		title: "Segurança",
		subtitle: "Better Auth com OAuth (Google) e autenticação por email",
		description: "Sessões seguras e proteção de rotas por middleware",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiDeviceLine,
		title: "Deploy",
		subtitle:
			"Docker com multi-stage build, health checks e volumes persistentes",
		description: "Fácil de rodar localmente ou em qualquer servidor",
		colorVar: "var(--data-5)",
	},
];

export const whoIsItForItems: FeatureItem[] = [
	{
		icon: RiTimeLine,
		title: "Mantém a rotina financeira atualizada",
		description:
			"Dedica alguns minutos por dia ou semana para registrar e revisar movimentações",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiLockLine,
		title: "Quer controle total sobre seus dados",
		description:
			"Prefere hospedar os dados da empresa ao invés de depender de serviços terceiros",
		colorVar: "var(--data-5)",
	},
	{
		icon: RiLineChartLine,
		title: "Quer entender para onde o caixa vai",
		description:
			"Quer visualizar padrões de pagamento, recebimento e despesas para decidir melhor",
		colorVar: "var(--data-3)",
	},
	{
		icon: RiTimeLine,
		title: "Não é plug and play",
		description:
			"Você vai precisar configurar contas, categorias e contatos para refletir sua operação.",
		colorVar: "var(--data-4)",
	},
	{
		icon: RiShieldCheckLine,
		title: "Não é um ERP completo",
		description:
			"É um controle financeiro simples para pequenas empresas, não uma suíte fiscal ou contábil.",
		colorVar: "var(--data-1)",
	},
	{
		icon: RiErrorWarningLine,
		title: "Você opera sua própria instância",
		description:
			"Backups, acesso e segurança da instalação ficam sob responsabilidade de quem hospeda.",
		colorVar: "var(--data-5)",
	},
];

export function getMetricsItems(stars: number, forks: number) {
	return [
		{
			icon: RiLayoutGridLine,
			value: "20+",
			label: "Widgets no dashboard",
			colorVar: "var(--data-5)",
		},
		{
			icon: RiShieldCheckLine,
			value: "100%",
			label: "Self-hosted",
			colorVar: "var(--data-1)",
		},
		{
			icon: RiStarLine,
			value: `${stars}`,
			label: "Stars no GitHub",
			colorVar: "var(--data-4)",
		},
		{
			icon: RiGitBranchLine,
			value: `${forks}`,
			label: "Forks no GitHub",
			colorVar: "var(--data-3)",
		},
	];
}
