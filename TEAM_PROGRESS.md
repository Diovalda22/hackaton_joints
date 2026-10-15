# GambutOps — Team Progress

Pembaruan terakhir: **15 Oktober 2026**.

Daftar fitur dan checklist lengkap dari awal sampai submission tersedia di
[PROJECT_TASKS.md](PROJECT_TASKS.md). Checklist membedakan kode yang tersedia dari gate
review, integrasi, dan deployment yang masih terbuka.

Pembagian dua engineer: teman menangani seluruh frontend (FE-01–FE-12); Anda menangani
backend/data/FIRMS/rules/workflow/ML, infrastruktur, dan submission (BE-01–BE-12).
Penanggung jawab serta handoff tugas integrasi tercantum pada dokumen tersebut.

## Status terkini

**QA integrasi lokal PASS. Deployment ditunda sementara sesuai arahan pengguna.**
Status berdasarkan checkout `feat/backend-ml` sampai `8fcef3a`, termasuk commit integrasi
`5720bd0`. Hasil backend/live merujuk catatan QA sebelumnya; hasil UI terbaru diverifikasi pada sesi
penyederhanaan UI (working tree), lihat tracker frontend §21.

| Area | Status | Bukti / batas |
| --- | --- | --- |
| Shell, repository mock/REST dan enam halaman frontend | IMPLEMENTED | Dashboard, GWT, hotspots, priorities, tasks/reports dan eksperimen ML tersedia |
| Backend/data/FIRMS/rules/workflow/ML | IMPLEMENTED | Endpoint read/write dan seed demo tersedia; merge backend ML tercatat pada PR #9 |
| QA backend | PASS lokal | Ruff; 67 tes, 0 skip pada PostGIS terisolasi; smoke Supabase dengan rollback |
| QA frontend | PASS lokal | Lint/typecheck/build; 61 tes data; 15 tes browser mock |
| Browser REST ke FastAPI lokal + Supabase | PASS lokal | Nilai GWT sesuai API; ML BRG3/BRG6 sesuai artifact; input tanpa riwayat ditolak |
| Workflow browser | PASS lokal | Tindak lanjut, verifikasi, reload/tab baru; 2 laporan dan 9 riwayat; rollback terverifikasi |
| FIRMS browser live | PASS lokal | HTTP 200, 50 baris; percobaan ulang 429; tombol dibatasi untuk koordinator |
| Responsif | PASS lokal | Enam halaman setelah data termuat, 1440/768/375/320 px, tanpa overflow |
| UI ringkas, kalender dan dropdown | IMPLEMENTED / QA lokal PASS | Keenam halaman, Detail opsional, panduan manual, kalender rentang/ML/laporan, select peran/wilayah/stasiun/tugas; lihat frontend §21–22 |
| Review/acceptance akhir dan freeze | TERBUKA | Review kontrak, integrasi landing page, startup bersih dan checklist demo lokal |
| Deployment dan smoke publik | DITUNDA | Hosting API/frontend, artifact host, secret/CORS publik, TLS dan smoke publik belum ditutup |
| Demo/submission | TERBUKA | Panduan skenario, screenshot, video, pitch deck dan berkas akhir |

Bukti rinci: [QA browser REST asli](frontend/docs/live-integration-qa.md),
[QA backend](backend/docs/backend-qa.md), dan [progres frontend §19](frontend/docs/progress.md).
Panduan startup lokal tersedia di [readme.md](readme.md).

Pembagian terbaru yang dicatat frontend: teman menangani landing page, pengguna menangani
sisa frontend aplikasi; pembagian awal di atas dipertahankan sebagai konteks historis.

## Pekerjaan berikutnya

1. Tutup review kontrak dan acceptance lokal berdasarkan bukti yang ada; uji ulang bila ada perubahan atau temuan.
2. Verifikasi integrasi landing page dan startup bersih, lalu finalisasi panduan demo lokal.
3. Freeze fitur setelah acceptance; siapkan screenshot, video, pitch deck dan submission.
4. Lanjutkan deployment hanya setelah ada arahan pengguna berikutnya.

## Catatan historis backend

Catatan di bawah menyimpan milestone dan handoff terdahulu. Pernyataan lama tentang UI,
review atau browser yang masih menunggu tidak menggantikan status terkini di atas.

## Catatan integrasi backend

- Endpoint aktif: `GET /health`, `GET /api/v1/auth/me`, `/docs`, `/openapi.json`, stations,
  groundwater, hotspots, priorities, users, tasks, reports, serta metrics/forecast ML historis.
- Smoke API lokal dengan database Supabase sudah lulus menggunakan akses jaringan di luar
  sandbox: metrics BRG3/BRG6 AVAILABLE, forecast sesuai artifact, missing history REJECTED,
  serta workflow sampai VERIFIED. Seluruh write uji di-rollback. Artifact ML tersimpan di
  `backend/var/ml/` dan masih harus disertakan pada host deployment. Ini belum smoke URL publik.
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

## Catatan risiko dan kebutuhan terdahulu

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
- Seluruh lima migration dan tes alur BE-06 telah lulus pada database PostGIS lokal khusus
  `gambutops_qa_20261015_test`: 67 tes PASS tanpa skip. Database aplikasi tidak dipakai oleh
  migration test. Browser/E2E frontend dan smoke URL publik tetap terbuka.
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
