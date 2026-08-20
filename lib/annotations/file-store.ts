import { promises as fs } from "fs";
import path from "path";
import { DOC_VERSION } from "@/content/board-paper";
import type { Annotation, CreateAnnotationInput } from "./types";

function isServerlessRuntime() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.ANNOTATIONS_USE_TMP === "1",
  );
}

/** Writable dir: project `data/` locally, `/tmp` on Vercel/Lambda. */
export function getAnnotationsDataDir(): string {
  if (process.env.ANNOTATIONS_DATA_DIR) return process.env.ANNOTATIONS_DATA_DIR;
  if (isServerlessRuntime()) return path.join("/tmp", "agl-board-annotations");
  return path.join(process.cwd(), "data");
}

export function isEphemeralAnnotationsBackend(): boolean {
  return !process.env.ANNOTATIONS_DATA_DIR && isServerlessRuntime();
}

function dataFile(): string {
  return path.join(getAnnotationsDataDir(), "annotations.json");
}

async function ensureFile(): Promise<void> {
  const dir = getAnnotationsDataDir();
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(dataFile());
  } catch {
    await fs.writeFile(dataFile(), "[]", "utf8");
  }
}

async function readAll(): Promise<Annotation[]> {
  await ensureFile();
  const raw = await fs.readFile(dataFile(), "utf8");
  try {
    return JSON.parse(raw) as Annotation[];
  } catch {
    return [];
  }
}

async function writeAll(annotations: Annotation[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(dataFile(), JSON.stringify(annotations, null, 2), "utf8");
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
