import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ehrintegrationdirectory.com"),
  title: {
    default: "EHR Integration Directory",
    template: "%s | EHR Integration Directory",
  },
  description:
    "Compare documented EHR APIs, FHIR and HL7 paths, access requirements, write-back evidence, and integration gaps.",
  alternates: { canonical: "/" },
  keywords: ["EHR API", "EHR integration", "FHIR write", "EHR writeback", "healthcare interoperability"],
  openGraph: {
    title: "EHR Integration Directory",
    description: "Evidence-backed paths into major EHRs, with sources and honest uncertainty.",
    type: "website",
    url: "https://ehrintegrationdirectory.com",
    siteName: "EHR Integration Directory",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
