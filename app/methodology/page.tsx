import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, Eye, FileCheck2, Scale } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How the EHR Integration Directory evaluates public evidence and labels uncertainty.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" /> Back to directory</Link>
        <header className="mt-10 max-w-4xl">
          <p className="eyebrow"><Scale className="size-3.5" /> Research standard</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-6xl">Evidence before verdict.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">The unit of analysis is not “Does this EHR have an API?” It is the product, operation, integration path, access requirement, execution surface, verifier, and source.</p>
        </header>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: FileCheck2, title: "Primary sources first", body: "Vendor documentation, official developer portals, certification records, and published endpoint directories anchor each record." },
            { icon: Eye, title: "No negative inference", body: "If a write operation is absent from reviewed public docs, we say exactly that. We do not convert absence into unsupported." },
            { icon: Database, title: "Operation-specific", body: "A platform may expose one write and gate another. Product-wide yes/no labels are avoided when the evidence is narrower." },
          ].map((item) => {
            const Icon = item.icon;
            return <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="size-5 text-[#0b766e]" /><h2 className="mt-6 font-semibold text-slate-900">{item.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p></article>;
          })}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[#10233f]">Status vocabulary</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {[
              ["documented", "An official public source describes the relevant path. Exact operation and deployment still require validation."],
              ["partner-gated", "The route exists through a developer, marketplace, licensing, or authorized-vendor program."],
              ["site-specific", "Capability or access materially depends on product edition, customer approval, tenant configuration, or operation."],
              ["not-found", "The reviewed public sources did not establish the claimed path. This is not proof that it is unsupported."],
              ["unknown", "The public evidence is insufficient to make a narrower claim."],
            ].map(([status, detail]) => (
              <div key={status} className="grid gap-3 border-b border-slate-200 p-5 last:border-0 sm:grid-cols-[190px_1fr]">
                <div><StatusBadge status={status as "documented" | "partner-gated" | "site-specific" | "not-found" | "unknown"} /></div>
                <p className="text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-semibold text-[#10233f]">Coverage and corrections</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">The launch dataset favors vendors with useful public evidence. It is not a market-share ranking or a complete catalog. Each record carries a review date. To challenge a record, send an official source URL, the product and version, the exact operation, and the access context.</p>
          <a href="mailto:directory@openadapt.ai?subject=EHR%20directory%20correction" className="mt-4 inline-block text-sm font-semibold text-[#0b766e] hover:underline">Submit a correction</a>
        </section>
      </main>
    </div>
  );
}
