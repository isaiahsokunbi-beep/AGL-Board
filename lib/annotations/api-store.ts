import type { Annotation, AnnotationStore, CreateAnnotationInput } from "./types";

type Listener = (annotations: Annotation[]) => void;

/**
 * Client store that talks to session-gated /api/annotations.
 * All authenticated viewers share the same comments (backed by Supabase).
 */
export class ApiAnnotationStore implements AnnotationStore {
  private listeners = new Set<Listener>();
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private cache: Annotation[] = [];

  private emit(data: Annotation[]) {
    this.cache = data;
    this.listeners.forEach((l) => l(data));
  }

  private async refresh(): Promise<Annotation[]> {
    const res = await fetch("/api/annotations", { credentials: "same-origin" });
    if (res.status === 503) {
      this.emit([]);
      return [];
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Failed to load annotations");
    }
    const data = (await res.json()) as { annotations: Annotation[] };
    this.emit(data.annotations);
    return data.annotations;
  }

  private ensurePolling() {
    if (this.pollTimer || typeof window === "undefined") return;
    this.pollTimer = setInterval(() => {
      void this.refresh().catch(() => undefined);
    }, 8_000);
  }

  async list(): Promise<Annotation[]> {
    return this.refresh();
  }

  async create(input: CreateAnnotationInput): Promise<Annotation> {
    const res = await fetch("/api/annotations", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Failed to create annotation");
    }
    const data = (await res.json()) as { annotation: Annotation };
    await this.refresh();
    return data.annotation;
  }

  async update(
    id: string,
    patch: Partial<Pick<Annotation, "body" | "resolvedAt">>,
  ): Promise<Annotation> {
    const res = await fetch(`/api/annotations/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Failed to update annotation");
    }
    const data = (await res.json()) as { annotation: Annotation };
    await this.refresh();
    return data.annotation;
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/annotations/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "Failed to delete annotation");
    }
    await this.refresh();
  }

  subscribe(callback: Listener): () => void {
    this.listeners.add(callback);
    callback(this.cache);
    void this.refresh().catch(() => undefined);
    this.ensurePolling();

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    };
  }
}
