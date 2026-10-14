import { areaIdForPoint } from "@/lib/domain/areas";
import { CURRENT_GWT_NOTICE, HISTORICAL_GWT_EMPTY_NOTICE } from "@/lib/domain/dashboard";
import { currentBounds } from "@/lib/domain/periods";
import type { GroundwaterObservation, GroundwaterSeries, Hotspot, HotspotCollection, QualityFlag, Station } from "@/types";
import { RepositoryError } from "./errors";
import type { GroundwaterQuery, HotspotQuery } from "./repository";
import type { ApiGroundwaterObservation, ApiHotspot, ApiHotspotPage, ApiStation } from "./rest-schemas";

// Pemetaan respons backend → model UI. Fungsi murni; payload sudah lolos rest-schemas.ts.

/** Konflik duplikat tetap dibedakan dari MISSING dan tidak pernah diubah menjadi angka. */
function toQualityFlag(flag: ApiGroundwaterObservation["quality_flag"]): QualityFlag {
  return flag === "DUPLICATE" ? "DUPLICATE_FLAGGED" : flag;
}

function modeMismatch(what: string): RepositoryError {
  return new RepositoryError("INVALID_PAYLOAD", `Data ${what} berisi mode yang tidak sesuai permintaan.`);
}

export function toStation(station: ApiStation): Station {
  return {
    id: station.id,
    code: station.code,
    region: station.region,
    lat: station.latitude,
    lon: station.longitude,
    coordinate_source: station.coordinate_source,
    period_start: station.period_start,
    period_end: station.period_end,
    source: station.source,
  };
}

function toGroundwaterObservation(row: ApiGroundwaterObservation): GroundwaterObservation {
  return {
    id: row.id,
    station_id: row.station_id,
    observed_at: row.observed_date,
    gwt_m: row.gwt_m,
    quality_flag: toQualityFlag(row.quality_flag),
    source: row.source,
    source_id: row.source_id,
    source_sha256: row.source_sha256,
    mode: row.mode,
  };
}

/** Backend mengirim array; UI memakai series dengan availability/notice dari query dan hasil. */
export function toGroundwaterSeries(query: GroundwaterQuery, rows: readonly ApiGroundwaterObservation[], today: string): GroundwaterSeries {
  if (rows.some((row) => row.mode !== query.mode || row.station_id !== query.station_id)) throw modeMismatch("GWT");
  let observations = rows.map(toGroundwaterObservation).sort((a, b) => a.observed_at.localeCompare(b.observed_at) || a.id.localeCompare(b.id));
  if (query.mode === "CURRENT_MONITORING") {
    // Guard: observasi lama tidak boleh tampil sebagai kondisi terkini.
    const minDate = currentBounds(today).min_date;
    observations = observations.filter((obs) => obs.observed_at >= minDate);
  }
  const base = { station_id: query.station_id, mode: query.mode, from: query.from, to: query.to };
  if (observations.length === 0) {
    const notice = query.mode === "CURRENT_MONITORING" ? CURRENT_GWT_NOTICE : HISTORICAL_GWT_EMPTY_NOTICE;
    return { ...base, availability: "NOT_AVAILABLE", notice, observations: [] };
  }
  // Gap tanggal dipertahankan; tidak ada baris buatan.
  return { ...base, availability: "AVAILABLE", notice: null, observations };
}

export function toHotspot(item: ApiHotspot): Hotspot {
  return {
    id: item.id,
    external_key: item.external_key,
    source_product: item.source_product,
    satellite: item.satellite,
    instrument: item.sensor,
    source: item.source,
    observed_at: item.acquired_at,
    quality_flag: toQualityFlag(item.quality_flag),
    mode: item.mode,
    latitude: item.latitude,
    longitude: item.longitude,
    frp_mw: item.frp,
    confidence_raw: item.confidence_raw,
    daynight: null,
    verification_status: item.verification_status,
    area_id: areaIdForPoint(item.longitude, item.latitude),
    imported_at: item.last_synced_at,
    is_simulation: false,
  };
}

export function toHotspotCollection(query: HotspotQuery, page: ApiHotspotPage): HotspotCollection {
  if (page.items.some((item) => item.mode !== query.mode)) throw modeMismatch("hotspot");
  const items = page.items.map(toHotspot);
  // Waktu import terbaru pada item halaman ini; API belum punya status sync global.
  const lastImport = items.reduce<string | null>((latest, item) => (item.imported_at && (!latest || Date.parse(item.imported_at) > Date.parse(latest)) ? item.imported_at : latest), null);
  return { mode: query.mode, items, total: page.total, limit: page.limit, offset: page.offset, last_synced_at: lastImport, last_synced_scope: "PAGE_IMPORT" };
}
