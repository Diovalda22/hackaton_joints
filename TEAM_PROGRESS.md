# GambutOps — Team Progress

Pembaruan terakhir: **14 Oktober 2026**.

| Area | Status | Branch | Ringkasan | Verifikasi aktual | Handoff berikutnya |
| --- | --- | --- | --- | --- | --- |
| Frontend shell F0 | IMPLEMENTED | `main` (`f3177ea`) | Shell enam route; detail ada di `frontend/docs/progress.md` | Historis: lint/typecheck/build PASS; browser sandbox FAIL | Engineer frontend melanjutkan kontrak/provider dan F1 |
| Backend foundation | IMPLEMENTED | `feat/backend-foundation` | FastAPI, OpenAPI v1, auth dua role, CORS, SQLAlchemy, migration PostgreSQL/PostGIS, 9 tabel | Ruff PASS; pytest 10 PASS; Alembic offline SQL PASS | Review kontrak frontend; uji migration pada PostGIS nyata; lanjut ETL GWT/API read |
| Backend data/read API | IMPLEMENTED | `feat/backend-data` | Audit/ETL GWT, importer COPY VIIRS idempotent, provenance/import runs, stations/GWT/hotspots API, mode/filter/pagination | Ruff PASS; 20 pytest PASS termasuk PostGIS nyata; migration upgrade/downgrade PASS; audit dataset nyata PASS | Frontend integrasikan tiga endpoint read; berikutnya FIRMS live dan priorities |

## Catatan integrasi backend

- Endpoint aktif: `GET /health`, `GET /api/v1/auth/me`, `/docs`, `/openapi.json`, stations,
  groundwater, dan hotspots. Priorities/workflow/ML masih merespons `501`.
- Hotspots menggunakan envelope `{items,total,limit,offset}`; default limit 200, max 1000.
  Filter tanggal menggunakan ISO date inklusif; bbox `west,south,east,north`, satellite dan
  source_product tersedia. GWT menambah provenance `source_id`/`source_sha256`.
- Mode bersama: `HISTORICAL_REPLAY` dan `CURRENT_MONITORING`.
- Role bersama: `coordinator` dan `field_officer`; endpoint write memakai bearer token server-side.
- ID entitas berbentuk UUID string. Semua waktu bertimezone; waktu FIRMS nantinya disimpan UTC.
- GWT nullable tetap `null`, bukan nol. Koordinat stasiun nullable dan tidak boleh dibuat tanpa
  `coordinate_source`.

## Blocker / risiko terbuka

- Migration upgrade/downgrade serta idempotensi import sudah lulus pada PostGIS 16/3.5 terisolasi.
  Konfigurasi database aplikasi/deployment tetap perlu ditentukan.
- Import penuh terverifikasi: 3.928 GWT dan 809.523 hotspot; reimport seluruh CSV menambah
  0 baris. Smoke API pada dataset tersebut mengembalikan delapan stasiun, filter GWT sesuai,
  total hotspot 809.523, dan mode terkini kosong. Ini verifikasi database tes lokal.
- Kontrak TypeScript/Zod frontend belum tersedia pada checkout ini dan perlu direview terhadap
  `/openapi.json` sebelum adapter REST diaktifkan.
- File kredensial lokal harus tetap tidak terlacak; secret yang pernah dibagikan harus dirotasi.

