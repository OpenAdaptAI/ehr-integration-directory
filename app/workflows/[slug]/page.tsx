import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, GitBranch, ListChecks, SearchCheck, ShieldAlert, Target, TriangleAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { NO_WRITE_API_PATH, remainingScreenNote } from "@/lib/links";
import { fhirResourceUrl, getWorkflow, workflows } from "@/lib/ehrs";

export function generateStaticParams() {
  return workflows.map((workflow) => ({ slug: workflow.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  return workflow ? {
    title: `${workflow.name} Integration Guide`,
    description: `How to evaluate API, authorization, verification, and UI paths for ${workflow.name.toLowerCase()} in an EHR.`,
    alternates: { canonical: `/workflows/${workflow.slug}` },
  } : {};
}

const gates = [
  { title: "Define the state change", detail: "Name the exact record, fields, preconditions, and terminal state. Avoid labels such as “integration” that hide the operation.", icon: SearchCheck },
  { title: "Test the supported interface", detail: "Check the vendor method, required scopes, customer enablement, rate limits, and the environment where the operation will run.", icon: GitBranch },
  { title: "Design verification", detail: "Read the resulting system-of-record state independently. A click, request, or success toast is not sufficient evidence.", icon: CheckCircle2 },
  { title: "Qualify a controlled UI path", detail: "Only if the supported interface is impractical: constrain inputs, approvals, exception handling, and stop conditions before execution.", icon: ShieldAlert },
];

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workflow = getWorkflow(slug);
  if (!workflow) notFound();

  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/#directory-heading" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" /> Back to directory</Link>
        <header className="mt-10 max-w-4xl">
          <p className="eyebrow">Workflow qualification guide</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-6xl">{workflow.name}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">{workflow.description} This guide frames the questions that determine whether the safest practical path is a vendor interface, an approved integration partner, or a controlled UI workflow.</p>
        </header>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section aria-labelledby="state-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-2"><Target className="size-5 text-[#0b766e]" /><h2 id="state-heading" className="text-lg font-semibold text-slate-900">What should change in the record</h2></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{workflow.stateChange}</p>
            </section>
            <section aria-labelledby="verify-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-2"><ListChecks className="size-5 text-[#0b766e]" /><h2 id="verify-heading" className="text-lg font-semibold text-slate-900">How to check that it saved</h2></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{workflow.verify}</p>
            </section>
            <section aria-labelledby="failures-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-2"><TriangleAlert className="size-5 text-slate-500" /><h2 id="failures-heading" className="text-lg font-semibold text-slate-900">What often goes wrong</h2></div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                {workflow.failureModes.map((failure) => <li key={failure}>{failure}</li>)}
              </ul>
            </section>
          </div>
          <section aria-labelledby="fhir-heading" className="self-start rounded-2xl border border-slate-200 bg-white p-6">
            <h2 id="fhir-heading" className="font-semibold text-slate-900">Where it lives in FHIR R4</h2>
            <ul className="mt-4 space-y-4">
              {workflow.resources.map((resource) => (
                <li key={resource.name}>
                  <a href={fhirResourceUrl(resource.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0b766e] hover:underline">{resource.name}<ExternalLink className="size-3.5" /></a>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{resource.role}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">Names and links follow the HL7 FHIR R4 specification. EHRs expose different subsets, and many expose a resource for reading only. Check the EHR&apos;s profile in <Link href="/#directory-heading" className="font-medium text-[#0b766e] hover:underline">the directory</Link> before you plan a write.</p>
          </section>
        </div>

        <section className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2" aria-label="Qualification gates">
          {gates.map((gate, index) => {
            const Icon = gate.icon;
            return (
              <article key={gate.title} className="bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between"><Icon className="size-5 text-[#0b766e]" /><span className="font-mono text-[10px] text-slate-400">GATE 0{index + 1}</span></div>
                <h2 className="mt-8 text-lg font-semibold text-slate-900">{gate.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{gate.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-10 rounded-2xl bg-[#10233f] p-7 text-white sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-cyan-200">Decision rule</p>
          <h2 className="mt-3 text-2xl font-semibold">Prefer a practical API. Prove the last mile.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{remainingScreenNote("the vendor")}</p>
          <Link href={NO_WRITE_API_PATH} className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#10233f] hover:bg-slate-100">No write API? See your options <ArrowRight className="size-4" /></Link>
        </section>
      </main>
    </div>
  );
}
