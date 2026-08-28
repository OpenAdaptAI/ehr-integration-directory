import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleHelp, ExternalLink, FileSearch, KeyRound, Route, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { ehrs, getEhr } from "@/lib/ehrs";

export function generateStaticParams() {
  return ehrs.map((ehr) => ({ slug: ehr.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ehr = getEhr(slug);
  if (!ehr) return {};
  return {
    title: `${ehr.name} API & Write-back Guide`,
    description: `Public evidence for ${ehr.name} APIs, access requirements, write-back paths, and integration gaps.`,
    alternates: { canonical: `/ehr/${ehr.slug}` },
  };
}

export default async function EhrProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ehr = getEhr(slug);
  if (!ehr) notFound();

  const fitLabel = {
    low: "API first",
    conditional: "Conditional UI fit",
    strong: "Strong UI-gap candidate",
  }[ehr.openAdaptFit];

  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="size-4" /> Back to directory
          </Link>

          <header className="mt-8 grid gap-7 border-b border-slate-200 pb-10 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow"><FileSearch className="size-3.5" /> Evidence profile</p>
                <StatusBadge status={ehr.status} />
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-6xl">{ehr.name}</h1>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.1em] text-slate-500">{ehr.vendor} · {ehr.market}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{ehr.summary}</p>
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">Directory verdict</p>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-800">{ehr.verdict}</p>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">Last reviewed</p>
                <p className="mt-1 text-sm text-slate-700">August 28, 2026</p>
              </div>
            </aside>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_330px]">
            <div className="space-y-10">
              <section aria-labelledby="checks-heading">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#0b766e]" />
                  <h2 id="checks-heading" className="text-xl font-semibold tracking-tight text-[#10233f]">Evidence checks</h2>
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {ehr.capabilities.map((capability) => (
                    <article key={capability.label} className="grid gap-3 border-b border-slate-200 p-5 last:border-0 sm:grid-cols-[190px_1fr]">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{capability.label}</p>
                        <div className="mt-2"><StatusBadge status={capability.status} /></div>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{capability.detail}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="next-heading" className="rounded-2xl border border-[#9dd5d0] bg-[#eff8f7] p-6">
                <div className="flex items-center gap-2 text-[#0b766e]"><Route className="size-5" /><h2 id="next-heading" className="text-lg font-semibold text-[#10233f]">Best next step</h2></div>
                <p className="mt-4 leading-7 text-slate-700">{ehr.nextStep}</p>
              </section>

              <section aria-labelledby="sources-heading">
                <div className="flex items-center gap-2"><CheckCircle2 className="size-5 text-[#0b766e]" /><h2 id="sources-heading" className="text-xl font-semibold tracking-tight text-[#10233f]">Reviewed sources</h2></div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Claims on this page are scoped to these public sources. Contracted capabilities and local configuration may differ.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {ehr.sources.map((source, index) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#76bbb5]">
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">Source {index + 1} · {source.kind}</span>
                      <span className="mt-2 flex items-start justify-between gap-3 text-sm font-semibold text-slate-800">{source.label}<ExternalLink className="mt-0.5 size-4 shrink-0 text-slate-400 group-hover:text-[#0b766e]" /></span>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2"><KeyRound className="size-4 text-[#0b766e]" /><h2 className="font-semibold text-slate-900">Access path</h2></div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{ehr.access}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ehr.surfaces.map((surface) => <span key={surface} className="rounded-md border border-slate-200 bg-[#fbfaf6] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-600">{surface}</span>)}
                </div>
              </section>

              <section className="rounded-2xl bg-[#10233f] p-6 text-white">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-cyan-200">OpenAdapt fit · {fitLabel}</p>
                <h2 className="mt-3 text-xl font-semibold">When the path ends at the UI</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{ehr.openAdaptReason}</p>
                <Button asChild className="mt-5 w-full bg-white text-[#10233f] hover:bg-slate-100">
                  <a href="https://openadapt.ai/qualify" target="_blank" rel="noreferrer">Qualify this workflow <ArrowUpRight /></a>
                </Button>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2"><CircleHelp className="size-4 text-slate-500" /><h2 className="font-semibold text-slate-900">Know something newer?</h2></div>
                <p className="mt-3 text-sm leading-6 text-slate-500">Send the official documentation URL and the exact operation it supports.</p>
                <a href="mailto:directory@openadapt.ai?subject=EHR%20directory%20evidence" className="mt-3 inline-block text-sm font-semibold text-[#0b766e] hover:underline">Submit evidence</a>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
