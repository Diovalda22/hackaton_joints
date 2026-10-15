# GambutOps — Team Progress

Pembaruan terakhir: **15 Oktober 2026**.

Daftar fitur dan checklist lengkap dari awal sampai submission tersedia di
[PROJECT_TASKS.md](PROJECT_TASKS.md). Checklist membedakan kode yang tersedia dari gate
review, integrasi, dan deployment yang masih terbuka.

Pembagian dua engineer: teman menangani seluruh frontend (FE-01–FE-12); Anda menangani
backend/data/FIRMS/rules/workflow/ML, infrastruktur, dan submission (BE-01–BE-12).
Penanggung jawab serta handoff tugas integrasi tercantum pada dokumen tersebut.

| Area | Status | Branch | Ringkasan | Verifikasi aktual | Handoff berikutnya |
| --- | --- | --- | --- | --- | --- |
| Frontend shell F0 | IMPLEMENTED | `main` (`f3177ea`) | Shell enam route; detail ada di `frontend/docs/progress.md` | Historis: lint/typecheck/build PASS; browser sandbox FAIL | Engineer frontend melanjutkan kontrak/provider dan F1 |
| Frontend data F0 | IMPLEMENTED — menunggu review | `feat/f0-data` | Kontrak Zod + tipe, `GambutOpsRepository`, mock (deterministik, localStorage) + REST adapter, provider + cache per mode, UI sesuai `frontend/style.md` | lint/typecheck/build PASS; `test:data` 27/27 PASS; `test:shell` 1/1 PASS | `feat/frontend-monitoring` setelah `feat/f0-data` digabung |
| Frontend UX pengguna awam | IMPLEMENTED — menunggu review | `feat/f0-data` | Modal panduan penggunaan, bahasa awam (tanpa kode fase/Inggris), pengatur periode & wilayah per mode | lint/typecheck/build PASS; `test:data` 27/27 PASS; `test:shell` 1/1 PASS | Detail di `frontend/docs/progress.md` |
| Backend foundation | IMPLEMENTED | `feat/backend-foundation` | FastAPI, OpenAPI v1, auth dua role, CORS, SQLAlchemy, migration PostgreSQL/PostGIS, 9 tabel | Ruff PASS; pytest 10 PASS; Alembic offline SQL PASS | Review kontrak frontend; uji migration pada PostGIS nyata; lanjut ETL GWT/API read |
| Backend data/read API | IMPLEMENTED | `feat/backend-data` | Audit/ETL GWT, importer COPY VIIRS idempotent, provenance/import runs, stations/GWT/hotspots API, mode/filter/pagination | Ruff PASS; 20 pytest PASS termasuk PostGIS nyata; migration upgrade/downgrade PASS; audit dataset nyata PASS | Frontend integrasikan tiga endpoint read; berikutnya FIRMS live dan priorities |
| Database aplikasi / handoff read API | IMPLEMENTED — frontend menunggu adaptasi | `feat/backend-read-contract` | PostGIS aplikasi port 5433, seed GWT dan hotspot dua bbox DEMO, metadata periode/sumber stations, 14 snapshot respons API nyata | Reimport GWT/dua sampel hotspot menambah 0 observasi; smoke filter/mode/pagination PASS | Teman menyesuaikan Zod/REST adapter menurut `backend/docs/read-api-handoff.md` |
| BE-04 FIRMS live | IMPLEMENTED — review/integrasi UI menunggu | `feat/backend-firms-priorities` | Client NASA, endpoint coordinator/CLI, lock/cooldown DB, status/riwayat, upsert mode terkini | 39 tes PASS termasuk PostGIS; Ruff PASS; uji live Batanghari/SNPP SUCCESS: 11 hotspot; smoke cache PASS; data historis utuh | Teman integrasikan status sync dan cache NRT; kita lanjut BE-05 setelah review |
| BE-05 Decision engine | IMPLEMENTED — review/integrasi UI menunggu | `feat/backend-firms-priorities` | Rules 1.0, prioritas dua area demo, snapshot/provenance DB idempotent, cutoff UTC dan pemisahan mode | 50 tes backend termasuk PostGIS; cutoff, gap, pengulangan, laporan setelah cutoff dan simulasi current diuji | Teman ikuti `backend/docs/priorities-handoff.md`; lanjut BE-06 tasks/reports |
| BE-06 Tasks/reports | IMPLEMENTED — review/UI menunggu | `feat/backend-tasks` | CRUD tugas, filter, assignment, state machine, ownership, laporan SIMULASI, history aktor, transaksi dan RLS | Smoke Supabase health/read/priorities/workflow PASS; write di-rollback; suite terbaru: 63 PASS, 4 SKIP | Teman ikuti `backend/docs/tasks-handoff.md` dan integrasikan workflow |
| Supabase database | RUNTIME CONNECTED — DEMO SEED COMPLETE | `hackaton_joints` (`jzdoblbhliezskncojoy`) | PostgreSQL 17, PostGIS 3.3.7, schema BE-06, dua user demo, akses FastAPI-only | SQLAlchemy import dan smoke API/workflow PASS; 8 stasiun, 3.928 GWT, 6.403 hotspot dua bbox, 0 duplicate key | Sync FIRMS terkini sesuai kebutuhan demo, lalu siapkan deployment |
| Supabase API smoke runner | BE-06 VERIFIED; BE-08 ML check PENDING | `feat/backend-tasks` | Health/OpenAPI/read API/priorities/workflow dan tambahan metrics/forecast ML | Smoke BE-06 dari terminal pengguna PASS dengan rollback; smoke terbaru BE-08 tidak selesai dari sandbox karena koneksi Supabase timeout | Jalankan `backend/scripts/smoke_supabase_api.py` dari terminal yang dapat mengakses Supabase setelah artifact tersedia di host API |
| BE-07 ML GWT +1 hari | IMPLEMENTED — belum di-commit | worktree `feat/backend-tasks`; target `feat/backend-ml` | Lag/rolling shifted, gap-safe, split kronologis 70/15/15, tuning validation, Random Forest deterministik, baseline pada tanggal sama | Dependency `.venv` sehat; training BRG6/BRG3 dua kali identik; keduanya `EXPERIMENT_ONLY` | Pindahkan bersama BE-08 ke branch ML saat Git writable |
| BE-08 ML artifact/API | IMPLEMENTED — runtime Supabase menunggu smoke | worktree `feat/backend-tasks`; target `feat/backend-ml` | Joblib + manifest/version, metrics envelope, forecast historis gap-safe, empty/rejected state, kontrak frontend | Ruff PASS; pytest 63 PASS/4 SKIP; service + HTTP contract PASS; artifacts dibuat di `backend/var/ml/` lokal | Pastikan artifact ikut tersedia pada host API, jalankan smoke runtime, teman integrasikan `backend/docs/ml-handoff.md` |

## Catatan integrasi backend

- Endpoint aktif: `GET /health`, `GET /api/v1/auth/me`, `/docs`, `/openapi.json`, stations,
  groundwater, hotspots, priorities, users, tasks, reports, serta metrics/forecast ML historis.
- Smoke Supabase terbaru yang menambahkan pemeriksaan ML belum terverifikasi karena koneksi dari
  sandbox timeout. Smoke workflow BE-06 sebelumnya sudah lulus dari terminal pengguna; seluruh
  perubahan test workflow di-rollback. Artifact ML saat ini tersimpan lokal di `backend/var/ml/`
  dan harus tersedia pada host API sebelum endpoint runtime dapat menyajikan metrics/forecast.
- Hasil eksperimen historis BE-07: BRG6 test 81 hari, model MAE/RMSE 2,843/4,191 cm
  dibanding baseline 1,705/3,094 cm; BRG3 test 75 hari, model 2,444/3,832 cm dibanding
  baseline 1,339/3,329 cm. Keduanya `EXPERIMENT_ONLY`, tidak dipakai decision engine dan bukan
  forecast kondisi 2026.
- Priorities: `GET /api/v1/priorities?mode=HISTORICAL_REPLAY&as_of=2019-09-15T23:59:59Z`.
  Dua area demo (bukan enam blok), snapshot objek, timestamp bertimezone wajib.
  Panduan: [handoff priorities](backend/docs/priorities-handoff.md). BE-05 bukan
  Pembuatan tugas dan alur verifikasi tersedia melalui BE-06.
- Tasks: list/detail publik untuk prototype; seluruh write memakai Bearer token. State machine,
  role/ownership, laporan SIMULASI, dan kode error integrasi dijelaskan pada
  [handoff BE-06](backend/docs/tasks-handoff.md). Header `X-Actor-Id` tidak dipakai backend.
- FIRMS: `POST /api/v1/admin/hotspots/sync` (bearer coordinator),
  `GET /api/v1/hotspots/sync-status`. Kontrak pagination read hotspot tetap sama.
  Detail status, error/cooldown dan contoh aktual: [handoff FIRMS](backend/docs/firms-handoff.md).
- Hotspots menggunakan envelope `{items,total,limit,offset}`; default limit 200, max 1000.
  Filter tanggal menggunakan ISO date inklusif; bbox `west,south,east,north`, satellite dan
  source_product tersedia. GWT menambah provenance `source_id`/`source_sha256`.
- Mode bersama: `HISTORICAL_REPLAY` dan `CURRENT_MONITORING`.
- Role bersama: `coordinator` dan `field_officer`; endpoint write memakai bearer token server-side.
- ID entitas berbentuk UUID string. Semua waktu bertimezone; waktu FIRMS nantinya disimpan UTC.
- GWT nullable tetap `null`, bukan nol. Koordinat stasiun nullable dan tidak boleh dibuat tanpa
  `coordinate_source`.
- Keputusan integrasi read API: OpenAPI backend menjadi acuan respons HTTP; teman mengubah
  schema respons/REST adapter frontend. Field stations menambah `period_start`, `period_end`,
  dan `source` nullable dari database. Panduan pemetaan dan contoh nyata tersedia di
  [handoff read API](backend/docs/read-api-handoff.md).

## Blocker / risiko terbuka

- Migration upgrade/downgrade serta idempotensi import sudah lulus pada PostGIS 16/3.5 terisolasi.
  Verifikasi metadata stations (termasuk stasiun tanpa observasi) lulus; 20 tes backend dan Ruff
  lulus pada sesi integrasi read API. Konfigurasi deployment tetap perlu ditentukan.
- Database aplikasi lokal kini sudah dikonfigurasi dan diseed: delapan stasiun, 3.928 GWT,
  dan 6.403 hotspot untuk 2019-08-17–2019-09-15 pada dua bbox DEMO. Migration mencapai
  `20261015_0003`. Kini ada 11 hotspot NRT Current Monitoring tambahan dari uji live satu target.
  Deployment masih belum ditentukan; tiga target produk/wilayah lain belum diuji live.
- Import penuh terverifikasi: 3.928 GWT dan 809.523 hotspot; reimport seluruh CSV menambah
  0 baris. Smoke API pada dataset tersebut mengembalikan delapan stasiun, filter GWT sesuai,
  total hotspot 809.523, dan mode terkini kosong. Ini verifikasi database tes lokal.
- Kontrak TypeScript/Zod frontend tersedia di `feat/f0-data` (`frontend/docs/data-contract.md`) dan
  perlu direview terhadap `/openapi.json` sebelum adapter REST diaktifkan.
- Migration `20261015_0004` dan tes alur database BE-06 belum dijalankan pada PostGIS sesi ini
  karena `GAMBUTOPS_TEST_DATABASE_URL` tidak tersedia; unit/contract suite tetap lulus.
- Supabase `hackaton_joints` sudah memiliki schema BE-06 dan PostGIS. Import runtime dari terminal
  pengguna berhasil: delapan stasiun, 3.928 observasi GWT historis, dan 6.403 hotspot historis
  (3.439 Batanghari; 2.964 Kubu Raya). Tiga import berstatus COMPLETED, SHA-256 sumber cocok,
  dan tidak ada duplicate external key. Password tersimpan
  pada `.env` lokal yang diabaikan Git. Model akses FastAPI-only; seluruh tabel dilindungi RLS
  tanpa policy Data API dan grant `anon`/`authenticated` dicabut (hasil audit: 12/12 tabel RLS,
  nol direct Data API grant). `spatial_ref_sys` dan fungsi extension tetap dikelola pemilik PostGIS
  Supabase dan bukan tabel data GambutOps.
- File kredensial lokal harus tetap tidak terlacak; secret yang pernah dibagikan harus dirotasi.

## Kebutuhan awal frontend (`feat/f0-data`)

Daftar berikut adalah usulan awal frontend, bukan kontrak HTTP backend yang sudah berlaku.
Untuk stations/GWT/hotspots, keputusan terbaru adalah frontend memetakan respons backend
sesuai handoff di atas. Kontrak write/priorities/ML akan dibahas pada milestone masing-masing.

Ringkas, lengkapnya di `frontend/docs/data-contract.md#kebutuhan-api-untuk-backend`:

1. Semua endpoint observasi/prioritas/tugas menerima `mode` dan mengembalikan `mode`. Frontend menolak payload yang mode-nya berbeda.
2. Groundwater mengembalikan `{availability, notice, observations}`. Current Monitoring tanpa GWT terbaru → `NOT_AVAILABLE`.
3. Hotspots mengembalikan `{mode, items, last_synced_at}`; `bbox=minLon,minLat,maxLon,maxLat`.
4. Prioritas menyertakan `area_id`, `target`, dan `input_snapshot` berupa array dengan sumber dan waktu.
5. Tugas menyertakan `mode`, `area_id`, `history[]`; detail tugas menyertakan `reports`.
6. Transisi ilegal → 409 dengan `detail`; validasi → 422.
7. Endpoint baru: `GET /api/v1/users`.
8. Frontend harus mengirim Bearer token sesuai role demo untuk write; `X-Actor-Id` diabaikan.
