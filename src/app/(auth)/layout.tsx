import { Logo } from "@/shared/components/brand/logo";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background via-background to-muted/20 px-5 py-8 md:px-8 md:py-10">
			<div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
				<div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-blob mix-blend-multiply" />
				<div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-primary/7 blur-3xl animate-blob animation-delay-2000 mix-blend-multiply" />
				<div className="absolute -bottom-32 left-1/2 h-80 w-80 rounded-full bg-secondary/30 blur-3xl animate-blob animation-delay-4000 mix-blend-multiply" />
			</div>

			<div className="relative mb-6 flex md:hidden z-20">
				<Logo variant="compact" colorIcon />
			</div>

			<div className="relative w-full max-w-sm md:max-w-5xl">{children}</div>
		</div>
	);
}
