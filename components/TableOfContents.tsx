"use client";

import { useEffect, useState } from "react";

type NavEntry = { id: string; number: string; label: string };

export function TableOfContents({ entries }: { entries: NavEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = entries
      .map((e) => document.getElementById(e.id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
          history.replaceState(null, "", `#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [entries]);

  const Nav = (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        On this page
      </p>
      <ol className="mt-3 space-y-0.5">
        {entries.map((e) => {
          const isActive = active === e.id;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                className={`block rounded-md px-3 py-2 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "bg-brand-green/10 font-semibold text-brand-green"
                    : "text-text-primary hover:bg-toc-hover"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {e.number && (
                  <span className="mr-1.5 tabular-nums text-text-secondary">{e.number}.</span>
                )}
                {e.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <>
      <aside
        data-toc-rail
        className="no-print sticky top-6 hidden h-fit w-toc-rail shrink-0 lg:block"
      >
        <div className="rounded-xl border border-border-default bg-surface-card p-4 shadow-rail">
          {Nav}
        </div>
      </aside>
      <div data-toc-rail className="no-print lg:hidden">
        <button
          type="button"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-border-default bg-surface-card px-5 py-3 text-sm font-semibold text-brand-green shadow-card"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span aria-hidden>☰</span>
          Sections
        </button>
        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-text-primary/20 backdrop-blur-sm"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-x-4 bottom-20 z-50 max-h-[65vh] overflow-y-auto rounded-xl border border-border-default bg-surface-card p-4 shadow-card">
              {Nav}
            </div>
          </>
        )}
      </div>
    </>
  );
}
