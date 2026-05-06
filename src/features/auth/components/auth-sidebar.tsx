import {
	RiBankCardLine,
	RiBarChart2Line,
	RiShieldCheckLine,
} from "@remixicon/react";
import { Logo } from "@/shared/components/brand/logo";
import { DotPattern } from "@/shared/components/ui/dot-pattern";
import { AuthSidebarInvoicesMock } from "./auth-sidebar-invoices-mock";

function FeatureItem({
	icon: Icon,
	text,
}: {
	icon: React.ComponentType<{ className?: string }>;
	text: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/12">
				<Icon className="h-3.5 w-3.5 text-black/55" />
			</div>
			<span className="text-sm font-medium text-black/68">{text}</span>
		</div>
	);
}

function AuthSidebar() {
	return (
		<div className="relative hidden flex-col overflow-hidden bg-primary md:flex">
			<div className="pointer-events-none absolute inset-0">
				<DotPattern
					width={18}
					height={18}
					cx={1.15}
					cy={1.15}
					cr={1.15}
					className="text-black/10 mask-[radial-gradient(circle_at_top_left,black,transparent_80%)]"
				/>
				<div className="absolute inset-0 bg-linear-to-br from-white/9 via-transparent to-black/7" />
			</div>

			<div className="relative flex flex-1 flex-col justify-between p-10 lg:p-12">
				<Logo
					variant="compact"
					invertTextOnDark={false}
					className="opacity-92 [&_img]:brightness-0 [&_img]:saturate-0"
				/>

				<div className="flex flex-1 items-center justify-center py-10">
					<div className="w-full rotate-[1.5deg]">
						<AuthSidebarInvoicesMock />
					</div>
				</div>

				<div className="space-y-3">
					<FeatureItem
						icon={RiBarChart2Line}
						text="Controle de gastos por categoria"
					/>
					<FeatureItem
						icon={RiBankCardLine}
						text="Faturas e cartões centralizados"
					/>
					<FeatureItem
						icon={RiShieldCheckLine}
						text="Seus dados, sem rastreamento"
					/>
				</div>
			</div>
		</div>
	);
}

export default AuthSidebar;
