import { withAutoLinks } from "./ContentLinks";

const WIN_PATTERNS: RegExp[] = [
  /(\+[\d.]+%)/g,
  /(ahead of budget)/gi,
  /(bright spot)/gi,
  /(significantly in H1 2026)/gi,
  /(strong revenue performance)/gi,
  /(22\.5% year-on-year increase)/gi,
  /(more than offset)/gi,
];

const LOSS_PATTERNS: RegExp[] = [
  /(net loss was ₦[\d.]+M)/gi,
  /(−[\d.]+%)/g,
  /([\d.]+% below budget)/gi,
  /(₦[\d,.]+M shortfall)/gi,
  /(under-shot at [\d.]+%)/gi,
  /(largest single driver of the shortfall)/gi,
  /(weaker export performance)/gi,
];

type Part = { text: string; tone?: "win" | "loss" };

function splitByPatterns(text: string): Part[] {
  const matches: { start: number; end: number; tone: "win" | "loss"; text: string }[] = [];

  for (const pattern of WIN_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        tone: "win",
        text: m[0],
      });
    }
  }

  for (const pattern of LOSS_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        tone: "loss",
        text: m[0],
      });
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const merged: typeof matches = [];
  for (const m of matches) {
    const last = merged[merged.length - 1];
    if (last && m.start < last.end) continue;
    merged.push(m);
  }

  if (merged.length === 0) return [{ text }];

  const parts: Part[] = [];
  let cursor = 0;
  for (const m of merged) {
    if (m.start > cursor) parts.push({ text: text.slice(cursor, m.start) });
    parts.push({ text: m.text, tone: m.tone });
    cursor = m.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}

export function NarrativeHighlight({ text }: { text: string }) {
  return (
    <>
      {withAutoLinks(text, (segment, key) => (
        <NarrativeSegments key={key} text={segment} />
      ))}
    </>
  );
}

function NarrativeSegments({ text }: { text: string }) {
  const parts = splitByPatterns(text);

  return (
    <>
      {parts.map((part, i) => {
        if (!part.tone) return <span key={i}>{part.text}</span>;
        const className =
          part.tone === "win"
            ? "font-semibold text-variance-favourable underline decoration-variance-favourable/30 decoration-2 underline-offset-2"
            : "font-semibold text-variance-unfavourable underline decoration-variance-unfavourable/30 decoration-2 underline-offset-2";
        return (
          <span key={i} className={className}>
            {part.text}
          </span>
        );
      })}
    </>
  );
}
