import type { FieldReportResult, HotspotVerificationStatus, MonitoringMode, PriorityDecision, PriorityLevel, TaskStatus, UserRole } from "@/types";

export const modeLabels: Record<MonitoringMode, string> = {
  HISTORICAL_REPLAY: "Historical Replay",
  CURRENT_MONITORING: "Current Monitoring",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  OPEN: "Baru",
  ASSIGNED: "Ditugaskan",
  IN_PROGRESS: "Dikerjakan",
  SUBMITTED: "Menunggu tinjauan",
  VERIFIED: "Terverifikasi",
  DISMISSED: "Ditutup",
  NEEDS_FOLLOWUP: "Perlu tindak lanjut",
};

/** Label tombol aksi menuju status tujuan. */
export const taskActionLabels: Record<TaskStatus, string> = {
  OPEN: "Buka",
  ASSIGNED: "Tugaskan",
  IN_PROGRESS: "Mulai kerjakan",
  SUBMITTED: "Kirim laporan",
  VERIFIED: "Verifikasi",
  DISMISSED: "Tutup tanpa temuan",
  NEEDS_FOLLOWUP: "Minta tindak lanjut",
};

export const priorityLabels: Record<PriorityLevel, string> = {
  HIGH: "Tinggi",
  MEDIUM: "Sedang",
  LOW: "Rendah",
  INSUFFICIENT_DATA: "Data kurang",
};

export const decisionLabels: Record<PriorityDecision, string> = {
  ESCALATE: "Eskalasi",
  REVIEW: "Perlu inspeksi",
  MONITOR: "Pantau",
  INSUFFICIENT_DATA: "Data belum cukup",
};

export const hotspotStatusLabels: Record<HotspotVerificationStatus, string> = {
  UNVERIFIED: "Belum diverifikasi",
  IN_VERIFICATION: "Sedang diperiksa",
  VERIFIED: "Terverifikasi",
  DISMISSED: "Tidak ditemukan api",
};

export const reportResultLabels: Record<FieldReportResult, string> = {
  ACTIVE_FIRE_FOUND: "Api aktif ditemukan",
  BURN_SCAR_FOUND: "Bekas terbakar ditemukan",
  NO_FIRE_FOUND: "Tidak ditemukan api",
  LOCATION_INACCESSIBLE: "Lokasi tidak dapat dijangkau",
};

export const roleLabels: Record<UserRole, string> = {
  coordinator: "Koordinator",
  field_officer: "Petugas lapangan",
};

/** Arti confidence mentah VIIRS. Bukan probabilitas kebakaran. */
export const confidenceLabels: Record<string, string> = {
  l: "Rendah",
  n: "Nominal",
  h: "Tinggi",
};

export const reasonCodeLabels: Record<string, string> = {
  HOTSPOT_UNVERIFIED: "Ada anomali panas yang belum diverifikasi",
  HOTSPOT_REPEATED: "Anomali panas muncul berulang pada beberapa hari",
  REPORT_SUPPORTS_FIRE: "Laporan lapangan mendukung adanya api atau bekas terbakar",
  HOTSPOT_ALL_CHECKED: "Semua anomali panas sudah diperiksa",
  NO_HOTSPOT: "Tidak ada anomali panas pada periode ini",
  GWT_DECLINING: "Muka air tanah wilayah cenderung menurun",
  GWT_NOT_DECLINING: "Muka air tanah wilayah tidak menurun",
  GWT_NOT_AVAILABLE: "Data muka air tanah tidak tersedia",
  GWT_INSUFFICIENT: "Pengamatan muka air tanah belum cukup untuk tren",
};

export const missingInputLabels: Record<string, string> = {
  GWT_CURRENT: "Muka air tanah terkini (tidak ada observasi setelah 2019)",
  GWT_TREND_7D: "Tren muka air tanah 7 hari",
  HOTSPOT_OBSERVATIONS: "Pengamatan anomali panas",
  CHIRPS_RAINFALL: "Curah hujan CHIRPS (P1, belum terintegrasi)",
};
