"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// UI mode only. Entity contracts and the repository belong to feat/f0-data.
// These literals match the agreed MonitoringQuery.mode contract.
export type DemoMode = "HISTORICAL_REPLAY" | "CURRENT_MONITORING";

export const demoModeLabels: Record<DemoMode, string> = {
  HISTORICAL_REPLAY: "Historical Replay",
  CURRENT_MONITORING: "Current Monitoring",
};

interface MonitoringContextValue {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

const MonitoringContext = createContext<MonitoringContextValue | null>(null);

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DemoMode>("HISTORICAL_REPLAY");
  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>;
}

export function useMonitoring() {
  const value = useContext(MonitoringContext);
  if (!value) throw new Error("useMonitoring membutuhkan MonitoringProvider.");
  return value;
}
