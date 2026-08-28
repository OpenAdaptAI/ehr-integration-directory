import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { ehrs } from "@/lib/ehrs";

export const metadata: Metadata = {
  title: "Dataset",
  description: "Download or inspect the source-linked EHR integration evidence dataset.",
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  const sourceCount = ehrs.reduce((total, ehr) => total + ehr.sources.length, 0);
  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" /> Back to directory</Link>
        <header className="mt-10 grid gap-8 lg:grid-cols-[1fr_250px] lg:items-end">
          <div>
            <p className="eyebrow">Open data</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-6xl">Reuse the evidence.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">The dataset exposes profile summaries, status labels, access paths, capability checks, sources, and review dates.</p>
          </div>
          <Button asChild className="bg-[#10233f] hover:bg-[#17345c]"><a href="/api/directory" download="ehr-integration-directory.json"><Download /> Download JSON</a></Button>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[{ label: "Profiles", value: ehrs.length }, { label: "Public sources", value: sourceCount }, { label: "Review date", value: "2026-08-28" }].map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6"><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{stat.label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-[#10233f]">{stat.value}</p></article>)}
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Included profiles</h2></div>
          {ehrs.map((ehr) => <Link key={ehr.slug} href={`/ehr/${ehr.slug}`} className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 text-sm last:border-0 hover:bg-[#f2f8f7]"><span><strong className="text-slate-900">{ehr.name}</strong><span className="ml-2 text-slate-500">{ehr.market}</span></span><ExternalLink className="size-4 text-slate-400" /></Link>)}
        </section>

        <p className="mt-8 text-xs leading-6 text-slate-500">Licensed for reuse with attribution under CC BY 4.0. Vendor documentation remains subject to its original terms. The dataset is research, not legal, clinical, procurement, or security advice.</p>
      </main>
    </div>
  );
}
