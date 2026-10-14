import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CANADA_PATH, NO_WRITE_API_PATH, OPENADAPT_PARTNERS_URL } from "@/lib/links";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-[#fbfaf6]">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="EHR Integration Directory home">
          <span className="grid size-9 place-items-center rounded-lg bg-[#10233f] font-mono text-sm font-semibold text-white">EI</span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-slate-950">EHR Integration Directory</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Published by OpenAdapt</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 sm:gap-x-5" aria-label="Primary navigation">
          <Link href={CANADA_PATH} className="transition-colors hover:text-slate-950">Canada</Link>
          <Link href="/methodology" className="transition-colors hover:text-slate-950">Methodology</Link>
          <Link href="/data" className="transition-colors hover:text-slate-950">Dataset</Link>
          <a href={OPENADAPT_PARTNERS_URL} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-slate-950 sm:inline">Partners</a>
          <Button asChild size="sm" className="bg-[#10233f] hover:bg-[#17345c]">
            <Link href={NO_WRITE_API_PATH}>No write API?</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
