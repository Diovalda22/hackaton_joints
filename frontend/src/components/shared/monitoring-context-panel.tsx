"use client";

import { useId } from "react";
import { Database, History, Info, RotateCcw, Satellite } from "lucide-react";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { useRepository } from "@/components/providers/gambutops-repository";
import { useAreas } from "@/components/providers/data-hooks";
import { modeDescriptions, modeLabels } from "@/lib/domain/labels";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fieldClass = "h-10 w-full min-w-0 rounded-md border bg-card px-3 text-sm transition-colors duration-150 hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function MonitoringContextPanel() {
  const { mode, bounds, filter, asOf, setFilter, resetFilter } = useMonitoring();
  const repository = useRepository();
  const areas = useAreas();
  const id = useId();
  const historical = mode === "HISTORICAL_REPLAY";
  const Icon = historical ? History : Satellite;
  const isDefault = filter.from === bounds.default_from && filter.to === bounds.default_to && filter.area_id === null;

  return (
    <section aria-labelledby={`${id}-title`} className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h2 id={`${id}-title`} className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-teal" aria-hidden="true" />Data yang ditampilkan</h2>
        <Badge variant={historical ? "teal" : "warning"}>{historical ? "RIWAYAT · DEMO" : "TERKINI · DEMO"}</Badge>
      </div>

      <div className="space-y-5 p-5">
        <div aria-live="polite">
          <p className="text-lg font-semibold tracking-tight">{modeLabels[mode]}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{modeDescriptions[mode]}</p>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Periode dan wilayah</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5 text-xs text-muted-foreground" htmlFor={`${id}-from`}>
              <span>Dari tanggal</span>
              <input id={`${id}-from`} type="date" className={fieldClass} value={filter.from} min={bounds.min_date} max={bounds.max_date}
                onChange={(event) => event.target.value && setFilter({ from: event.target.value })} />
            </label>
            <label className="space-y-1.5 text-xs text-muted-foreground" htmlFor={`${id}-to`}>
              <span>Sampai tanggal</span>
              <input id={`${id}-to`} type="date" className={fieldClass} value={filter.to} min={bounds.min_date} max={bounds.max_date}
                onChange={(event) => event.target.value && setFilter({ to: event.target.value })} />
            </label>
          </div>
          <label className="block space-y-1.5 text-xs text-muted-foreground" htmlFor={`${id}-area`}>
            <span>Wilayah</span>
            <select id={`${id}-area`} className={fieldClass} value={filter.area_id ?? ""} onChange={(event) => setFilter({ area_id: event.target.value || null })}>
              <option value="">Semua wilayah</option>
              {areas.data?.map((area) => <option key={area.id} value={area.id}>{area.label}</option>)}
            </select>
          </label>
          <p className="text-xs leading-5 text-muted-foreground">
            Bisa dipilih {formatDate(bounds.min_date)} – {formatDate(bounds.max_date)}.
            {historical && <> Data setelah <span className="font-medium text-foreground">{formatDate(asOf)}</span> tidak dipakai.</>}
          </p>
          {!isDefault && <Button variant="ghost" size="sm" onClick={resetFilter} className="-ml-2"><RotateCcw aria-hidden="true" />Kembalikan ke awal</Button>}
        </fieldset>

        {!historical && <Alert className="border-amber-200 bg-amber-50"><Info className="text-amber-800" aria-hidden="true" /><div><AlertTitle>Data muka air terkini tidak tersedia</AlertTitle><AlertDescription>Data 2018–2019 tidak dipakai untuk menggambarkan kondisi sekarang.</AlertDescription></div></Alert>}

        <div className="border-t pt-4">
          <p className="text-xs font-medium">Sumber data</p>
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground"><Database className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{repository.kind === "mock" ? "Data contoh (DEMO). Tugas dan laporan uji coba tersimpan di browser ini." : "Server GambutOps."}</p>
        </div>
      </div>
    </section>
  );
}
