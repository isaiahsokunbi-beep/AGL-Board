import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  deleteAnnotation,
  isAnnotationsDbConfigured,
  updateAnnotation,
} from "@/lib/annotations/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAnnotationsDbConfigured()) {
    return NextResponse.json(
      { error: "Shared annotations are not configured." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      body?: string;
      resolvedAt?: string | null;
    };
    const annotation = await updateAnnotation(id, {
      body: body.body,
      resolvedAt: body.resolvedAt,
    });
    return NextResponse.json({ annotation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update annotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAnnotationsDbConfigured()) {
    return NextResponse.json(
      { error: "Shared annotations are not configured." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    await deleteAnnotation(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete annotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
