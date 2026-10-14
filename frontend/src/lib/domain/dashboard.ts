import type { DashboardQuery, GambutOpsRepository, RequestOptions } from "@/lib/api/repository";
import type { Activity, DashboardSummary, InspectionTask } from "@/types";
import { findArea } from "./areas";
import { ACTIVE_STATUSES, TERMINAL_STATUSES } from "./task-state-machine";

const ACTIVITY_LIMIT = 8;

type SummarySources = Pick<GambutOpsRepository, "listHotspots" | "listPriorities" | "listTasks" | "listStations" | "getGroundwater">;

export const CURRENT_GWT_NOTICE = "Data muka air terkini tidak tersedia. GWT 2018–2019 tidak menggambarkan kondisi saat ini.";

/** Ringkasan dashboard disusun dari operasi domain agar konsisten dengan halaman modul. */
export async function composeDashboardSummary(repo: SummarySources, query: DashboardQuery, options: RequestOptions = {}): Promise<DashboardSummary> {
  const region = findArea(query.area_id)?.region ?? null;
  const [hotspots, priorities, tasks, stations] = await Promise.all([
    repo.listHotspots({ mode: query.mode, from: query.from, to: query.to, area_id: query.area_id }, options),
    repo.listPriorities({ mode: query.mode, as_of: query.as_of, area_id: query.area_id }, options),
    repo.listTasks({ mode: query.mode }, options),
    repo.listStations(options),
  ]);

  const scopedTasks = query.area_id ? tasks.filter((task) => task.area_id === query.area_id) : tasks;
  const scopedStations = region ? stations.filter((station) => station.region === region) : stations;

  const groundwater: DashboardSummary["groundwater"] = { availability: "NOT_AVAILABLE", stations: 0, valid_days: 0, missing_days: 0, notice: CURRENT_GWT_NOTICE };
  if (query.mode === "HISTORICAL_REPLAY") {
    const series = await Promise.all(scopedStations.map((station) => repo.getGroundwater({ mode: query.mode, station_id: station.id, from: query.from, to: query.to }, options)));
    const withData = series.filter((item) => item.observations.length > 0);
    groundwater.availability = withData.length > 0 ? "AVAILABLE" : "NOT_AVAILABLE";
    groundwater.stations = withData.length;
    groundwater.valid_days = withData.reduce((sum, item) => sum + item.observations.filter((obs) => obs.gwt_m !== null).length, 0);
    groundwater.missing_days = withData.reduce((sum, item) => sum + item.observations.filter((obs) => obs.gwt_m === null).length, 0);
    groundwater.notice = withData.length > 0 ? null : "Tidak ada pengamatan GWT pada periode ini.";
  }

  const priorityCounts: DashboardSummary["priorities"] = { HIGH: 0, MEDIUM: 0, LOW: 0, INSUFFICIENT_DATA: 0 };
  for (const assessment of priorities) priorityCounts[assessment.priority] += 1;

  return {
    mode: query.mode,
    as_of: query.as_of,
    from: query.from,
    to: query.to,
    area_id: query.area_id,
    hotspots: {
      total: hotspots.items.length,
      unverified: hotspots.items.filter((hotspot) => hotspot.verification_status === "UNVERIFIED").length,
      last_synced_at: hotspots.last_synced_at,
      source: hotspots.items[0]?.source ?? null,
    },
    tasks: {
      active: scopedTasks.filter((task) => ACTIVE_STATUSES.includes(task.status)).length,
      awaiting_review: scopedTasks.filter((task) => task.status === "SUBMITTED").length,
      closed: scopedTasks.filter((task) => TERMINAL_STATUSES.includes(task.status)).length,
    },
    priorities: priorityCounts,
    groundwater,
    activity: buildActivity(scopedTasks),
  };
}

export function buildActivity(tasks: readonly InspectionTask[], limit = ACTIVITY_LIMIT): Activity[] {
  return tasks
    .flatMap((task) => task.history.map((change, index): Activity => ({
      id: `${task.id}:${index}`,
      at: change.at,
      kind: change.from === null ? "TASK_CREATED" : change.to === "SUBMITTED" ? "REPORT_SUBMITTED" : "TASK_STATUS",
      task_id: task.id,
      task_title: task.title,
      status: change.to,
      actor_id: change.actor_id,
      is_simulation: task.is_simulation,
    })))
    .sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id))
    .slice(0, limit);
}
