import { resolveAnchor, wrapTextRange } from "./anchor";
import type { Annotation } from "./types";

export function clearHighlights(root: ParentNode = document) {
  root.querySelectorAll("mark[data-highlight]").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
  });
}

function wrapSegment(
  textNode: Text,
  localStart: number,
  localEnd: number,
  annotationId: string,
) {
  const full = textNode.textContent ?? "";
  if (!full || localStart >= localEnd) return;

  let node = textNode;
  if (localEnd < full.length) {
    node.splitText(localEnd);
  }
  if (localStart > 0) {
    node = node.splitText(localStart);
  }

  const mark = document.createElement("mark");
  mark.dataset.highlight = annotationId;
  mark.dataset.annotationId = annotationId;
  mark.className = "annotation-highlight";
  mark.title = "View annotation";
  node.parentNode?.replaceChild(mark, node);
  mark.appendChild(node);
}

export function applyAnnotationHighlights(annotations: Annotation[]) {
  clearHighlights();

  for (const annotation of annotations) {
    if (annotation.resolvedAt) continue;
    const section = document.querySelector<HTMLElement>(
      `[data-section-id="${annotation.sectionId}"]`,
    );
    if (!section) continue;

    const resolved = resolveAnchor(section.textContent ?? "", annotation.anchor);
    if (resolved.status !== "resolved") continue;

    wrapTextRange(section, resolved.start, resolved.end, (textNode, localStart, localEnd) => {
      try {
        wrapSegment(textNode, localStart, localEnd, annotation.id);
      } catch {
        // Skip malformed ranges (e.g. across existing interactive nodes)
      }
    });
  }
}
