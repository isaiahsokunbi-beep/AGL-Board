import { promises as fs } from "fs";
import path from "path";
import { DOC_VERSION } from "@/content/board-paper";
import type { Annotation, CreateAnnotationInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "annotations.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<Annotation[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as Annotation[];
  } catch {
    return [];
  }
}

async function writeAll(annotations: Annotation[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(annotations, null, 2), "utf8");
}

export async function fileListAnnotations(): Promise<Annotation[]> {
  const all = await readAll();
  return all
    .filter((a) => a.docVersion === DOC_VERSION)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export async function fileCreateAnnotation(
  input: CreateAnnotationInput,
): Promise<Annotation> {
  const annotation: Annotation = {
    id: crypto.randomUUID(),
    docVersion: DOC_VERSION,
    sectionId: input.sectionId,
    anchor: input.anchor,
    body: input.body,
    authorName: input.authorName,
    parentId: input.parentId ?? null,
    resolvedAt: null,
    createdAt: new Date().toISOString(),
  };
  const all = await readAll();
  all.push(annotation);
  await writeAll(all);
  return annotation;
}

export async function fileUpdateAnnotation(
  id: string,
  patch: Partial<Pick<Annotation, "body" | "resolvedAt">>,
): Promise<Annotation> {
  const all = await readAll();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Annotation not found");
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export async function fileDeleteAnnotation(id: string): Promise<void> {
  const all = await readAll();
  await writeAll(all.filter((a) => a.id !== id && a.parentId !== id));
}
