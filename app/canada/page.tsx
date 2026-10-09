import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Capability, EhrRecord, EvidenceStatus, canadianEhrs, formatReviewDate, statusLabels } from "@/lib/ehrs";
import { NO_WRITE_API_PATH } from "@/lib/links";

export const metadata: Metadata = {
  title: "Canadian EMRs: how outside software writes in",
  description:
    "How outside software gets write access to Accuro, PS Suite, Med Access, CHR, OSCAR Pro, Juno, and the Ocean referral network, with a source for every claim.",
  alternates: { canonical: "/canada" },
};

const plainStatus: Record<EvidenceStatus, string> = {
  documented: "The vendor's public docs describe it.",
  "partner-gated": "You need the vendor's approval or a partner agreement.",
  "site-specific": "It depends on the clinic's setup, edition, or contract.",
  "not-found": "We couldn't find it in public docs. That doesn't mean it's missing.",
  unknown: "There isn't enough public evidence to say.",
};

// The capability row that answers "can outside software write?" for each profile.
const WRITE_LABELS = ["Documented write operations", "Writing data back", "Updates sent back to Ocean"];

function findCapability(ehr: EhrRecord, labels: string[]): Capability | undefined {
  return ehr.capabilities.find((capability) => labels.includes(capability.label));
}

// Ocean's write row covers updates sent back to the network, not the chart, so it
// keeps its own label, and the card adds the row about filing in the receiving chart.
const NETWORK_WRITE_LABEL = "Updates sent back to Ocean";
const FILING_LABEL = "Filing in the receiving chart";

function ProfileCard({ ehr }: { ehr: EhrRecord }) {
  const write = findCapability(ehr, WRITE_LABELS);
  const filing = findCapability(ehr, [FILING_LABEL]);
  const referral = findCapability(ehr, ["Referral network"]);
  const writeHeading = write?.label === NETWORK_WRITE_LABEL ? NETWORK_WRITE_LABEL : "Writing data";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{ehr.name}</h3>
        <StatusBadge status={ehr.status} />
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">{ehr.vendor}</p>

      <dl className="mt-5 grid gap-4 text-sm">
        {write && (
          <div>
            <dt className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">{writeHeading} <StatusBadge status={write.status} /></dt>
            <dd className="mt-1.5 leading-6 text-slate-600">{write.detail}</dd>
          </div>
        )}
        {filing && (
          <div>
            <dt className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">{FILING_LABEL} <StatusBadge status={filing.status} /></dt>
            <dd className="mt-1.5 leading-6 text-slate-600">{filing.detail}</dd>
          </div>
        )}
        <div>
          <dt className="font-semibold text-slate-900">How to get access</dt>
          <dd className="mt-1.5 leading-6 text-slate-600">{ehr.access}</dd>
        </div>
        {referral && (
          <div>
            <dt className="font-semibold text-slate-900">Referral network</dt>
            <dd className="mt-1.5 leading-6 text-slate-600">{referral.detail}</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>{ehr.sources.length} sources · reviewed {formatReviewDate(ehr.lastReviewed)}</span>
        <Link href={`/ehr/${ehr.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#0b766e] hover:underline">
          Profile <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export default function CanadaPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="eyebrow"><MapPin className="size-3.5" /> Canada</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-5xl">Canadian EMRs: how outside software writes in</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We reviewed what each vendor publishes about letting outside software write into its system. In every case, access needs approval from the vendor, the clinic, or both. Each profile below shows what the route takes, with a source for every claim.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="legend-heading">
          <h2 id="legend-heading" className="text-sm font-semibold text-slate-900">What the labels mean</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(statusLabels) as EvidenceStatus[]).map((status) => (
              <div key={status} className="flex items-start gap-2">
                <dt className="shrink-0"><StatusBadge status={status} /></dt>
                <dd className="leading-6 text-slate-600">{plainStatus[status]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2" aria-label="Canadian profiles">
          {canadianEhrs.map((ehr) => <ProfileCard key={ehr.slug} ehr={ehr} />)}
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Wolf EMR</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The BC Medical Journal reported in December 2020 that Wolf EMR would be retired by December 31, 2023. TELUS&apos;s add-on page now covers only CHR, Med Access, and PS Suite, so we don&apos;t profile Wolf.
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm">
              <a href="https://bcmj.org/news/data-migration-support-wolf-emr-retirement" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#0b766e] hover:underline">BCMJ, December 2020 <ExternalLink className="size-3.5" /></a>
              <a href="https://www.telus.com/en/health/health-professionals/clinics/emr-add-ons" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#0b766e] hover:underline">TELUS EMR add-ons <ExternalLink className="size-3.5" /></a>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Not profiled yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              OntarioMD&apos;s certified list also includes Cerebrum, MYLE, Avaros, and EMR Advantage, among others. B.C.&apos;s eReferral program lists integrations underway for MOIS, Plexia, and Profile. We haven&apos;t reviewed those yet.
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm">
              <a href="https://www.ontariomd.ca/emr-certification/certified-emrs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#0b766e] hover:underline">OntarioMD certified EMRs <ExternalLink className="size-3.5" /></a>
              <a href="https://dro.phsa.ca/about-dro/emr-integrations" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#0b766e] hover:underline">B.C. Digital Referrals and Orders <ExternalLink className="size-3.5" /></a>
              <a href="mailto:directory@openadapt.ai?subject=Canadian%20EMR%20evidence" className="font-semibold text-[#0b766e] hover:underline">Send us a source</a>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 rounded-2xl bg-[#10233f] p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Waiting on access, or no route for your step?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">See what teams do in the meantime, and what changes for staff when a referral is entered and checked through the EMR&apos;s screens.</p>
          </div>
          <Link href={NO_WRITE_API_PATH} className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-[#10233f] hover:bg-slate-100">
            See the before and after <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
