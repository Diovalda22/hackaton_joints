"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GambutOpsRepository, TaskQuery } from "@/lib/api";
import { useRepository } from "./gambutops-repository";
import { useMonitoring } from "./monitoring-context";
import { useQueryCache } from "./query-cache";
import { useModeQuery, useRepositoryQuery } from "./use-repository-query";

// Hook fitur. Komponen memakai hook ini, bukan fixture, fetch, atau localStorage langsung.

export function useAreas() {
  return useRepositoryQuery(["areas"], (repo, signal) => repo.listAreas({ signal }));
}

export function useUsers() {
  return useRepositoryQuery(["users"], (repo, signal) => repo.listUsers({ signal }));
}

export function useStations() {
  return useRepositoryQuery(["stations"], (repo, signal) => repo.listStations({ signal }));
}

export function useGroundwater(stationId: string | null) {
  const { mode, filter } = useMonitoring();
  const params = stationId ? { station_id: stationId, from: filter.from, to: filter.to } : null;
  return useModeQuery(mode, "groundwater", params, (repo, signal) => repo.getGroundwater({ mode, station_id: stationId ?? "", from: filter.from, to: filter.to }, { signal }));
}

export function useHotspots(options: { source_product?: string | null } = {}) {
  const { mode, filter } = useMonitoring();
  const sourceProduct = options.source_product ?? null;
  return useModeQuery(mode, "hotspots", { from: filter.from, to: filter.to, area_id: filter.area_id, source_product: sourceProduct }, (repo, signal) =>
    repo.listHotspots({ mode, from: filter.from, to: filter.to, area_id: filter.area_id, source_product: sourceProduct }, { signal }));
}

export function usePriorities() {
  const { mode, asOf, filter } = useMonitoring();
  return useModeQuery(mode, "priorities", { as_of: asOf, area_id: filter.area_id }, (repo, signal) =>
    repo.listPriorities({ mode, as_of: asOf, area_id: filter.area_id }, { signal }));
}

export function useTasks(query: Omit<TaskQuery, "mode"> = {}) {
  const { mode } = useMonitoring();
  return useModeQuery(mode, "tasks", { ...query }, (repo, signal) => repo.listTasks({ ...query, mode }, { signal }));
}

export function useTask(id: string | null) {
  return useRepositoryQuery(id ? ["task", id] : null, (repo, signal) => repo.getTask(id ?? "", { signal }));
}

export function useDashboardSummary() {
  const { mode, asOf, filter } = useMonitoring();
  return useModeQuery(mode, "dashboard", { ...filter, as_of: asOf }, (repo, signal) =>
    repo.getDashboardSummary({ mode, from: filter.from, to: filter.to, as_of: asOf, area_id: filter.area_id }, { signal }));
}

export function useMlMetrics() {
  return useRepositoryQuery(["ml-metrics"], (repo, signal) => repo.getMlMetrics({ signal }));
}

export type MutationStatus = "idle" | "pending" | "success" | "error";

/** Menjalankan perubahan data lalu membersihkan cache agar semua tampilan memuat data terbaru. */
export function useRepositoryMutation<TArgs extends unknown[], TResult>(run: (repository: GambutOpsRepository, ...args: TArgs) => Promise<TResult>) {
  const repository = useRepository();
  const cache = useQueryCache();
  const [state, setState] = useState<{ status: MutationStatus; error: unknown }>({ status: "idle", error: null });
  const runRef = useRef(run);

  useEffect(() => {
    runRef.current = run;
  });

  const mutate = useCallback(async (...args: TArgs): Promise<TResult> => {
    setState({ status: "pending", error: null });
    try {
      const result = await runRef.current(repository, ...args);
      cache.invalidate();
      setState({ status: "success", error: null });
      return result;
    } catch (error) {
      setState({ status: "error", error });
      throw error;
    }
  }, [cache, repository]);

  return { ...state, mutate, isPending: state.status === "pending" };
}
