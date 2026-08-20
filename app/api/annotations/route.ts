import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  createAnnotation,
  isAnnotationsDbConfigured,
  listAnnotations,
} from "@/lib/annotations/db";
import { isEphemeralAnnotationsBackend } from "@/lib/annotations/file-store";
import type { CreateAnnotationInput } from "@/lib/annotations/types";

function backendLabel() {
  if (isAnnotationsDbConfigured()) return "supabase";
  if (isEphemeralAnnotationsBackend()) return "ephemeral";
  return "file";
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const annotations = await listAnnotations();
    return NextResponse.json({
      annotations,
      backend: backendLabel(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list annotations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateAnnotationInput;
    if (!body?.sectionId || !body?.anchor || !body?.body?.trim() || !body?.authorName?.trim()) {
      return NextResponse.json({ error: "Invalid annotation payload" }, { status: 400 });
    }
    const annotation = await createAnnotation({
      sectionId: body.sectionId,
      anchor: body.anchor,
      body: body.body.trim(),
      authorName: body.authorName.trim(),
      parentId: body.parentId ?? null,
    });
    return NextResponse.json(
      {
        annotation,
        backend: backendLabel(),
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create annotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
