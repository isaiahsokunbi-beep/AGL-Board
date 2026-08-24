import { promises as fs } from "fs";
import path from "path";
import { getAnnotationsDataDir } from "@/lib/annotations/file-store";
import type { AccessEvent, CreateAccessEventInput } from "./types";

function dataFile(): string {
  return path.join(getAnnotationsDataDir(), "access-log.json");
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

async function readAll(): Promise<AccessEvent[]> {
  await ensureFile();
  const raw = await fs.readFile(dataFile(), "utf8");
  try {
    return JSON.parse(raw) as AccessEvent[];
  } catch {
    return [];
  }
}

async function writeAll(events: AccessEvent[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(dataFile(), JSON.stringify(events, null, 2), "utf8");
}

export async function fileRecordAccess(
  input: CreateAccessEventInput,
): Promise<AccessEvent> {
  const event: AccessEvent = {
    id: crypto.randomUUID(),
    viewerName: input.viewerName.trim(),
    accessedAt: new Date().toISOString(),
    ip: input.ip ?? null,
    userAgent: input.userAgent ?? null,
    path: input.path ?? "/",
  };
  const all = await readAll();
  all.push(event);
  await writeAll(all);
  return event;
}

export async function fileListAccess(limit = 500): Promise<AccessEvent[]> {
  const all = await readAll();
  return all
    .slice()
    .sort(
      (a, b) =>
        new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime(),
    )
    .slice(0, limit);
}
