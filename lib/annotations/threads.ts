import type { Annotation } from "./types";

export type AnnotationThread = {
  annotation: Annotation;
  replies: AnnotationThread[];
};

/** Build nested threads from a flat annotation list (roots first). */
export function buildAnnotationThreads(items: Annotation[]): AnnotationThread[] {
  const byParent = new Map<string | null, Annotation[]>();
  for (const item of items) {
    const key = item.parentId;
    const list = byParent.get(key) ?? [];
    list.push(item);
    byParent.set(key, list);
  }

  for (const list of byParent.values()) {
    list.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  function walk(parentId: string | null): AnnotationThread[] {
    return (byParent.get(parentId) ?? []).map((annotation) => ({
      annotation,
      replies: walk(annotation.id),
    }));
  }

  return walk(null);
}

export function countThreadNodes(threads: AnnotationThread[]): number {
  return threads.reduce(
    (sum, t) => sum + 1 + countThreadNodes(t.replies),
    0,
  );
}

/** Collect an annotation id and all descendant reply ids. */
export function collectThreadIds(
  items: Annotation[],
  rootId: string,
): string[] {
  const ids = [rootId];
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const item of items) {
      if (item.parentId === id) {
        ids.push(item.id);
        queue.push(item.id);
      }
    }
  }
  return ids;
}

export function findRootId(items: Annotation[], id: string): string {
  const byId = new Map(items.map((a) => [a.id, a]));
  let cur = byId.get(id);
  while (cur?.parentId) {
    const parent = byId.get(cur.parentId);
    if (!parent) break;
    cur = parent;
  }
  return cur?.id ?? id;
}
