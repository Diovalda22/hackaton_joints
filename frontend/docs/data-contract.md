# Kontrak data frontend (F0 data)

Sumber kebenaran kontrak: schema Zod di `src/lib/schemas/`. Tipe TypeScript di `src/types/` diturunkan dari schema tersebut (`z.infer`), sehingga validasi runtime dan tipe statis selalu sama.

## Struktur

| Lokasi | Isi |
| --- | --- |
| `src/lib/schemas/` | Schema Zod entitas, respons, dan input mutasi |
| `src/types/` | Tipe entitas hasil `z.infer` |
| `src/lib/api/repository.ts` | Interface `GambutOpsRepository` dan tipe query |
| `src/lib/api/rest-repository.ts` | `createRestRepository()` — fetch + validasi Zod + pemetaan error |
| `src/lib/mock/` | `createMockRepository()`, fixture deterministik, localStorage store, mock decision engine |
| `src/lib/domain/` | State machine tugas, area, periode, label, komposisi dashboard |
| `src/components/providers/` | `RepositoryProvider`, cache query, `MonitoringProvider`, hook data |

Komponen hanya memakai hook di `src/components/providers/data-hooks.ts`. Komponen tidak mengimpor fixture, `fetch`, atau `localStorage` secara langsung.

## Entitas

- `Station` — `lat`/`lon` boleh null. Koordinat tanpa `coordinate_source` ditolak. Stasiun tanpa koordinat hanya tampil di grafik/daftar.
- `GroundwaterObservation` — `gwt_m` dalam meter (negatif = di bawah permukaan); `null` wajib berflag `MISSING`, tidak pernah nol.
- `GroundwaterSeries` — `availability: AVAILABLE | NOT_AVAILABLE` + `notice`. Current Monitoring tanpa observasi terbaru → `NOT_AVAILABLE`.
- `Hotspot` — `observed_at` UTC, `confidence_raw` mentah FIRMS (bukan probabilitas), `frp_mw` nullable, `verification_status`.
- `PriorityAssessment` — `mode`, `as_of`, `priority`, `decision`, `reason_codes`, `missing_inputs`, `input_snapshot` (dengan sumber dan waktu), `rule_version`, `scientific_status: "heuristic_not_validated"`.
- `InspectionTask` / `InspectionTaskDetail` — status, `history` (aktor + peran + waktu), `mode`, `area_id`, `reports`.
- `FieldReport` — `observed_at`, `result`, `note`, `evidence_url`, `is_simulation`.
- `User` — `coordinator | field_officer`.
- ML — `MlMetricsResponse` (`NOT_AVAILABLE` atau `AVAILABLE` + eksperimen), `MlForecastResponse` (`REJECTED` atau `OK`).

Setiap observasi membawa provenance: `source`, `observed_at`, `quality_flag`, `mode`.

## Aturan mode

- Kunci cache query selalu diawali mode (`useModeQuery`), sehingga Historical Replay dan Current Monitoring tidak berbagi data.
- Filter periode/area disimpan terpisah per mode di `MonitoringProvider`. `as_of` = akhir periode.
- REST adapter menolak (`INVALID_PAYLOAD`) hotspot/assessment yang mode-nya berbeda dari permintaan atau `as_of`-nya melewati permintaan.
- REST adapter menyembunyikan observasi GWT lama pada Current Monitoring dan mengembalikan `NOT_AVAILABLE`.

## State machine tugas

`OPEN → ASSIGNED → IN_PROGRESS → SUBMITTED → VERIFIED | DISMISSED | NEEDS_FOLLOWUP`; `NEEDS_FOLLOWUP → ASSIGNED`.

| Ke status | Peran | Syarat |
| --- | --- | --- |
| ASSIGNED | coordinator | assignee terisi |
| IN_PROGRESS | field_officer | aktor = assignee |
| SUBMITTED | field_officer | hanya lewat `createReport`, aktor = assignee |
| VERIFIED / DISMISSED / NEEDS_FOLLOWUP | coordinator | — |

Pelanggaran → `RepositoryError` dengan kode `ILLEGAL_TRANSITION` atau `FORBIDDEN`.

## Error

`RepositoryError.code`: `NETWORK`, `HTTP`, `INVALID_PAYLOAD`, `NOT_FOUND`, `VALIDATION`, `ILLEGAL_TRANSITION`, `FORBIDDEN`, `ABORTED`. Pemetaan HTTP: 404 → NOT_FOUND, 401/403 → FORBIDDEN, 409 → ILLEGAL_TRANSITION, 400/422 → VALIDATION, lainnya → HTTP. `detail` FastAPI dipakai sebagai pesan.

## Mock repository

- Metadata stasiun (ID, wilayah, periode) mengikuti `mmc1.xlsx`. Nilai GWT dan hotspot **sintetis** dari PRNG ber-seed — tidak memakai `Math.random()`.
- Current Monitoring memakai tanggal demo tetap `2026-10-12` agar demo deterministik.
- Prioritas dihitung oleh mock engine `demo-rules-0.1` per blok area (3 blok per wilayah), hanya memakai tanda tren GWT tanpa ambang angka. Data kurang → `INSUFFICIENT_DATA`.
- Tugas dan laporan tersimpan di `localStorage` (`gambutops:demo-store:v1`), divalidasi Zod saat dibaca. Data rusak diganti seed dan memicu toast.
- ML mengembalikan `NOT_AVAILABLE` / `REJECTED`. Tidak ada metrik rekaan.

## Kebutuhan API untuk backend

1. `GET /api/v1/stations/{id}/groundwater` menerima `mode` dan mengembalikan bentuk `GroundwaterSeries` (`availability`, `notice`, `observations`).
2. `GET /api/v1/hotspots` menerima `mode`, `bbox=minLon,minLat,maxLon,maxLat`, `source_product`; mengembalikan `{ mode, items, last_synced_at }`.
3. `GET /api/v1/priorities` mengembalikan array `PriorityAssessment` termasuk `area_id`, `target`, `input_snapshot` sebagai array `{key,label,value,unit,source,observed_at}`. Opsional: filter `area_id`.
4. `GET /api/v1/tasks` menerima `mode`, `status` (dipisah koma), `assignee_id`. `GET /api/v1/tasks/{id}` mengembalikan task + `reports`.
5. Tugas memiliki `mode`, `area_id`, `history[]` (`from,to,actor_id,actor_role,at,note`).
6. Mutasi membaca aktor dari auth; selama auth demo, frontend mengirim header `X-Actor-Id`.
7. Endpoint baru yang dibutuhkan: `GET /api/v1/users` (daftar petugas untuk penugasan).
8. Transisi ilegal dikembalikan sebagai **409** dengan `detail` berbahasa Indonesia; validasi sebagai 422.
9. `GET /api/v1/ml/metrics` → `{status:"NOT_AVAILABLE",reason}` atau `{status:"AVAILABLE",experiments:[...]}`; `POST /api/v1/ml/forecast` → `{status:"REJECTED",reason}` atau `{status:"OK",...}`.
10. CORS allowlist untuk origin frontend.
