"use client";

import { useEffect } from "react";
import type { Section as SectionType } from "@/content/board-paper";
import { SubsectionView } from "./SubsectionView";

export function SectionBlock({ section }: { section: SectionType }) {
  useEffect(() => {
    const el = document.getElementById(section.id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [section.id]);

  const sectionNumber = section.title.match(/^(\d+)\./)?.[1];
  const sectionTitle = section.title.replace(/^\d+\.\s*/, "");

  return (
    <section
      id={section.id}
      data-section-id={section.id}
      className="section-reveal scroll-mt-8"
    >
      <div className="section-card">
        <header className="mb-8 border-b-2 border-brand-orange pb-5">
          {sectionNumber && (
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-orange">
              Section {sectionNumber}
            </p>
          )}
          <h2 className="mt-1 text-heading-section font-bold tracking-tight text-text-primary">
            {sectionTitle}
          </h2>
        </header>
        {section.subsections?.map((sub) => (
          <SubsectionView key={sub.id} subsection={sub} />
        ))}
      </div>
    </section>
  );
}
