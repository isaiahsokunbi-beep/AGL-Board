import { createClient } from "@supabase/supabase-js";
import { DOC_VERSION } from "@/content/board-paper";
import type { Annotation, AnnotationStore, CreateAnnotationInput } from "./types";

type Row = {
  id: string;
  doc_version: string;
  section_id: string;
  anchor: Annotation["anchor"];
  body: string;
  author_name: string;
  parent_id: string | null;
  resolved_at: string | null;
  created_at: string;
};

function rowToAnnotation(row: Row): Annotation {
  return {
    id: row.id,
    docVersion: row.doc_version,
    sectionId: row.section_id,
    anchor: row.anchor,
    body: row.body,
    authorName: row.author_name,
    parentId: row.parent_id,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
  };
}

export class SupabaseAnnotationStore implements AnnotationStore {
  private client;
  private listeners = new Set<(a: Annotation[]) => void>();
  private channel: ReturnType<typeof this.client.channel> | null = null;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars missing");
    this.client = createClient(url, key);
  }

  async list(): Promise<Annotation[]> {
    const { data, error } = await this.client
      .from("annotations")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as Row[]).map(rowToAnnotation);
  }

  async create(input: CreateAnnotationInput): Promise<Annotation> {
    const { data, error } = await this.client
      .from("annotations")
      .insert({
        doc_version: DOC_VERSION,
        section_id: input.sectionId,
        anchor: input.anchor,
        body: input.body,
        author_name: input.authorName,
        parent_id: input.parentId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToAnnotation(data as Row);
  }

  async update(
    id: string,
    patch: Partial<Pick<Annotation, "body" | "resolvedAt">>,
  ): Promise<Annotation> {
    const { data, error } = await this.client
      .from("annotations")
      .update({
        body: patch.body,
        resolved_at: patch.resolvedAt,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return rowToAnnotation(data as Row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("annotations").delete().eq("id", id);
    if (error) throw error;
  }

  subscribe(callback: (annotations: Annotation[]) => void): () => void {
    this.listeners.add(callback);
    void this.list().then(callback);

    this.channel = this.client
      .channel("annotations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "annotations" },
        () => void this.list().then((a) => this.listeners.forEach((l) => l(a))),
      )
      .subscribe();

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.channel) {
        void this.client.removeChannel(this.channel);
        this.channel = null;
      }
    };
  }
}
