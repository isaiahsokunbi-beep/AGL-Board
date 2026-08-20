import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  createAnnotation,
  isAnnotationsDbConfigured,
  listAnnotations,
} from "@/lib/annotations/db";
import type { CreateAnnotationInput } from "@/lib/annotations/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const annotations = await listAnnotations();
    return NextResponse.json({
      annotations,
      backend: isAnnotationsDbConfigured() ? "supabase" : "file",
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
        backend: isAnnotationsDbConfigured() ? "supabase" : "file",
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create annotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
