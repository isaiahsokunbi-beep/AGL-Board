import Image from "next/image";
import { GateForm } from "@/components/GateForm";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Access — Agriarche Board Paper",
  robots: "noindex, nofollow",
};

export default function GatePage() {
  return (
    <main data-gate className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-page px-page-x">
      <Image
        src="/images/hero-field.png"
        alt=""
        fill
        className="object-cover object-center opacity-25"
        priority
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-surface-page/92 via-surface-page/88 to-brand-green/10"
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-xl border border-border-default bg-surface-card/95 p-8 shadow-card backdrop-blur-sm">
        <BrandLogo className="mb-6 h-auto w-[120px]" />
        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-2 text-body text-text-secondary">
          H1 2026 Performance Review — sign in to continue.
        </p>
        <GateForm />
      </div>
    </main>
  );
}
