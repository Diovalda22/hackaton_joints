import { z } from "zod";
import { isoDateSchema, isoDateTimeSchema, monitoringModeSchema, provenanceShape } from "./common";

export const stationSchema = z
  .object({
    id: z.string().min(1),
    region: z.string().min(1),
    lat: z.number().min(-90).max(90).nullable(),
    lon: z.number().min(-180).max(180).nullable(),
    coordinate_source: z.string().min(1).nullable(),
    period_start: isoDateSchema.nullable(),
    period_end: isoDateSchema.nullable(),
    source: z.string().min(1),
  })
  // Koordinat tanpa sumber tidak boleh dipakai sebagai pin peta.
  .refine((station) => (station.lat === null) === (station.lon === null), "lat dan lon harus sama-sama terisi atau kosong")
  .refine((station) => station.lat === null || station.coordinate_source !== null, "Koordinat stasiun wajib memiliki coordinate_source");

export const groundwaterObservationSchema = z
  .object({
    id: z.string().min(1),
    station_id: z.string().min(1),
    ...provenanceShape,
    observed_at: isoDateSchema,
    /** Meter. Negatif berarti di bawah permukaan. Null berarti tidak ada pengamatan, bukan nol. */
    gwt_m: z.number().nullable(),
  })
  .refine((obs) => (obs.gwt_m === null) === (obs.quality_flag === "MISSING"), "gwt_m null harus berstatus MISSING");

export const groundwaterAvailabilitySchema = z.enum(["AVAILABLE", "NOT_AVAILABLE"]);

export const groundwaterSeriesSchema = z.object({
  station_id: z.string().min(1),
  mode: monitoringModeSchema,
  from: isoDateSchema,
  to: isoDateSchema,
  availability: groundwaterAvailabilitySchema,
  /** Penjelasan ketika data tidak tersedia, mis. GWT terkini pada Current Monitoring. */
  notice: z.string().nullable(),
  observations: z.array(groundwaterObservationSchema),
});

export const hotspotVerificationStatusSchema = z.enum(["UNVERIFIED", "IN_VERIFICATION", "VERIFIED", "DISMISSED"]);

export const hotspotSchema = z.object({
  id: z.string().min(1),
  external_key: z.string().min(1),
  source_product: z.string().min(1),
  satellite: z.string().min(1),
  instrument: z.string().min(1),
  ...provenanceShape,
  /** Waktu akuisisi satelit dalam UTC. */
  observed_at: isoDateTimeSchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  /** Fire Radiative Power (MW) bila tersedia. */
  frp_mw: z.number().nonnegative().nullable(),
  /** Nilai mentah FIRMS (VIIRS: l/n/h). Bukan probabilitas kebakaran. */
  confidence_raw: z.string().min(1).nullable(),
  daynight: z.enum(["D", "N"]).nullable(),
  verification_status: hotspotVerificationStatusSchema,
  area_id: z.string().min(1).nullable(),
  is_simulation: z.boolean(),
});

export const hotspotCollectionSchema = z.object({
  mode: monitoringModeSchema,
  items: z.array(hotspotSchema),
  last_synced_at: isoDateTimeSchema.nullable(),
});
