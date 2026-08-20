"use client";

import { useEffect, useState } from "react";
import { boardPaper } from "@/content/board-paper";
import { AnnotationLayer } from "./AnnotationLayer";
import { CoverBlock } from "./CoverBlock";
import { PeriodSwitcher } from "./PeriodSwitcher";
import { ReadingProgress } from "./ReadingProgress";
import { SectionBlock } from "./SectionBlock";
import { TableOfContents } from "./TableOfContents";

export function DocumentShell({ viewerName }: { viewerName: string | null }) {
  const { cover, sections } = boardPaper;
  const [stamp, setStamp] = useState("");
  const tocEntries = [
    { id: "cover", number: "", label: "Overview" },
    ...sections.map((s, i) => ({
      id: s.id,
      number: String(i + 1),
      label: s.title.replace(/^\d+\.\s*/, ""),
    })),
  ];

  useEffect(() => {
    setStamp(new Date().toLocaleString());
  }, []);

  const watermarkLabel = stamp
    ? `${viewerName ?? "Confidential"} · ${stamp}`
    : (viewerName ?? "Confidential");

  return (
    <>
      <ReadingProgress />
      <div
        className="watermark pointer-events-none fixed inset-0 z-0 overflow-hidden print:opacity-[0.08]"
        aria-hidden
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <p
            key={i}
            className="whitespace-nowrap text-[11px] text-watermark"
            style={{
              transform: `rotate(-30deg) translate(${i * 120}px, ${i * 80}px)`,
            }}
          >
            {watermarkLabel}
          </p>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-page-x py-6 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <TableOfContents entries={tocEntries} />
          <article data-annotatable className="min-w-0 flex-1 lg:max-w-[52rem]">
            <CoverBlock cover={cover} />
            <div data-progress-start aria-hidden />
            <div className="mt-10 space-y-8">
              {sections.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))}
            </div>
            <div data-progress-end aria-hidden />
          </article>
        </div>
      </div>

      <PeriodSwitcher />
      <AnnotationLayer />

      <a href="/do-not-follow" className="sr-only" aria-hidden tabIndex={-1}>
        do not follow
      </a>
    </>
  );
}
