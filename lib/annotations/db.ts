import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DOC_VERSION } from "@/content/board-paper";
import {
  fileCreateAnnotation,
  fileDeleteAnnotation,
  fileListAnnotations,
  fileUpdateAnnotation,
} from "./file-store";
import type { Annotation, CreateAnnotationInput } from "./types";

export type AnnotationRow = {
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

export function rowToAnnotation(row: AnnotationRow): Annotation {
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

let client: SupabaseClient | null = null;

/** Server-only Supabase client. Prefer service role so RLS can deny public access. */
export function getAnnotationsDb(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON key).",
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function isAnnotationsDbConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export async function listAnnotations(): Promise<Annotation[]> {
  if (!isAnnotationsDbConfigured()) return fileListAnnotations();

  const db = getAnnotationsDb();
  const { data, error } = await db
    .from("annotations")
    .select("*")
    .eq("doc_version", DOC_VERSION)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as AnnotationRow[]).map(rowToAnnotation);
}

export async function createAnnotation(
  input: CreateAnnotationInput,
): Promise<Annotation> {
  if (!isAnnotationsDbConfigured()) return fileCreateAnnotation(input);

  const db = getAnnotationsDb();
  const { data, error } = await db
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
  return rowToAnnotation(data as AnnotationRow);
}

export async function updateAnnotation(
  id: string,
  patch: Partial<Pick<Annotation, "body" | "resolvedAt">>,
): Promise<Annotation> {
  if (!isAnnotationsDbConfigured()) return fileUpdateAnnotation(id, patch);

  const db = getAnnotationsDb();
  const payload: Record<string, unknown> = {};
  if (patch.body !== undefined) payload.body = patch.body;
  if (patch.resolvedAt !== undefined) payload.resolved_at = patch.resolvedAt;

  const { data, error } = await db
    .from("annotations")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToAnnotation(data as AnnotationRow);
}

export async function deleteAnnotation(id: string): Promise<void> {
  if (!isAnnotationsDbConfigured()) return fileDeleteAnnotation(id);

  // FK on parent_id is ON DELETE CASCADE — removes nested replies.
  const db = getAnnotationsDb();
  const { error } = await db.from("annotations").delete().eq("id", id);
  if (error) throw error;
}
