# GambutOps — Daftar Fitur dan Tugas Proyek

Pembaruan: 15 Oktober 2026. Status berdasarkan checkout `feat/backend-ml` sampai commit
`8fcef3a`, termasuk implementasi ML/integrasi browser `5720bd0`.

**Fokus aktif: acceptance lokal, review/freeze fitur, dan persiapan demo/submission.
Deployment ditunda sementara sesuai arahan pengguna; tugas hosting dan smoke publik tetap
terbuka dan dilanjutkan setelah ada arahan berikutnya.**

Bukti: [QA browser REST asli](frontend/docs/live-integration-qa.md),
[QA backend](backend/docs/backend-qa.md), [progres frontend §19](frontend/docs/progress.md#19-sesi-frontend-2026-10-15--integrasi-browser-ke-backenddatabase-asli),
dan [panduan menjalankan aplikasi](readme.md).

Pembaruan UI pada working tree: keenam halaman diringkas, penjelasan dipindahkan ke Detail,
panduan hanya saat diminta, serta kalender rentang/tanggal tunggal/waktu laporan menggantikan
kontrol tanggal native. Dropdown peran/wilayah/stasiun/tugas dan bulan/tahun kalender
kini memakai Select bersama. Verifikasi sesi UI: lint/typecheck, build mock/REST, 61 tes data,
15 tes browser mock dan ML REST terkontrol PASS. Tidak mengulang tes database/NASA asli;
bukti integrasi live tetap berasal dari sesi sebelumnya. Detail ada di tracker frontend §21–22.

## Pembagian untuk dua orang (baseline)

**Orang 1 — farkhan:** seluruh frontend, integrasi REST di browser, tes UI/E2E,
dan deployment frontend. Kepemilikan file: `frontend/**`, termasuk package/lockfile.

**Orang 2 — ferren:** seluruh pekerjaan lainnya: backend, database, ETL, NASA FIRMS,
decision engine, workflow server, ML, infrastruktur backend/database, dan submission.
Kepemilikan file: `backend/**`, konfigurasi infrastruktur, dan dokumen proyek tingkat root.

Catatan pembagian terbaru pada tracker frontend: teman menangani landing page, pengguna
menangani sisa frontend aplikasi. Tabel di bawah mempertahankan pemilik awal untuk referensi;
koordinasikan review dan acceptance lokal mengikuti pembagian terbaru tersebut.

Tugas bertanda “Bersama” pada checklist detail di bawah tetap memiliki satu penanggung jawab
utama sesuai tabel ini. Orang lainnya membantu verifikasi/review. Perubahan tracker dilakukan
bergantian agar tidak konflik. Kontrak API ditulis Anda dan direview teman sebelum adapter berubah.

### Task farkhan — frontend

| ID | Task | Status / hasil yang harus diserahkan |
| --- | --- | --- |
| FE-01 | Setup frontend, design system, shell, routing, konteks mode, shared states | MERGED (PR #7): shell, mode, panduan, MapLibre + fallback + layar penuh, responsif 320–1280 |
| FE-02 | Types/Zod, mock deterministik, repository mock/REST, provider dan validasi payload | MERGED (PR #5): Zod/tipe, mock + REST adapter, provider, validasi payload, pagination hotspot |
| FE-03 | Dashboard: filter, statistik, aktivitas, provenance dan peta ringkas | MERGED (PR #11): perhatian utama per peran, 4 angka, peta ringkas, kegiatan, provenance |
| FE-04 | Groundwater: pilihan stasiun, grafik, gap/null, statistik valid dan empty state terkini | MERGED (PR #7): stasiun, grafik gap/null, statistik valid, kelengkapan data, mode terkini; mock + REST diuji |
| FE-05 | Hotspots: MapLibre, marker/popup, daftar/selection, filter, pagination dan fallback | MERGED (PR #10) dari `feat/frontend-hotspots`: peta/daftar sinkron, pagination, filter satelit, tugas dari titik, status + sync FIRMS |
| FE-06 | Priorities: list/detail, alasan, snapshot, missing inputs, rekomendasi dan buat tugas | MERGED (PR #10) dari `feat/frontend-tasks`: REST BE-05 + mock, alasan/snapshot/missing, buat tugas |
| FE-07 | Tasks/reports: form, role UI, assignment, status/history, review dan follow-up | MERGED (PR #10) dari `feat/frontend-tasks`: REST BE-06 dengan Bearer token + mock, role demo, follow-up, E2E reload lulus |
| FE-08 | ML UI: grafik actual/predicted, metrik/baseline, versi model dan batasan | IMPLEMENTED: metrics/forecast REST, grafik + tabel, gate/batasan; browser backend asli PASS untuk BRG3/BRG6, forecast cocok artifact |
| FE-09 | Integrasi semua read/write API, loading/error/retry dan respons filter lama | IMPLEMENTED/QA lokal: 6 halaman REST, GWT/ML sesuai data asli, pagination/filter, workflow reload dan FIRMS live 200/429; smoke deployment masih terbuka |
| FE-10 | Browser/E2E, responsive 1440/768/375, accessibility, lint/typecheck/build | QA lokal PASS: lint/typecheck/build, 61 tes data, 15 tes browser mock, browser backend asli/workflow/dashboard/hotspots/FIRMS; QA deployment dan acceptance akhir masih terbuka |
| FE-11 | README/env frontend, URL API publik, deployment frontend, smoke incognito | DITUNDA: README/env lokal tersedia; URL API publik, deployment dan smoke incognito menunggu deployment dilanjutkan |
| FE-12 | Siapkan tampilan/alur demo untuk rekaman, screenshot dan dukung reviewer frontend | Belum; screenshot QA UI tersedia lokal, bahan rekaman/submission belum difinalkan |
| FE-13 | UI ringkas, kalender dan select library | IMPLEMENTED/QA lokal PASS pada working tree: detail opsional, panduan manual, kalender/dropdown konsisten; lihat frontend/docs/progress.md §21–22 |

### Task ferren — backend dan pekerjaan lainnya

| ID | Task | Status / hasil yang harus diserahkan |
| --- | --- | --- |
| BE-01 | PRD, roadmap, pembagian task, tracker dan kontrak OpenAPI | Tersedia; review kontrak/frontend dan deadline masih terbuka |
| BE-02 | FastAPI, auth/role, CORS, environment, SQLAlchemy, migration PostGIS dan seed demo | Implementasi/tes tersedia |
| BE-03 | ETL/audit GWT, import VIIRS, provenance, stations/GWT/hotspots API | IMPLEMENTED/QA lokal PASS: seed dan handoff tersedia, read API terintegrasi di browser |
| BE-04 | FIRMS live: client, sync endpoint, cache/dedup, status/waktu sync dan error handling | IMPLEMENTED/QA lokal PASS: browser FIRMS HTTP 200 (50 baris), cooldown 429 dan pembatasan role; review akhir terbuka |
| BE-05 | Decision engine: rules ber-versi, snapshot/as_of, reasons/missing dan priorities API | IMPLEMENTED/QA lokal PASS: snapshot idempotent, cutoff/mode/gap/report teruji; UI prioritas dan buat tugas terintegrasi |
| BE-06 | Tasks/reports API, role/ownership, state machine, history dan persistensi | IMPLEMENTED/QA lokal PASS: browser workflow/follow-up/verifikasi/reload, 2 laporan/9 riwayat; rollback terverifikasi |
| BE-07 | Baseline ML, fitur tanpa leakage, split kronologis, training Random Forest dan evaluasi | Implementasi/evaluasi nyata tersedia; kedua kandidat `EXPERIMENT_ONLY` karena tidak mengalahkan baseline |
| BE-08 | Artifact/version, metrics/forecast API dan validasi input historis | IMPLEMENTED/QA lokal PASS: API dan browser BRG3/BRG6 cocok artifact, missing history ditolak; deployment artifact ditunda |
| BE-09 | Tes backend/data/FIRMS/rules/workflow/ML, debug integrasi dan dokumentasi server | QA lokal PASS: Ruff, 67 tes backend tanpa skip, smoke Supabase dan browser REST asli; acceptance akhir terbuka |
| BE-10 | Hosting backend/database, migration/seed demo, secrets, CORS publik, health dan backup | DITUNDA: database Supabase/seed tersedia; hosting API, secret/CORS publik, artifact dan backup deployment belum ditutup |
| BE-11 | Koordinasi review/merge, checklist acceptance dan freeze fitur | Merge backend ML tercatat pada PR #9; review/acceptance akhir dan freeze fitur masih terbuka |
| BE-12 | Demo guide, akun/alur, rekam video, pitch deck, link/berkas dan submission akhir | Belum; gunakan tampilan/screenshot dari FE-12 |

### Handoff dan tanggung jawab integrasi

| Pekerjaan | Penanggung jawab utama | Dukungan orang lainnya |
| --- | --- | --- |
| Kontrak endpoint dan perubahan schema | Anda | Teman mereview kesesuaian adapter/UI |
| Integrasi API ke halaman dan browser E2E | Teman | Anda menyiapkan endpoint, seed dan memperbaiki kegagalan server |
| Database aplikasi, seed demo dan startup backend | Anda | Teman memverifikasi data melalui browser |
| Health dari frontend, filter/mode dan workflow lengkap | Teman | Anda memverifikasi payload, persistensi dan role server |
| Review PR | Engineer selain pembuat PR | Pembuat PR menyediakan bukti tes dan menyelesaikan temuan |
| Deploy frontend | Teman | Anda memberikan URL API, CORS dan health backend |
| Deploy backend/database dan backup | Anda | Teman menguji aplikasi pada URL publik |
| Video, pitch deck dan submission | Anda | Teman menyediakan tampilan/alur UI, screenshot dan review demo |

### Urutan kerja aktif

1. Sinkronkan tracker dengan bukti QA lokal dan commit yang tersedia.
2. Tutup review kontrak dan acceptance lokal bersama; verifikasi integrasi landing page.
3. Freeze fitur setelah acceptance, lalu siapkan skenario demo, screenshot, video dan pitch deck.
4. Deployment frontend/backend serta smoke publik ditunda sampai ada arahan berikutnya.

`[x]` berarti implementasi/pekerjaan yang disebut sudah tersedia dengan bukti pada repo.
`[ ]` berarti belum selesai atau belum terverifikasi. Checklist kode tidak otomatis menutup gate
integrasi, review, atau deployment.

## Fitur yang tersedia sekarang

| Fitur | Yang tersedia | Batas saat ini |
| --- | --- | --- |
| Shell aplikasi | Sidebar/drawer, topbar, enam route, mode switcher, toast, shared states | Enam halaman diimplementasikan; integrasi landing page belum diverifikasi |
| Backend foundation | FastAPI, Pydantic/OpenAPI, health, CORS, identitas dua role demo | Auth memakai bearer token demo; deployment auth production menunggu |
| Database | PostgreSQL/PostGIS, lima migration, sebelas tabel domain/import/sync, indeks geospasial/workflow | Supabase runtime terhubung; seed demo GWT dan 6.403 hotspot dua bbox selesai |
| Audit dan ETL GWT | Hash sumber, JSON audit, CSV normalisasi, null/gap/duplikat, import transaksional | Historis; koordinat stasiun null; `wrc` hanya arsip |
| API stasiun/GWT | Daftar stasiun, query UUID/tanggal/mode, provenance, nilai null | Grafik/adapter REST terintegrasi; nilai GWT UI cocok API asli |
| Import VIIRS historis | Streaming/COPY, waktu UTC, key stabil, dedup, riwayat import, dry-run | Terpisah dari produk/mode NRT |
| FIRMS live | Sync coordinator/CLI, lock/cooldown, cache NRT, status/riwayat; satu uji live berhasil | UI sync/cache teruji lokal; tidak semua kombinasi target/produk diklaim teruji |
| API hotspot | Filter tanggal/bbox/satelit/produk/mode, pagination, confidence mentah, FRP | Peta/list, pagination/filter dan cache NRT teruji lokal |
| Decision engine | Rules heuristik ber-versi, cutoff UTC, snapshot input/reason/missing dan dua area demo | Heuristik prioritas pemeriksaan; UI alasan/snapshot dan buat tugas terintegrasi |
| Tasks/reports | CRUD/filter, role/ownership, state machine, laporan SIMULASI dan history persisten | Workflow browser, follow-up, verifikasi dan reload lulus; laporan tetap SIMULASI |
| Verifikasi backend | 67 tes lulus tanpa skip termasuk PostGIS, rollback COPY, migration, workflow dan ML; smoke Supabase lulus | E2E REST lokal lulus; acceptance akhir terbuka, URL publik ditunda |

Import nyata pada database tes: delapan stasiun, 3.928 GWT unik, 809.523 hotspot.
Reimport seluruh CSV menambah nol baris. Angka ini bukan klaim database produksi sudah diisi.
Priorities, tasks/reports, serta metrics/forecast ML historis sudah tersedia dan terintegrasi
di browser REST lokal. Acceptance akhir tetap terbuka; smoke host deployment ditunda.

## 0. Persiapan dan pembagian kerja

- [x] Baca PRD produk, arsitektur, data, workflow, dan ML.
- [x] Sepakati kepemilikan: kita backend/data/FIRMS/ML; teman seluruh frontend.
- [x] Buat rencana milestone, branch, prompt handoff frontend, dan tracker.
- [ ] Review kontrak TypeScript/Zod frontend terhadap OpenAPI backend bersama teman.
- [ ] Tetapkan deadline dan kebutuhan demo lokal; target hosting/kapasitas deployment ditunda.

## 1. Foundation aplikasi

- [x] Frontend: setup Next.js/TypeScript/Tailwind, design system dan layout responsif.
- [x] Frontend: routing dashboard, groundwater, hotspots, priorities, tasks, dan eksperimen ML.
- [x] Frontend: konteks mode Historical Replay/Current Monitoring dan komponen loading/error/empty.
- [x] Frontend: lint/typecheck/build shell; hasil historis tercatat di tracker.
- [x] Backend: FastAPI, Pydantic, health, dokumentasi OpenAPI, konfigurasi environment dan CORS.
- [x] Backend: auth identitas coordinator/field_officer, dependency pembatas role, validasi token production.
- [x] Backend: SQLAlchemy, Alembic, Docker Compose PostgreSQL/PostGIS dan seed akun demo.
- [x] Backend: verifikasi migration pada PostGIS nyata.
- [x] Frontend: repository mock/REST, fixture deterministik, Zod validation, integrasi provider.
- [ ] Bersama: instalasi bersih, browser smoke shell, dan frontend berhasil memanggil health.

Gate: fondasi frontend/backend dapat dijalankan bersama dan kontrak diterima kedua engineer.

## 2. Data historis dan API monitoring

- [x] Backend: audit workbook GWT, SHA-256, missing, gap kalender, statistik dan duplikat.
- [x] Backend: pertahankan nilai negatif/nol/null dan audit konflik BRG5 tanpa koreksi tanggal otomatis.
- [x] Backend: importer GWT idempotent, provenance, row sumber, audit JSON/CSV.
- [x] Backend: audit/import tiga CSV VIIRS, timestamp UTC, sensor/satelit, key dedup dan indeks PostGIS.
- [x] Backend: riwayat import, transaksi, rollback kegagalan COPY, pembatas import penuh.
- [x] Backend: stations/GWT/hotspots API, validasi UUID/tanggal/bbox dan pagination.
- [x] Backend: mode terpisah; CSV lokal historis; koordinat stasiun tanpa sumber tetap null.
- [x] Backend: tes dan smoke API pada data nyata; commit/push `085023b`.
- [ ] Bersama: review dan merge branch data setelah pemeriksaan reviewer.
- [x] Anda: siapkan database aplikasi lokal dan seed GWT/sampel hotspot dua bbox DEMO; reimport tanpa duplikasi.
- [x] Anda: publikasikan handoff OpenAPI read API dan snapshot JSON nyata untuk teman frontend.
- [x] Teman: sesuaikan schema respons/REST adapter dengan handoff backend dan uji payload nyata (`feat/fe-read-contract`; lihat `frontend/docs/progress.md` §12).

Gate: frontend memakai data historis dari API/database dengan provenance dan missing yang benar.

## 3. Tampilan monitoring — milik teman

- [x] Dashboard: filter area/periode/mode, statistik nyata, prioritas, aktivitas dan sumber/waktu.
- [x] Groundwater: pilihan BRG6/BRG3/stasiun lain, grafik, tooltip, statistik valid dan gap/null.
- [x] Groundwater: Current Monitoring menjelaskan GWT terkini belum tersedia.
- [x] Hotspots: MapLibre zoom/pan, marker/popup, selection tersinkron dengan daftar.
- [x] Hotspots: filter periode/area/produk/satelit, pagination, UTC dan detail confidence/FRP.
- [x] Semua query: loading/empty/error/retry, validasi payload, abort/abaikan respons filter lama.
- [x] Peta: fallback basemap/WebGL; data sintetis berlabel DEMO.
- [x] Dashboard: integrasi peta ringkas setelah komponen peta siap.

Gate: pengguna dapat menelusuri GWT dan hotspot historis melalui browser.

## 4. NASA FIRMS live — milik kita

- [x] Client FIRMS server-side dengan key dari environment, timeout dan validasi respons.
- [x] Endpoint sync terautentikasi dan role coordinator; lock/cooldown target dan pembatas respons.
- [x] Dedup/upsert CSV/API per produk identik, cache database, mode terkini dan provenance produk.
- [x] Simpan status/waktu sync; error NASA mempertahankan data cache yang sudah ada.
- [x] Tes client/error/dedup dan uji live Batanghari/SNPP: 11 hotspot tersimpan.
- [x] Integrasi frontend FIRMS: sync HTTP 200, cooldown 429 dan pembatasan role teruji lokal.
- [ ] Tutup review akhir BE-04; uji target tambahan hanya jika diperlukan skenario demo.
- [x] Teman: tampilkan mode terkini, waktu sync, error/fallback dan label sumber.

Gate: hotspot terkini nyata tampil dengan timestamp/sensor; CSV historis tetap fallback berlabel.

## 5. Decision engine dan prioritas

- [x] Kita: aturan heuristik terkonfigurasi dan ber-versi untuk prioritas pemeriksaan.
- [x] Kita: snapshot input, reasons, explanation, missing inputs dan rekomendasi tersimpan.
- [x] Kita: query Historical Replay berhenti di `as_of`, tanpa future leakage atau campuran mode.
- [x] Kita: data kurang menghasilkan INSUFFICIENT_DATA; koordinat tak sah tidak dipakai menghitung jarak.
- [x] Kita: implementasi priorities API dan tes determinisme/missing/as_of.
- [x] Teman: daftar/detail prioritas, alasan, status heuristik, sumber/waktu dan input kurang.
- [x] Teman: aksi buat tugas terhubung ke workflow setelah tahap 6 siap.

Gate: assessment dapat ditelusuri dan dapat dipakai memulai tugas pemeriksaan.

## 6. Tugas dan laporan verifikasi

- [x] Kita: API list/detail/create/update tasks, referensi assessment/hotspot, assignee dan prioritas.
- [x] Kita: state machine OPEN → ASSIGNED → IN_PROGRESS → SUBMITTED.
- [x] Kita: review VERIFIED/DISMISSED/NEEDS_FOLLOWUP dan NEEDS_FOLLOWUP → ASSIGNED.
- [x] Kita: role/ownership server-side, report API, status history/aktor dan database persistence.
- [x] Kita: laporan demo selalu SIMULASI, validasi form/bukti/waktu dan tes transisi ilegal.
- [x] Teman: form RHF/Zod, tampilan coordinator/petugas, list/filter/detail dan feedback aksi.
- [x] Teman: repository localStorage untuk mock, penanganan storage invalid dan REST untuk write nyata.
- [x] Bersama: uji prioritas → tugas → petugas → laporan → review, termasuk reload/follow-up.

Gate: workflow lengkap tersimpan setelah reload dan tindakan sesuai kewenangan.

## 7. Eksperimen ML GWT +1 hari

- [x] Kita: baseline persistence BRG6/BRG3 dan fitur lag/rolling yang digeser tanpa leakage.
- [x] Kita: penanganan gap/missing, split kronologis train/validation/test dan training reproducible.
- [x] Kita: Random Forest, evaluasi MAE/RMSE cm terhadap baseline pada tanggal test yang sama.
- [x] Kita: artifact/model version, periode/ukuran test, fitur dan metrik tersimpan.
- [x] Kita: metrics/forecast API; tolak input tak lengkap dan hindari forecast kondisi live tanpa GWT terkini.
- [x] Teman: UI eksperimen, actual/predicted, perbandingan baseline, empty state dan batasan.
- [x] Bersama: model yang tidak mengalahkan baseline tetap ditampilkan sebagai eksperimen.

Gate: hasil training nyata dapat diperiksa; angka simulasi tidak disajikan sebagai metrik model.
CHIRPS merupakan P1 opsional dan tidak menghalangi penyelesaian P0.

## 8. Integrasi dan QA akhir

- [ ] Bersama: tutup integrasi seluruh endpoint dan sinkronisasi filter/mode lintas modul.
- [x] Kita: tes backend/ETL/FIRMS/rules/auth/workflow/ML; Ruff PASS dan 67 tes PASS tanpa skip pada PostGIS terisolasi, smoke Supabase PASS dengan rollback.
- [x] Teman: lint/typecheck/build dan browser/E2E lokal lulus; acceptance final tetap terbuka.
- [x] Teman: desktop 1440, tablet 768, mobile 375, keyboard/fokus dan fallback peta.
- [ ] Bersama: uji loading/error/empty, input invalid, reload, missing data dan transisi ilegal.
- [ ] Bersama: startup reproducible, README/env.example, seed/demo guide dan review secret/provenance.
- [ ] Bersama: review/merge milestone dan freeze fitur setelah acceptance criteria terpenuhi.

Gate: alur demo lengkap lulus pada aplikasi terintegrasi.

## 9. Deployment (ditunda) dan submission

- [ ] Bersama: tetapkan/konfirmasi target frontend/backend/database dan akses deploy.
- [ ] Kita: konfigurasi database, migration, import demo, environment/secret backend dan health.
- [ ] Teman: konfigurasi URL API frontend, build produksi dan deployment.
- [ ] Bersama: CORS domain publik, pemeriksaan auth, backup dataset dan prosedur pemulihan demo.
- [ ] Bersama: smoke/E2E pada URL publik melalui browser incognito.
- [ ] Bersama: panduan akun/alur demo, video, pitch deck, tautan dan berkas submission.
- [ ] Bersama: tandai proyek selesai setelah seluruh gate P0 dan scope ML yang disepakati terpenuhi.

Gate deployment (ditunda): demo publik dapat digunakan tanpa intervensi developer, data/sumber/waktu transparan,
dan workflow verifikasi persisten. Deployment dilakukan setelah target dan akses disepakati.

## Urutan pekerjaan berikutnya

1. Tutup review kontrak/OpenAPI dan acceptance lokal: enam halaman, mode/filter, workflow,
   missing/error/empty, role dan aksesibilitas; gunakan hasil QA yang ada dan uji ulang temuan baru.
2. Verifikasi integrasi landing page, instalasi/startup bersih dan panduan demo lokal.
3. Freeze fitur setelah acceptance, siapkan screenshot, rekaman video, pitch deck serta berkas submission.
4. Hosting backend/frontend, CORS publik dan smoke URL publik tetap ditunda sesuai arahan pengguna.

Riwayat verifikasi tersedia di [TEAM_PROGRESS.md](TEAM_PROGRESS.md).
Detail acceptance frontend tersedia di [tracker frontend](frontend/docs/progress.md).
