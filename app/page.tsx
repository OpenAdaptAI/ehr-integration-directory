import Link from "next/link";
import { ArrowRight, BookOpen, Database, FileCheck2, ShieldCheck } from "lucide-react";
import { DirectoryExplorer } from "@/components/directory-explorer";
import { SiteHeader } from "@/components/site-header";
import { workflows } from "@/lib/ehrs";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "EHR Integration Directory",
    description: "A source-linked directory of public EHR integration and write-back evidence.",
    creator: { "@type": "Organization", name: "OpenAdapt", url: "https://openadapt.ai" },
    url: "https://ehrintegrationdirectory.com",
    dateModified: "2026-08-28",
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://ehrintegrationdirectory.com/api/directory",
    },
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.45fr_0.55fr] lg:py-16">
            <div>
              <p className="eyebrow"><ShieldCheck className="size-3.5" /> Source-linked, operation-specific evidence</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#10233f] sm:text-6xl">
                Find the supported path into every major EHR.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Compare public APIs, FHIR and HL7 capabilities, partner requirements, sandbox access, documented write operations, and workflows that still end at the UI.
              </p>
            </div>
            <aside className="self-end rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">The rule</p>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-800">Use an API when practical. When the last mile exists only in the UI, qualify it before automating it.</p>
              <a href="https://openadapt.ai/qualify" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0b766e] hover:underline">
                Qualify a workflow <ArrowRight className="size-4" />
              </a>
            </aside>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
          <DirectoryExplorer />

          <section className="mt-16" aria-labelledby="workflow-heading">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow"><FileCheck2 className="size-3.5" /> Workflow index</p>
                <h2 id="workflow-heading" className="mt-3 text-3xl font-semibold tracking-tight text-[#10233f]">Start with the operation, not the vendor.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-500">Each guide separates the system-of-record write, authorization path, verification step, and UI fallback.</p>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow, index) => (
                <Link key={workflow.slug} href={`/workflows/${workflow.slug}`} className="group bg-white p-6 transition-colors hover:bg-[#f2f8f7]">
                  <span className="font-mono text-[10px] text-slate-400">0{index + 1}</span>
                  <h3 className="mt-8 flex items-center justify-between font-semibold text-slate-900">
                    {workflow.name}<ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#0b766e]" />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{workflow.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-5 rounded-2xl bg-[#10233f] p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-200">A public research artifact</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Inspect the method. Reuse the data. Challenge a record.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Every profile links to its evidence and carries a review date. Absence of evidence is never labeled proof of non-support.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/methodology" className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 px-4 text-sm font-medium hover:bg-white/10"><BookOpen className="size-4" /> Methodology</Link>
              <Link href="/data" className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-[#10233f] hover:bg-slate-100"><Database className="size-4" /> Dataset</Link>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:px-8">
          <p>Published by <a href="https://openadapt.ai" className="font-medium text-slate-700 hover:underline">OpenAdapt</a>. Vendor names belong to their respective owners.</p>
          <p>Evidence reviewed August 28, 2026.</p>
        </div>
      </footer>
    </div>
  );
}
