# GambutOps — Team Progress

Pembaruan terakhir: **14 Oktober 2026**.

| Area | Status | Branch | Ringkasan | Verifikasi aktual | Handoff berikutnya |
| --- | --- | --- | --- | --- | --- |
| Frontend shell F0 | IMPLEMENTED | `main` (`f3177ea`) | Shell enam route; detail ada di `frontend/docs/progress.md` | Historis: lint/typecheck/build PASS; browser sandbox FAIL | Engineer frontend melanjutkan kontrak/provider dan F1 |
| Frontend data F0 | IMPLEMENTED — menunggu review | `feat/f0-data` | Kontrak Zod + tipe, `GambutOpsRepository`, mock (deterministik, localStorage) + REST adapter, provider + cache per mode, UI sesuai `frontend/style.md` | lint/typecheck/build PASS; `test:data` 27/27 PASS; `test:shell` 1/1 PASS | `feat/frontend-monitoring` setelah `feat/f0-data` digabung |
| Backend foundation | IMPLEMENTED | `feat/backend-foundation` | FastAPI, OpenAPI v1, auth dua role, CORS, SQLAlchemy, migration PostgreSQL/PostGIS, 9 tabel | Ruff PASS; pytest 10 PASS; Alembic offline SQL PASS | Review kontrak frontend; uji migration pada PostGIS nyata; lanjut ETL GWT/API read |

## Catatan integrasi backend

- Endpoint aktif: `GET /health`, `GET /api/v1/auth/me`, `/docs`, `/openapi.json`.
- Endpoint data/workflow/ML sudah dipublikasikan sebagai kontrak, tetapi merespons `501` sampai
  milestone masing-masing diimplementasikan. Frontend tidak boleh memperlakukannya sebagai data.
- Mode bersama: `HISTORICAL_REPLAY` dan `CURRENT_MONITORING`.
- Role bersama: `coordinator` dan `field_officer`; endpoint write memakai bearer token server-side.
- ID entitas berbentuk UUID string. Semua waktu bertimezone; waktu FIRMS nantinya disimpan UTC.
- GWT nullable tetap `null`, bukan nol. Koordinat stasiun nullable dan tidak boleh dibuat tanpa
  `coordinate_source`.

## Blocker / risiko terbuka

- Migration baru tervalidasi sebagai SQL PostgreSQL offline; instance PostGIS aktif belum tersedia
  pada sesi ini, sehingga `alembic upgrade`/downgrade nyata belum diklaim lulus.
- Kontrak TypeScript/Zod frontend tersedia di `feat/f0-data` (`frontend/docs/data-contract.md`) dan
  perlu direview terhadap `/openapi.json` sebelum adapter REST diaktifkan.
- File kredensial lokal harus tetap tidak terlacak; secret yang pernah dibagikan harus dirotasi.

## Kebutuhan API dari frontend (`feat/f0-data`)

Ringkas, lengkapnya di `frontend/docs/data-contract.md#kebutuhan-api-untuk-backend`:

1. Semua endpoint observasi/prioritas/tugas menerima `mode` dan mengembalikan `mode`. Frontend menolak payload yang mode-nya berbeda.
2. Groundwater mengembalikan `{availability, notice, observations}`. Current Monitoring tanpa GWT terbaru → `NOT_AVAILABLE`.
3. Hotspots mengembalikan `{mode, items, last_synced_at}`; `bbox=minLon,minLat,maxLon,maxLat`.
4. Prioritas menyertakan `area_id`, `target`, dan `input_snapshot` berupa array dengan sumber dan waktu.
5. Tugas menyertakan `mode`, `area_id`, `history[]`; detail tugas menyertakan `reports`.
6. Transisi ilegal → 409 dengan `detail`; validasi → 422.
7. Endpoint baru: `GET /api/v1/users`.
8. Sementara auth demo, frontend mengirim header `X-Actor-Id`; backend tetap memverifikasi peran.
