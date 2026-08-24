import type { Metadata } from "next";
import { getViewerName } from "@/lib/auth/session";
import { DocumentShell } from "@/components/DocumentShell";

export const metadata: Metadata = {
  title: "H1 2026 Performance Review — Agriarche",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  referrer: "no-referrer",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ pdf?: string }>;
}) {
  const viewerName = await getViewerName();
  const { pdf } = await searchParams;
  return <DocumentShell viewerName={viewerName} pdfMode={pdf === "1"} />;
}
