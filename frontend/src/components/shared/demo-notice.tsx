"use client";

import { Info } from "lucide-react";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { DemoBadge } from "./demo-badge";

export function DemoNotice() {
  const { mode } = useMonitoring();
  return (
    <div role="note" className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b bg-amber-50/70 px-4 py-2.5 text-xs leading-5 text-amber-950 md:px-8">
      <Info className="size-4 shrink-0" aria-hidden="true" />
      <DemoBadge />
      <span>Versi uji coba dengan data contoh. Titik panas dari satelit belum tentu kebakaran.</span>
      {mode === "HISTORICAL_REPLAY" && <span className="font-medium">Menampilkan data riwayat.</span>}
      {mode === "CURRENT_MONITORING" && <span className="font-medium">Data muka air terkini tidak tersedia.</span>}
    </div>
  );
}
