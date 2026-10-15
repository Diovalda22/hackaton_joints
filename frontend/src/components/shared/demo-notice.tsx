"use client";

import { Database } from "lucide-react";
import { useIsDemoData } from "@/components/providers/gambutops-repository";
import { useMonitoring } from "@/components/providers/monitoring-context";

export function DemoNotice() {
  const { mode } = useMonitoring();
  const demo = useIsDemoData();
  return <div role="note" className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground md:px-8">
    <Database className="size-3.5 shrink-0" aria-hidden="true" />
    <span>{demo ? "Data contoh · DEMO" : "Data server"}</span><span aria-hidden="true">·</span>
    <span>{mode === "HISTORICAL_REPLAY" ? "Riwayat" : "Terkini"}</span>
    <span className="ml-auto">Prototipe</span>
  </div>;
}
