"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";

const WEEKS_PER_MONTH = 52 / 12;

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatHours(hours: number): string {
  return hours.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function RekeyEstimate() {
  const [perWeek, setPerWeek] = useState("50");
  const [minutesEach, setMinutesEach] = useState("11");
  const perWeekId = useId();
  const minutesId = useId();

  const weeklyHours = (toNumber(perWeek) * toNumber(minutesEach)) / 60;
  const monthlyHours = weeklyHours * WEEKS_PER_MONTH;

  return (
    <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:grid-cols-[1fr_1fr_1.1fr] md:items-end">
      <div>
        <label htmlFor={perWeekId} className="text-sm font-semibold text-slate-900">Referrals per week</label>
        <Input
          id={perWeekId}
          type="number"
          inputMode="numeric"
          min={0}
          value={perWeek}
          onChange={(event) => setPerWeek(event.target.value)}
          className="mt-2 h-10 border-slate-300 bg-white"
        />
        <p className="mt-2 text-xs leading-5 text-slate-500">Example value. Use your own.</p>
      </div>
      <div>
        <label htmlFor={minutesId} className="text-sm font-semibold text-slate-900">Minutes to enter one referral</label>
        <Input
          id={minutesId}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          value={minutesEach}
          onChange={(event) => setMinutesEach(event.target.value)}
          className="mt-2 h-10 border-slate-300 bg-white"
        />
        <p className="mt-2 text-xs leading-5 text-slate-500">About 10 to 12 in the two studies above.</p>
      </div>
      <div className="rounded-xl bg-[#f7f6f1] p-4" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">Staff time today</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#10233f]">{formatHours(weeklyHours)} hours a week</p>
        <p className="mt-1 text-sm text-slate-600">About {formatHours(monthlyHours)} hours a month</p>
      </div>
    </div>
  );
}
