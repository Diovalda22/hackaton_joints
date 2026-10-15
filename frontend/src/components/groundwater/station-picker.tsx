"use client";

import { useId } from "react";
import { formatDate } from "@/lib/format";
import type { Station } from "@/types";

const fieldClass = "h-10 w-full min-w-0 rounded-md border bg-card px-3 text-sm transition-colors duration-150 hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const NO_REGION = "Wilayah belum tercatat";

function optionLabel(station: Station): string {
  return station.period_end ? `${station.code} · data s.d. ${formatDate(station.period_end)}` : `${station.code} · periode belum tercatat`;
}

/** Dropdown native dikelompokkan per wilayah: aksesibel dan nyaman di layar sentuh. */
export function StationPicker({ stations, value, onChange }: { stations: readonly Station[]; value: string | null; onChange: (code: string) => void }) {
  const id = useId();
  const groups = new Map<string, Station[]>();
  for (const station of stations) {
    const region = station.region ?? NO_REGION;
    groups.set(region, [...(groups.get(region) ?? []), station]);
  }

  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Stasiun pengukuran</span>
      <select id={id} className={fieldClass} value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
        {[...groups].map(([region, items]) => (
          <optgroup key={region} label={region}>
            {items.map((station) => <option key={station.id} value={station.code}>{optionLabel(station)}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
