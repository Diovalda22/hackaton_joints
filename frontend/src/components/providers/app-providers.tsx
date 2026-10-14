"use client";

import type { ReactNode } from "react";
import { MonitoringProvider } from "./monitoring-context";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MonitoringProvider>
      {children}
      <Toaster />
    </MonitoringProvider>
  );
}
