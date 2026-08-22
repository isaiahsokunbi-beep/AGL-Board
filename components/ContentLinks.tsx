import type { ReactNode } from "react";

/** Match http(s) URLs; trim common trailing punctuation from the match. */
const URL_RE = /https?:\/\/[^\s<>"']+/gi;

function cleanUrl(raw: string): { href: string; trailing: string } {
  let href = raw;
  let trailing = "";
  while (/[).,;:!?]$/.test(href)) {
    trailing = href.slice(-1) + trailing;
    href = href.slice(0, -1);
  }
  return { href, trailing };
}

export function splitUrls(text: string): { type: "text" | "url"; value: string }[] {
  const parts: { type: "text" | "url"; value: string }[] = [];
  let last = 0;
  const re = new RegExp(URL_RE.source, URL_RE.flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: "text", value: text.slice(last, m.index) });
    }
    const { href, trailing } = cleanUrl(m[0]);
    parts.push({ type: "url", value: href });
    if (trailing) parts.push({ type: "text", value: trailing });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

export function ContentLink({
  href,
  children,
}: {
  href: string;
  children?: ReactNode;
}) {
  const label = children ?? "Click the link to view the content";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className="font-medium text-link underline decoration-link/30 underline-offset-2 transition-colors hover:decoration-link"
    >
      {label}
    </a>
  );
}

/** Walk text, turning URLs into links and rendering other segments via `renderText`. */
export function withAutoLinks(
  text: string,
  renderText: (segment: string, key: number) => ReactNode,
): ReactNode[] {
  return splitUrls(text).map((part, i) =>
    part.type === "url" ? (
      <ContentLink key={`u-${i}`} href={part.value} />
    ) : (
      renderText(part.value, i)
    ),
  );
}
