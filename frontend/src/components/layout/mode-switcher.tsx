"use client";

import { History, Satellite } from "lucide-react";
import { toast } from "sonner";
import { useMonitoring, demoModeLabels, type DemoMode } from "@/components/providers/monitoring-context";
import { cn } from "@/components/ui/utils";

export function ModeSwitcher() {
  const { mode, setMode } = useMonitoring();

  function changeMode(next: DemoMode) {
    if (next === mode) return;
    setMode(next);
    toast.info(`Mode ${demoModeLabels[next]} aktif`, {
      description: next === "CURRENT_MONITORING"
        ? "Skenario DEMO. Data muka air terkini tidak tersedia."
        : "Skenario historis DEMO. Data dibatasi oleh waktu replay.",
    });
  }

  return (
    <div role="group" aria-label="Mode pemantauan" className="inline-flex max-w-full rounded-lg border bg-muted/60 p-1">
      {([
        ["HISTORICAL_REPLAY", "Putar historis", History],
        ["CURRENT_MONITORING", "Pemantauan terkini", Satellite],
      ] as const).map(([value, label, Icon]) => (
        <button
          key={value} type="button" aria-pressed={mode === value}
          title={demoModeLabels[value]} onClick={() => changeMode(value)}
          className={cn("flex min-h-9 items-center justify-center gap-2 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-sm", mode === value ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />{label}
        </button>
      ))}
    </div>
  );
}
