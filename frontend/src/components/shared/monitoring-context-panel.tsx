"use client";

import { CalendarDays, History, Satellite, Info } from "lucide-react";
import { useMonitoring, demoModeLabels } from "@/components/providers/monitoring-context";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MonitoringContextPanel() {
  const { mode } = useMonitoring();
  const historical = mode === "HISTORICAL_REPLAY";
  const Icon = historical ? History : Satellite;

  return (
    <section aria-labelledby="monitoring-context-title" className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h2 id="monitoring-context-title" className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-teal" aria-hidden="true" />Konteks pemantauan</h2>
        <Badge variant={historical ? "teal" : "warning"}>{historical ? "HISTORIS · DEMO" : "TERKINI · DEMO"}</Badge>
      </div>
      <div className="space-y-5 p-5" aria-live="polite" aria-atomic="true">
        <div><p className="text-lg font-semibold tracking-tight">{demoModeLabels[mode]}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">{historical ? "Replay menggunakan konteks waktu historis. Informasi setelah waktu replay tidak digunakan." : "Skenario demo pemantauan terkini. Label ini tidak menyatakan adanya data live."}</p></div>
        <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3.5">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div><p className="text-xs font-medium">Periode dan area</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Pemilihan periode dan area tersedia pada F1.1 setelah provider data dihubungkan.</p></div>
        </div>
        {!historical && <Alert className="border-amber-200 bg-amber-50"><Info className="text-amber-800" aria-hidden="true" /><div><AlertTitle>Data muka air terkini tidak tersedia</AlertTitle><AlertDescription>GWT 2018–2019 tidak digunakan untuk menggambarkan kondisi 2026.</AlertDescription></div></Alert>}
        <div className="border-t pt-4"><p className="text-[10px] font-semibold tracking-wider text-muted-foreground">SUMBER DAN WAKTU</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">Provider data belum dihubungkan. Belum ada pengamatan atau waktu sinkronisasi yang ditampilkan.</p></div>
      </div>
    </section>
  );
}
