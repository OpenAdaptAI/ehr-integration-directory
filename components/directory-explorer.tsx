"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { EhrRecord, ehrs, statusLabels } from "@/lib/ehrs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";

function RecordCard({ ehr }: { ehr: EhrRecord }) {
  return (
    <article className="group grid gap-5 border-b border-slate-200 px-5 py-6 transition-colors hover:bg-white sm:px-7 lg:grid-cols-[1fr_190px_40px] lg:items-center">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{ehr.name}</h3>
          <StatusBadge status={ehr.status} />
        </div>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{ehr.verdict}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ehr.surfaces.slice(0, 4).map((surface) => (
            <span key={surface} className="rounded-md border border-slate-200 bg-[#fbfaf6] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-600">
              {surface}
            </span>
          ))}
        </div>
      </div>
      <div className="text-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">Access path</p>
        <p className="mt-1 line-clamp-3 leading-5 text-slate-600">{ehr.access}</p>
      </div>
      <Link href={`/ehr/${ehr.slug}`} className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-[#0b766e] group-hover:bg-[#0b766e] group-hover:text-white" aria-label={`View ${ehr.name} profile`}>
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

export function DirectoryExplorer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [surface, setSurface] = useState("all");

  const surfaces = useMemo(
    () => Array.from(new Set(ehrs.flatMap((ehr) => ehr.surfaces))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ehrs.filter((ehr) => {
      const matchesQuery = !needle || [ehr.name, ehr.vendor, ehr.market, ehr.summary, ...ehr.surfaces].join(" ").toLowerCase().includes(needle);
      const matchesStatus = status === "all" || ehr.status === status;
      const matchesSurface = surface === "all" || ehr.surfaces.includes(surface);
      return matchesQuery && matchesStatus && matchesSurface;
    });
  }, [query, status, surface]);

  const hasFilters = query || status !== "all" || surface !== "all";

  return (
    <section aria-labelledby="directory-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f7f6f1] shadow-[0_18px_55px_rgba(15,35,63,0.07)]">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow"><SlidersHorizontal className="size-3.5" /> Evidence explorer</p>
            <h2 id="directory-heading" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Compare public integration paths</h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-slate-500">Statuses describe the reviewed public evidence, not every contract, version, or local configuration.</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_210px_210px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search EHR, vendor, market, or interface" className="h-10 border-slate-300 bg-white pl-9" aria-label="Search directory" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full border-slate-300 bg-white" aria-label="Filter by evidence status"><SelectValue placeholder="Evidence status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All evidence states</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={surface} onValueChange={setSurface}>
            <SelectTrigger className="h-10 w-full border-slate-300 bg-white" aria-label="Filter by interface"><SelectValue placeholder="Interface" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All interfaces</SelectItem>
              {surfaces.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-10 border-slate-300" disabled={!hasFilters} onClick={() => { setQuery(""); setStatus("all"); setSurface("all"); }}>
            <X className="size-4" /> Clear
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 sm:px-7">
        <span>{filtered.length} of {ehrs.length} profiles</span>
        <span>Reviewed 2026-08-28</span>
      </div>
      <div>
        {filtered.map((ehr) => <RecordCard key={ehr.slug} ehr={ehr} />)}
        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-slate-900">No matching profiles</p>
            <p className="mt-2 text-sm text-slate-500">Clear a filter or try a vendor, market, or interface name.</p>
          </div>
        )}
      </div>
    </section>
  );
}
