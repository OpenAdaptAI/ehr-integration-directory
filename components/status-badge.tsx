import { Badge } from "@/components/ui/badge";
import { EvidenceStatus, statusLabels } from "@/lib/ehrs";
import { cn } from "@/lib/utils";

const statusStyles: Record<EvidenceStatus, string> = {
  documented: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "partner-gated": "border-amber-200 bg-amber-50 text-amber-900",
  "site-specific": "border-indigo-200 bg-indigo-50 text-indigo-800",
  "not-found": "border-rose-200 bg-rose-50 text-rose-800",
  unknown: "border-slate-200 bg-slate-100 text-slate-700",
};

export function StatusBadge({ status }: { status: EvidenceStatus }) {
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-[0.08em]", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}
