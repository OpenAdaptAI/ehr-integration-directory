import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { RekeyEstimate } from "@/components/rekey-estimate";
import { SiteHeader } from "@/components/site-header";
import { CANADA_PATH, OPENADAPT_HOME_URL, OPENADAPT_PARTNERS_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "No write API, or waiting on access?",
  description:
    "What teams do when an EMR's write API is gated, still pending, or doesn't cover the step, with one referral shown before and after.",
  alternates: { canonical: "/no-write-api" },
};

const UCSF_STUDY = {
  label: "Design and development of Referrals Automation, a SMART on FHIR solution to improve patient access to specialty care. JAMIA Open, 2020.",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7660949/",
};

const NHS_CASE_STUDY = {
  label: "Using digital technologies to process admin tasks (case study). HFMA, April 2024.",
  url: "https://www.hfma.org.uk/system/files/2024-04/Using%20digital%20technologies%20to%20process%20admin%20tasks%20Case%20Study%20v7.pdf",
};

type Owner = "Your product" | "Staff" | "Automation" | "A person";

const ownerStyles: Record<Owner, string> = {
  "Your product": "border-slate-200 bg-slate-100 text-slate-700",
  Staff: "border-amber-200 bg-amber-50 text-amber-900",
  Automation: "border-teal-200 bg-teal-50 text-teal-900",
  "A person": "border-amber-200 bg-amber-50 text-amber-900",
};

type Cell = { owner: Owner; text: string };

const steps: { step: string; today: Cell; after: Cell }[] = [
  {
    step: "Read the referral",
    today: { owner: "Your product", text: "Your product pulls out the patient, the reason, and the urgency." },
    after: { owner: "Your product", text: "No change. Your product still does this." },
  },
  {
    step: "Open the EMR",
    today: { owner: "Staff", text: "A staff member opens the EMR, sometimes inside a remote desktop window." },
    after: { owner: "Automation", text: "The automation opens the same screens on a computer that you or the clinic control." },
  },
  {
    step: "Find the patient",
    today: { owner: "Staff", text: "They search for the patient and pick the chart." },
    after: {
      owner: "Automation",
      text: "It searches the same way and checks that it's the right chart before typing. If two charts look alike, or none match, it stops before saving anything and asks a person.",
    },
  },
  {
    step: "Enter the details",
    today: { owner: "Staff", text: "They type the fields, attach the letter, and add the patient to the waitlist." },
    after: { owner: "Automation", text: "It types the same fields and saves." },
  },
  {
    step: "Confirm it saved",
    today: { owner: "Staff", text: "Whether anyone checks the saved record depends on the clinic." },
    after: {
      owner: "Automation",
      text: "It reads the saved record back and compares it with what your product sent. If they match, the case is done and checked. If they don't, the case isn't marked done, and a person gets it with what the automation found.",
    },
  },
  {
    step: "If a save is uncertain",
    today: { owner: "Staff", text: "Staff decide whether to enter it again." },
    after: {
      owner: "A person",
      text: "If the automation can't tell whether the save went through, it doesn't retry on its own. A person checks the record first.",
    },
  },
  {
    step: "What comes back",
    today: { owner: "Staff", text: "A status that someone updates by hand." },
    after: {
      owner: "Automation",
      text: "A receipt for each case that shows what was entered and how it was checked, plus the reason for each case that stopped.",
    },
  },
];

function OwnerChip({ owner }: { owner: Owner }) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${ownerStyles[owner]}`}>
      {owner}
    </span>
  );
}

function Citation({ source }: { source: { label: string; url: string } }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-[#0b766e] hover:underline">
      {source.label}
      <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
    </a>
  );
}

export default function NoWriteApiPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="eyebrow">Explainer</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#10233f] sm:text-5xl">No write API, or waiting on access?</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Your product already has the data. Maybe it read a faxed referral, matched a booking request, or collected an intake form. The last step is entering it in the clinic&apos;s EMR. When the vendor&apos;s API isn&apos;t open to you yet, or doesn&apos;t cover that step, someone on staff types it in by hand.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="options-heading">
          <h2 id="options-heading" className="text-2xl font-semibold tracking-tight text-[#10233f]">Four ways teams handle it</h2>
          <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2">
            <article className="bg-white p-6">
              <span className="font-mono text-[10px] text-slate-400">01</span>
              <h3 className="mt-4 font-semibold text-slate-900">Apply to the vendor&apos;s program</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                It&apos;s the cleanest route when it&apos;s open to you. For Accuro, you email QHR, sign a Terms of Use, and build in a sandbox that stays active for 6 months. Production comes after certification and a signed agreement, and each clinic may need its own approval.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                <Link href="/ehr/accuro" className="text-[#0b766e] hover:underline">Accuro profile</Link>
                <Link href={CANADA_PATH} className="text-[#0b766e] hover:underline">All Canadian profiles</Link>
              </div>
            </article>
            <article className="bg-white p-6">
              <span className="font-mono text-[10px] text-slate-400">02</span>
              <h3 className="mt-4 font-semibold text-slate-900">Send it through a referral network</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ocean moves referrals between clinics through a FHIR API, and lists Accuro, PS Suite, Med Access, CHR, OSCAR Pro, and Juno among its integrations. It delivers the referral and carries status back. Filing it in the receiving clinic&apos;s chart still depends on that clinic&apos;s EMR.
              </p>
              <Link href="/ehr/ocean" className="mt-3 inline-block text-sm font-semibold text-[#0b766e] hover:underline">Ocean profile</Link>
            </article>
            <article className="bg-white p-6">
              <span className="font-mono text-[10px] text-slate-400">03</span>
              <h3 className="mt-4 font-semibold text-slate-900">Have staff re-key it</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This is the default, and it costs staff time on every case. A 2020 time study at UCSF measured about 12 minutes of staff work to process one faxed referral into the EHR. A 2024 NHS case study put manual entry of one referral at about 10 minutes.
              </p>
            </article>
            <article className="bg-white p-6">
              <span className="font-mono text-[10px] text-slate-400">04</span>
              <h3 className="mt-4 font-semibold text-slate-900">Automate the screen and check the result</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Software repeats the clicks and typing a staff member does, through the same screens. Before typing, it confirms it&apos;s in the right patient&apos;s chart. After saving, it reads the record back and compares it with what your product sent. When something doesn&apos;t match, it stops and asks a person.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="before-after-heading">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 id="before-after-heading" className="text-2xl font-semibold tracking-tight text-[#10233f]">One referral, before and after</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">Illustration. Steps vary by clinic and EMR.</p>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="hidden border-b border-slate-200 bg-[#f7f6f1] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 md:grid md:grid-cols-[150px_1fr_1fr] md:gap-6">
              <span>Step</span>
              <span>Today: staff re-key it</span>
              <span>With a checked write through the screens</span>
            </div>
            {steps.map((row) => (
              <div key={row.step} className="grid gap-3 border-b border-slate-200 px-5 py-5 last:border-0 md:grid-cols-[150px_1fr_1fr] md:gap-6">
                <p className="text-sm font-semibold text-slate-900">{row.step}</p>
                <div>
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 md:hidden">Today</p>
                  <OwnerChip owner={row.today.owner} />
                  <p className="mt-2 text-sm leading-6 text-slate-600">{row.today.text}</p>
                </div>
                <div>
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 md:hidden">With a checked write</p>
                  <OwnerChip owner={row.after.owner} />
                  <p className="mt-2 text-sm leading-6 text-slate-700">{row.after.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">What changes for staff</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">They stop typing every case. They handle the cases that stopped, and each one arrives with the reason.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">What stays the same</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">The clinic keeps its EMR, its user accounts, and its approval rules.</p>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="estimate-heading">
          <h2 id="estimate-heading" className="text-2xl font-semibold tracking-tight text-[#10233f]">Estimate today&apos;s staff time</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Enter your own volume. The result covers re-keying only.</p>
          <div className="mt-5">
            <RekeyEstimate />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Measure the after side on your own cases: how many still need a person, and how long each one takes. For comparison, one NHS trust that automated this step with a different tool still sent about 5% of referrals to staff.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="checklist-heading">
          <h2 id="checklist-heading" className="text-2xl font-semibold tracking-tight text-[#10233f]">Before you automate a screen, check these</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>The EMR contract and terms of use, for anything about automated access. If it&apos;s unclear, ask the vendor.</li>
            <li>Who at the clinic approves the user account that the automation runs under.</li>
            <li>How you&apos;ll read the saved record back, and who reviews a mismatch.</li>
            <li>Where the automation runs, and who can see its logs and screenshots.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-300 bg-white p-6 sm:p-8" aria-labelledby="disclosure-heading">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Disclosure</p>
          <h2 id="disclosure-heading" className="mt-2 text-xl font-semibold text-[#10233f]">About OpenAdapt</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            OpenAdapt publishes this directory and sells software for the fourth option above. A person shows the task once while OpenAdapt records it. OpenAdapt turns that recording into an automation that enters the data through the same screens and checks the saved record before it reports a case as done.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            OpenAdapt has no partnership with any vendor listed here, and a profile in this directory doesn&apos;t mean OpenAdapt has run on that EMR. Before it goes live on a clinic&apos;s EMR, it gets a readiness test on that clinic&apos;s setup with the clinic&apos;s own cases.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
            <a href={OPENADAPT_HOME_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#0b766e] hover:underline">
              Learn how OpenAdapt works <ArrowRight className="size-4" />
            </a>
            <a href={OPENADAPT_PARTNERS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#0b766e] hover:underline">
              Building a product that writes into EMRs? See the partner program <ArrowRight className="size-4" />
            </a>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-8" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-sm font-semibold text-slate-900">Sources</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            <li><Citation source={UCSF_STUDY} /> <span className="text-slate-500">Mean of 719 seconds per referral, from a time and motion study of 7 staff.</span></li>
            <li><Citation source={NHS_CASE_STUDY} /> <span className="text-slate-500">Calderdale and Huddersfield NHS Foundation Trust: 10 minutes per referral by hand, and about 5% of referrals left for staff after automation.</span></li>
            <li className="text-slate-500">Vendor facts link to their sources on each profile, such as <Link href="/ehr/accuro" className="text-[#0b766e] hover:underline">Accuro</Link> and <Link href="/ehr/ocean" className="text-[#0b766e] hover:underline">Ocean</Link>.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
