"use client";

import { CalendarDays, Database, History, Satellite, Info } from "lucide-react";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { useRepository } from "@/components/providers/gambutops-repository";
import { findArea } from "@/lib/domain/areas";
import { modeLabels } from "@/lib/domain/labels";
import { formatDate, formatDateRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MonitoringContextPanel() {
  const { mode, filter, asOf } = useMonitoring();
  const repository = useRepository();
  const historical = mode === "HISTORICAL_REPLAY";
  const Icon = historical ? History : Satellite;
  const area = findArea(filter.area_id);

  return (
    <section aria-labelledby="monitoring-context-title" className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h2 id="monitoring-context-title" className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-teal" aria-hidden="true" />Konteks pemantauan</h2>
        <Badge variant={historical ? "teal" : "warning"}>{historical ? "HISTORIS · DEMO" : "TERKINI · DEMO"}</Badge>
      </div>
      <div className="space-y-5 p-5" aria-live="polite" aria-atomic="true">
        <div><p className="text-lg font-semibold tracking-tight">{modeLabels[mode]}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">{historical ? `Data dibatasi sampai ${formatDate(asOf)}. Informasi setelah tanggal itu tidak digunakan.` : "Skenario demo pemantauan terkini. Label ini tidak menyatakan adanya data live."}</p></div>
        <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3.5">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div><p className="text-xs font-medium">Periode dan area</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{formatDateRange(filter.from, filter.to)} · {area?.label ?? "Semua area"}</p></div>
        </div>
        {!historical && <Alert className="border-amber-200 bg-amber-50"><Info className="text-amber-800" aria-hidden="true" /><div><AlertTitle>Data muka air terkini tidak tersedia</AlertTitle><AlertDescription>GWT 2018–2019 tidak digunakan untuk menggambarkan kondisi 2026.</AlertDescription></div></Alert>}
        <div className="border-t pt-4">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground">SUMBER DATA</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs leading-5 text-muted-foreground"><Database className="size-3.5 shrink-0" aria-hidden="true" />{repository.kind === "mock" ? "Data demo sintetis (mock). Tugas dan laporan tersimpan di browser ini." : "API GambutOps (REST)."}</p>
        </div>
      </div>
    </section>
  );
}
