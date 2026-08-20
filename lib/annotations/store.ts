import { DOC_VERSION } from "@/content/board-paper";
import type { Annotation, AnnotationStore, CreateAnnotationInput } from "./types";

const STORAGE_KEY = "agl-board-annotations";

function load(): Annotation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Annotation[]) : [];
  } catch {
    return [];
  }
}

function save(annotations: Annotation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
}

function id() {
  return crypto.randomUUID();
}

type Listener = (annotations: Annotation[]) => void;

export class LocalAnnotationStore implements AnnotationStore {
  private listeners = new Set<Listener>();

  private emit() {
    const data = load();
    this.listeners.forEach((l) => l(data));
  }

  async list(): Promise<Annotation[]> {
    return load();
  }

  async create(input: CreateAnnotationInput): Promise<Annotation> {
    const annotation: Annotation = {
      id: id(),
      docVersion: DOC_VERSION,
      sectionId: input.sectionId,
      anchor: input.anchor,
      body: input.body,
      authorName: input.authorName,
      parentId: input.parentId ?? null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
    };
    const all = load();
    all.push(annotation);
    save(all);
    this.emit();
    return annotation;
  }

  async update(
    id: string,
    patch: Partial<Pick<Annotation, "body" | "resolvedAt">>,
  ): Promise<Annotation> {
    const all = load();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Annotation not found");
    all[idx] = { ...all[idx], ...patch };
    save(all);
    this.emit();
    return all[idx];
  }

  async delete(id: string): Promise<void> {
    save(load().filter((a) => a.id !== id && a.parentId !== id));
    this.emit();
  }

  subscribe(callback: Listener): () => void {
    this.listeners.add(callback);
    callback(load());
    return () => this.listeners.delete(callback);
  }
}

export function createAnnotationStore(): AnnotationStore {
  const mode = process.env.NEXT_PUBLIC_ANNOTATION_STORE ?? "local";
  if (mode === "supabase") {
    // Lazy import to keep bundle small when using local
    const { SupabaseAnnotationStore } = require("./supabase-store") as {
      SupabaseAnnotationStore: new () => AnnotationStore;
    };
    return new SupabaseAnnotationStore();
  }
  return new LocalAnnotationStore();
}
