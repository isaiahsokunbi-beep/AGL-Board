import type { AccessEvent, CreateAccessEventInput } from "./types";
import { fileListAccess, fileRecordAccess } from "./file-store";

export async function recordAccess(
  input: CreateAccessEventInput,
): Promise<AccessEvent> {
  return fileRecordAccess(input);
}

export async function listAccess(limit = 500): Promise<AccessEvent[]> {
  return fileListAccess(limit);
}
