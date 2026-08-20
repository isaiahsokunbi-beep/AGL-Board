import type { Metadata } from "next";
import "@/styles/globals.css";
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

export default async function HomePage() {
  const viewerName = await getViewerName();
  return <DocumentShell viewerName={viewerName} />;
}
