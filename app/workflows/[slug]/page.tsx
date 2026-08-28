import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, GitBranch, SearchCheck, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getWorkflow, workflows } from "@/lib/ehrs";

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

        <section className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2" aria-label="Qualification gates">
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
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">If no practical supported interface can complete this operation, OpenAdapt can turn a demonstrated UI task into an approved program, verify the resulting state, and halt on ambiguity.</p>
          <a href="https://openadapt.ai/qualify" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#10233f] hover:bg-slate-100">Qualify this workflow <ArrowRight className="size-4" /></a>
        </section>
      </main>
    </div>
  );
}
