"use client";

import { useId } from "react";
import { DemoBadge } from "@/components/shared/demo-badge";
import { useMonitoring } from "@/components/providers/monitoring-context";
import { AREAS, findArea } from "@/lib/domain/areas";
import { AreaOverviewMap } from "./area-overview-map";

/** Pratinjau peta wilayah pemantauan; mengikuti pilihan wilayah di panel pengaturan. */
export function AreaOverviewSection() {
  const id = useId();
  const { filter } = useMonitoring();
  const selected = findArea(filter.area_id);

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h2 id={`${id}-title`} className="text-base font-semibold">Wilayah pemantauan</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {selected ? <>Menampilkan <span className="font-medium text-foreground">{selected.label}</span>.</> : "Menampilkan semua wilayah."}{" "}
            Ganti wilayah di panel <span className="font-medium text-foreground">Data yang ditampilkan</span>. Titik panas akan muncul di peta ini setelah halaman siap.
          </p>
        </div>
        <DemoBadge />
      </div>
      <AreaOverviewMap className="mt-4 h-[300px] sm:h-[380px]" />
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs leading-5 text-muted-foreground">
        <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 w-4 rounded-sm border border-dashed border-primary bg-primary/10" />Perkiraan batas wilayah</span>
        <span>{AREAS[0]?.boundary_source}.</span>
      </div>
    </section>
  );
}
