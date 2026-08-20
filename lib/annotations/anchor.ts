import type { Anchor } from "./types";

export type ResolveResult =
  | { status: "resolved"; start: number; end: number }
  | { status: "orphaned" };

export function resolveAnchor(
  sectionText: string,
  anchor: Anchor,
): ResolveResult {
  const { exact, prefix, suffix, startOffset } = anchor;

  // 1. Try exact offset
  const atOffset = sectionText.slice(startOffset, startOffset + exact.length);
  if (atOffset === exact) {
    return { status: "resolved", start: startOffset, end: startOffset + exact.length };
  }

  // 2. Prefix/suffix search within section
  const searchWindow = prefix + exact + suffix;
  const windowIndex = sectionText.indexOf(searchWindow);
  if (windowIndex !== -1) {
    const start = windowIndex + prefix.length;
    return { status: "resolved", start, end: start + exact.length };
  }

  // 3. Fuzzy exact match
  const exactIndex = sectionText.indexOf(exact);
  if (exactIndex !== -1) {
    return { status: "resolved", start: exactIndex, end: exactIndex + exact.length };
  }

  return { status: "orphaned" };
}

export function buildAnchor(
  sectionId: string,
  sectionText: string,
  start: number,
  end: number,
): Anchor {
  const exact = sectionText.slice(start, end);
  return {
    sectionId,
    exact,
    prefix: sectionText.slice(Math.max(0, start - 32), start),
    suffix: sectionText.slice(end, end + 32),
    startOffset: start,
  };
}

export function getSectionPlainText(element: HTMLElement): string {
  return element.textContent ?? "";
}

export function wrapTextRange(
  root: HTMLElement,
  start: number,
  end: number,
  wrap: (textNode: Text, localStart: number, localEnd: number) => void,
): boolean {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode() as Text | null;

  while (node) {
    const len = node.textContent?.length ?? 0;
    const nodeStart = offset;
    const nodeEnd = offset + len;

    if (nodeEnd > start && nodeStart < end) {
      const localStart = Math.max(0, start - nodeStart);
      const localEnd = Math.min(len, end - nodeStart);
      wrap(node, localStart, localEnd);
    }

    offset = nodeEnd;
    node = walker.nextNode() as Text | null;
  }

  return true;
}
