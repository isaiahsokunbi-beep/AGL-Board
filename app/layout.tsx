import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agriarche Board Paper",
  robots: "noindex, nofollow",
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate" />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
