"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DOC_VERSION } from "@/content/board-paper";
import { buildAnchor, resolveAnchor } from "@/lib/annotations/anchor";
import {
  applyAnnotationHighlights,
  clearHighlights,
} from "@/lib/annotations/highlights";
import { createAnnotationStore } from "@/lib/annotations/store";
import type { Annotation } from "@/lib/annotations/types";

const AUTHOR_KEY = "agl-board-author";

type SelectionTarget = {
  x: number;
  y: number;
  sectionId: string;
  start: number;
  end: number;
  text: string;
};

function CloseButton({
  onClick,
  label,
  className = "",
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-metric hover:text-text-primary ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function clampComposerPosition(x: number, y: number) {
  if (typeof window === "undefined") return { left: x, top: y };
  const width = 288;
  const left = Math.min(Math.max(12, x - width / 2), window.innerWidth - width - 12);
  const top = Math.min(Math.max(12, y - 8), window.innerHeight - 280);
  return { left, top };
}

export function AnnotationLayer() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolbar, setToolbar] = useState<SelectionTarget | null>(null);
  const [composer, setComposer] = useState<SelectionTarget | null>(null);
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [liveMsg, setLiveMsg] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const storeRef = useRef(createAnnotationStore());
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setAuthor(localStorage.getItem(AUTHOR_KEY) ?? "");
    return storeRef.current.subscribe(setAnnotations);
  }, []);

  const findSection = useCallback((node: Node | null): { el: HTMLElement; id: string } | null => {
    let cur: Node | null = node;
    while (cur) {
      if (cur instanceof HTMLElement && cur.dataset.sectionId) {
        return { el: cur, id: cur.dataset.sectionId };
      }
      cur = cur.parentNode;
    }
    return null;
  }, []);

  useLayoutEffect(() => {
    const toPaint = annotations.filter(
      (a) => !a.resolvedAt && a.docVersion === DOC_VERSION,
    );
    applyAnnotationHighlights(toPaint);
    return () => clearHighlights();
  }, [annotations]);

  useEffect(() => {
    function onSelectionChange() {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        if (composer) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
          setToolbar(null);
          return;
        }
        const range = sel.getRangeAt(0);
        if (range.commonAncestorContainer instanceof Element) {
          if (range.commonAncestorContainer.closest("[data-comment-layer], [data-comment-sidebar]")) {
            return;
          }
        }
        const section = findSection(range.commonAncestorContainer);
        if (!section || !section.el.closest("[data-annotatable]")) {
          setToolbar(null);
          return;
        }
        // Measure offsets against plain text without marks for stable anchors
        const plain = section.el.textContent ?? "";
        const pre = range.cloneRange();
        pre.selectNodeContents(section.el);
        pre.setEnd(range.startContainer, range.startOffset);
        const start = pre.toString().length;
        const end = start + range.toString().length;
        if (!range.toString().trim() || end > plain.length) {
          setToolbar(null);
          return;
        }
        const rect = range.getBoundingClientRect();
        setToolbar({
          x: rect.left + rect.width / 2,
          y: rect.top,
          sectionId: section.id,
          start,
          end,
          text: range.toString(),
        });
      }, 200);
    }
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [findSection, composer]);

  const active = annotations
    .filter((a) => !a.resolvedAt && a.docVersion === DOC_VERSION)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const mark = target.closest("mark[data-annotation-id]");
      if (!mark) return;
      const id = mark.getAttribute("data-annotation-id");
      if (!id) return;
      setFocusId(id);
      setSidebarOpen(true);
      setLiveMsg("Opened annotation for highlighted text");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function openComposer(target: SelectionTarget) {
    setComposer(target);
    setToolbar(null);
  }

  async function postComment() {
    if (!composer || !body.trim() || !author.trim()) return;
    localStorage.setItem(AUTHOR_KEY, author);
    const sectionEl = document.querySelector(`[data-section-id="${composer.sectionId}"]`);
    const sectionText = sectionEl?.textContent ?? "";
    const anchor = buildAnchor(composer.sectionId, sectionText, composer.start, composer.end);
    try {
      const created = await storeRef.current.create({
        sectionId: composer.sectionId,
        anchor,
        body: body.trim(),
        authorName: author.trim(),
      });
      setBody("");
      setComposer(null);
      setToolbar(null);
      window.getSelection()?.removeAllRanges();
      setFocusId(created.id);
      setSidebarOpen(true);
      setLiveMsg(`Comment posted by ${author.trim()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post comment";
      setLiveMsg(message);
      window.alert(message);
    }
  }

  const ordered = [...annotations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const resolved = ordered.filter((a) => a.resolvedAt);
  const orphaned = ordered.filter((a) => {
    if (a.docVersion !== DOC_VERSION) return true;
    const el = document.querySelector(`[data-section-id="${a.sectionId}"]`);
    if (!el) return true;
    return resolveAnchor(el.textContent ?? "", a.anchor).status === "orphaned";
  });

  const composerPos = composer
    ? clampComposerPosition(composer.x, composer.y + 28)
    : null;

  return (
    <div data-comment-layer>
      <div aria-live="polite" className="sr-only">{liveMsg}</div>

      {toolbar && !composer && (
        <SelectionToolbar
          rect={{ x: toolbar.x, y: toolbar.y }}
          onHighlight={() => openComposer(toolbar)}
          onComment={() => openComposer(toolbar)}
          onDismiss={() => setToolbar(null)}
        />
      )}

      {composer && composerPos && (
        <div
          className="fixed z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-md border border-comment-border bg-comment-surface p-3 shadow-card"
          style={{ left: composerPos.left, top: composerPos.top }}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-comment-marker">
                Annotate highlight
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] italic text-text-secondary">
                “{composer.text.trim()}”
              </p>
            </div>
            <CloseButton
              onClick={() => {
                setComposer(null);
                window.getSelection()?.removeAllRanges();
              }}
              label="Close comment"
            />
          </div>
          <label className="sr-only" htmlFor="annotation-body">
            Comment
          </label>
          <textarea
            id="annotation-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add your annotation…"
            className="mt-1 w-full rounded border border-border-default p-2 text-body"
            rows={3}
            autoFocus
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded border border-border-default p-2 text-body"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded bg-text-primary px-3 py-1 text-[12px] text-grays-white"
              onClick={postComment}
            >
              Post
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1 text-[12px]"
              onClick={() => {
                setComposer(null);
                window.getSelection()?.removeAllRanges();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="no-print fixed right-4 top-4 z-40 rounded-md border border-comment-border bg-grays-white px-3 py-2 text-[12px] shadow-card"
        onClick={() => setSidebarOpen((v) => !v)}
      >
        Comments ({active.length})
      </button>

      {sidebarOpen && (
        <aside
          data-comment-sidebar
          className="no-print fixed inset-y-0 right-0 z-40 w-80 overflow-y-auto border-l border-comment-border bg-grays-white p-4 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-heading-subsection font-bold uppercase">Comments</h2>
            <CloseButton onClick={() => setSidebarOpen(false)} label="Close comments" />
          </div>
          <CommentGroup
            title="Active"
            items={active}
            store={storeRef.current}
            focusId={focusId}
          />
          {resolved.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] text-text-secondary">
                Resolved ({resolved.length})
              </summary>
              <CommentGroup title="" items={resolved} store={storeRef.current} dimmed />
            </details>
          )}
          {orphaned.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[12px] font-semibold uppercase text-variance-unfavourable">
                Unanchored
              </h3>
              <CommentGroup title="" items={orphaned} store={storeRef.current} />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

function SelectionToolbar({
  rect,
  onHighlight,
  onComment,
  onDismiss,
}: {
  rect: { x: number; y: number };
  onHighlight: () => void;
  onComment: () => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  const top = rect.y < 48 ? rect.y + 24 : rect.y - 44;
  const left =
    typeof window === "undefined"
      ? rect.x
      : Math.min(Math.max(80, rect.x), window.innerWidth - 80);

  return (
    <div
      role="toolbar"
      aria-label="Selection actions"
      className="fixed z-50 flex -translate-x-1/2 gap-1 rounded-md bg-selection-toolbar-bg px-1 py-1 shadow-card"
      style={{ left, top }}
    >
      <button
        type="button"
        className="rounded px-2 py-1 text-[12px] text-selection-toolbar-text hover:bg-white/10"
        onClick={onHighlight}
      >
        Highlight
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-[12px] text-selection-toolbar-text hover:bg-white/10"
        onClick={onComment}
      >
        Annotate
      </button>
    </div>
  );
}

function CommentGroup({
  title,
  items,
  store,
  dimmed,
  focusId,
}: {
  title: string;
  items: Annotation[];
  store: ReturnType<typeof createAnnotationStore>;
  dimmed?: boolean;
  focusId?: string | null;
}) {
  return (
    <div className="mt-2 space-y-3">
      {title && <h3 className="text-[11px] uppercase text-text-secondary">{title}</h3>}
      {items.length === 0 && title && (
        <p className="text-[12px] text-text-secondary">No comments yet. Highlight text to annotate.</p>
      )}
      {items.map((a) => (
        <article
          key={a.id}
          id={`annotation-${a.id}`}
          className={`rounded border p-2 text-[12px] ${
            focusId === a.id
              ? "border-comment-marker bg-highlight-fill ring-1 ring-comment-marker/40"
              : "border-comment-border"
          } ${dimmed ? "opacity-60" : ""}`}
        >
          <blockquote className="border-l-2 border-comment-marker pl-2 italic text-text-secondary">
            {a.anchor.exact}
          </blockquote>
          <p className="mt-2">{a.body}</p>
          <p className="mt-1 text-[10px] text-text-secondary">
            {a.authorName} · {new Date(a.createdAt).toLocaleString()}
          </p>
          <div className="mt-2 flex gap-2">
            {!a.resolvedAt && (
              <button
                type="button"
                className="text-comment-marker"
                onClick={() => store.update(a.id, { resolvedAt: new Date().toISOString() })}
              >
                Resolve
              </button>
            )}
            <button
              type="button"
              className="text-variance-unfavourable"
              onClick={() => store.delete(a.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
