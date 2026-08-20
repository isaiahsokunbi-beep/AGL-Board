import Image from "next/image";
import { GateForm } from "@/components/GateForm";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Access — Agriarche Board Paper",
  robots: "noindex, nofollow",
};

export default function GatePage() {
  return (
    <main
      data-gate
      className="relative min-h-screen overflow-hidden bg-surface-page"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 0%, color-mix(in srgb, var(--color-brand-green) 12%, transparent), transparent), radial-gradient(ellipse 60% 40% at 90% 100%, color-mix(in srgb, var(--color-brand-orange) 10%, transparent), transparent)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-page-x py-10 sm:py-14">
        <BrandLogo priority className="mb-5 h-auto w-[130px] sm:w-[150px]" />

        <div className="relative min-h-[14rem] overflow-hidden rounded-xl sm:min-h-[18rem] lg:min-h-[20rem]">
          <Image
            src="/images/hero-field.png"
            alt="Agriarche field team in a rice paddy at harvest"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--color-surface-hero-overlay)" }}
            aria-hidden
          />
          <div className="relative flex h-full min-h-[14rem] flex-col justify-between p-6 sm:min-h-[18rem] sm:p-8 lg:min-h-[20rem] lg:p-10">
            <div>
              <p className="text-sm font-medium text-white/90">Agriarche Limited</p>
              <h1 className="mt-2 max-w-xl text-display-cover font-bold tracking-tight text-white drop-shadow-sm">
                Board Presentation
              </h1>
              <p className="mt-2 max-w-lg text-heading-cover-sub font-medium text-white/95 drop-shadow-sm">
                H1 2026 Performance Review
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/25 pt-4 text-sm text-white/90">
              <time dateTime="2026-06-30">June 30, 2026</time>
              <p>Prepared for the Board of Directors</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <div className="section-card">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange">
              Secure access
            </p>
            <h2 className="mt-1 text-heading-section font-bold tracking-tight text-text-primary">
              Sign in to continue
            </h2>
            <p className="mt-2 max-w-prose text-body leading-relaxed text-text-secondary">
              Enter your name and passphrase to open the H1 2026 board paper.
              Access is limited to board members and invited investors.
            </p>
            <GateForm />
          </div>

          <aside className="section-card space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange">
                Reporting period
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green">
                  <span className="h-2 w-2 rounded-full bg-brand-green" aria-hidden />
                  H1 2026
                </span>
                <span
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border-default bg-surface-metric px-4 py-2 text-sm font-semibold text-text-secondary"
                  title="H2 2026 board paper is in progress"
                >
                  H2 2026
                  <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                    In progress
                  </span>
                </span>
              </div>
            </div>
            <div className="border-t border-border-default pt-5">
              <p className="text-sm text-text-secondary">
                Confidential — for board and invited investors only. Do not
                distribute.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
