"use client";

import { useState } from "react";
import { GLOSSARY } from "@/lib/glossary";

const TERMS = Object.keys(GLOSSARY);

export function GlossaryText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = { index: -1, term: "" };
    for (const term of TERMS) {
      const idx = remaining.indexOf(term);
      if (idx !== -1 && (earliest.index === -1 || idx < earliest.index)) {
        earliest = { index: idx, term };
      }
    }

    if (earliest.index === -1) {
      parts.push(remaining);
      break;
    }

    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    const term = earliest.term;
    parts.push(<GlossaryTerm key={key++} term={term} />);
    remaining = remaining.slice(earliest.index + term.length);
  }

  return <>{parts}</>;
}

function GlossaryTerm({ term }: { term: string }) {
  const [open, setOpen] = useState(false);
  const def = GLOSSARY[term as keyof typeof GLOSSARY];

  return (
    <span className="relative inline">
      <button
        type="button"
        className="border-b border-dotted border-glossary-underline bg-transparent p-0 font-inherit text-inherit"
        aria-describedby={open ? `def-${term}` : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {term}
      </button>
      {open && (
        <span
          id={`def-${term}`}
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-1 max-w-xs rounded-md border border-border-default bg-grays-white px-2 py-1 text-[11px] shadow-card"
        >
          {def}
        </span>
      )}
    </span>
  );
}
