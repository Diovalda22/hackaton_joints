# GambutOps — Daftar Fitur dan Tugas Proyek

Pembaruan: 15 Oktober 2026. Baseline data historis: `feat/backend-data`, commit `085023b`.
Daftar ini mencakup backend milik kita, frontend milik teman, dan pekerjaan bersama sampai submission.
Status frontend berdasarkan checkout ini; pekerjaan di branch teman belum diperiksa.

## Pembagian untuk dua orang

**Orang 1 — farkhan:** seluruh frontend, integrasi REST di browser, tes UI/E2E,
dan deployment frontend. Kepemilikan file: `frontend/**`, termasuk package/lockfile.

**Orang 2 — ferren:** seluruh pekerjaan lainnya: backend, database, ETL, NASA FIRMS,
decision engine, workflow server, ML, infrastruktur backend/database, dan submission.
Kepemilikan file: `backend/**`, konfigurasi infrastruktur, dan dokumen proyek tingkat root.

Tugas bertanda “Bersama” pada checklist detail di bawah tetap memiliki satu penanggung jawab
utama sesuai tabel ini. Orang lainnya membantu verifikasi/review. Perubahan tracker dilakukan
bergantian agar tidak konflik. Kontrak API ditulis Anda dan direview teman sebelum adapter berubah.

### Task farkhan — frontend

| ID | Task | Status / hasil yang harus diserahkan |
| --- | --- | --- |
| FE-01 | Setup frontend, design system, shell, routing, konteks mode, shared states | Tersedia; browser smoke masih perlu ditutup |
| FE-02 | Types/Zod, mock deterministik, repository mock/REST, provider dan validasi payload | Belum; selaraskan dengan OpenAPI dan pagination hotspot |
| FE-03 | Dashboard: filter, statistik, aktivitas, provenance dan peta ringkas | Belum; komposisikan data dari API, lengkapi saat priorities/tasks siap |
| FE-04 | Groundwater: pilihan stasiun, grafik, gap/null, statistik valid dan empty state terkini | Belum; stations/GWT API sudah siap |
| FE-05 | Hotspots: MapLibre, marker/popup, daftar/selection, filter, pagination dan fallback | Belum; CSV/read API siap, status live menyusul BE-04 |
| FE-06 | Priorities: list/detail, alasan, snapshot, missing inputs, rekomendasi dan buat tugas | Belum; mock dahulu, REST setelah BE-05/06 |
| FE-07 | Tasks/reports: form, role UI, assignment, status/history, review dan follow-up | Belum; REST setelah BE-06; localStorage hanya pada mock |
| FE-08 | ML UI: grafik actual/predicted, metrik/baseline, versi model dan batasan | Belum; hasil nyata setelah BE-07/08 |
| FE-09 | Integrasi semua read/write API, loading/error/retry dan respons filter lama | Belum; dikerjakan bertahap bersama halaman terkait |
| FE-10 | Browser/E2E, responsive 1440/768/375, accessibility, lint/typecheck/build | Shell checks tersedia; QA final dan workflow E2E belum |
| FE-11 | README/env frontend, URL API publik, deployment frontend, smoke incognito | Belum; tunggu URL backend dari BE-10 |
| FE-12 | Siapkan tampilan/alur demo untuk rekaman, screenshot dan dukung reviewer frontend | Belum; hasil diberikan ke Anda untuk submission |

### Task ferren — backend dan pekerjaan lainnya

| ID | Task | Status / hasil yang harus diserahkan |
| --- | --- | --- |
| BE-01 | PRD, roadmap, pembagian task, tracker dan kontrak OpenAPI | Tersedia; review kontrak/frontend dan deadline masih terbuka |
| BE-02 | FastAPI, auth/role, CORS, environment, SQLAlchemy, migration PostGIS dan seed demo | Implementasi/tes tersedia |
| BE-03 | ETL/audit GWT, import VIIRS, provenance, stations/GWT/hotspots API | Implementasi/tes tersedia; database aplikasi diseed dan handoff kontrak siap, adaptasi frontend menunggu teman |
| BE-04 | FIRMS live: client, sync endpoint, cache/dedup, status/waktu sync dan error handling | Implementasi tersedia; uji live Batanghari/SNPP berhasil 11 hotspot; review dan integrasi UI menunggu |
| BE-05 | Decision engine: rules ber-versi, snapshot/as_of, reasons/missing dan priorities API | Belum; branch `feat/backend-firms-priorities` |
| BE-06 | Tasks/reports API, role/ownership, state machine, history dan persistensi | Belum; branch `feat/backend-tasks` |
| BE-07 | Baseline ML, fitur tanpa leakage, split kronologis, training Random Forest dan evaluasi | Belum; branch `feat/backend-ml` |
| BE-08 | Artifact/version, metrics/forecast API dan validasi input historis | Belum; branch `feat/backend-ml` |
| BE-09 | Tes backend/data/FIRMS/rules/workflow/ML, debug integrasi dan dokumentasi server | Data/foundation teruji; QA domain berikutnya belum |
| BE-10 | Hosting backend/database, migration/seed demo, secrets, CORS publik, health dan backup | Belum; tetapkan target dan akses sebelum deploy |
| BE-11 | Koordinasi review/merge, checklist acceptance dan freeze fitur | Foundation merged; data dan milestone berikutnya perlu review |
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

### Urutan kerja paralel

1. Sekarang: teman mengerjakan FE-02 sampai FE-05; Anda menutup review BE-03 lalu BE-04/05.
2. Berikutnya: teman mengerjakan FE-06/07; Anda mengerjakan BE-06. Mock digunakan hingga API siap.
3. ML: teman mengerjakan FE-08; Anda mengerjakan BE-07/08 dan menyerahkan hasil eksperimen nyata.
4. QA: teman menutup FE-09/10; Anda menutup BE-09/11 dan memperbaiki temuan server.
5. Rilis: Anda menyiapkan BE-10; teman menjalankan FE-11. Setelah smoke publik lulus, Anda
   menutup BE-12 dengan dukungan FE-12.

Teman dapat membangun UI memakai mock saat endpoint tahap berikutnya belum tersedia.
Pekerjaan UI dianggap terintegrasi setelah adapter REST dan alur browser yang terkait lulus.

`[x]` berarti implementasi/pekerjaan yang disebut sudah tersedia dengan bukti pada repo.
`[ ]` berarti belum selesai atau belum terverifikasi. Checklist kode tidak otomatis menutup gate
integrasi, review, atau deployment.

## Fitur yang tersedia sekarang

| Fitur | Yang tersedia | Batas saat ini |
| --- | --- | --- |
| Shell aplikasi | Sidebar/drawer, topbar, enam route, mode switcher, toast, shared states | Halaman domain frontend masih placeholder |
| Backend foundation | FastAPI, Pydantic/OpenAPI, health, CORS, identitas dua role demo | Auth memakai bearer token demo; workflow bisnis belum aktif |
| Database | PostgreSQL/PostGIS, tiga migration, sebelas tabel domain/import/sync, indeks geospasial | Database aplikasi lokal siap; deployment menunggu |
| Audit dan ETL GWT | Hash sumber, JSON audit, CSV normalisasi, null/gap/duplikat, import transaksional | Historis; koordinat stasiun null; `wrc` hanya arsip |
| API stasiun/GWT | Daftar stasiun, query UUID/tanggal/mode, provenance, nilai null | Grafik dan adapter frontend belum terintegrasi |
| Import VIIRS historis | Streaming/COPY, waktu UTC, key stabil, dedup, riwayat import, dry-run | Terpisah dari produk/mode NRT |
| FIRMS live | Sync coordinator/CLI, lock/cooldown, cache NRT, status/riwayat; satu uji live berhasil | Target lain dan integrasi UI menunggu |
| API hotspot | Filter tanggal/bbox/satelit/produk/mode, pagination, confidence mentah, FRP | Current Monitoring berisi cache NRT; peta frontend belum diverifikasi |
| Verifikasi backend data | 20 tes lulus termasuk PostGIS, rollback COPY, migration upgrade/downgrade | E2E lintas frontend/backend belum tersedia |

Import nyata pada database tes: delapan stasiun, 3.928 GWT unik, 809.523 hotspot.
Reimport seluruh CSV menambah nol baris. Angka ini bukan klaim database produksi sudah diisi.
Priorities, tasks/reports, dan ML baru memiliki kontrak endpoint dengan respons `501`.

## 0. Persiapan dan pembagian kerja

- [x] Baca PRD produk, arsitektur, data, workflow, dan ML.
- [x] Sepakati kepemilikan: kita backend/data/FIRMS/ML; teman seluruh frontend.
- [x] Buat rencana milestone, branch, prompt handoff frontend, dan tracker.
- [ ] Review kontrak TypeScript/Zod frontend terhadap OpenAPI backend bersama teman.
- [ ] Tetapkan deadline, target hosting, dan kapasitas database demo.

## 1. Foundation aplikasi

- [x] Frontend: setup Next.js/TypeScript/Tailwind, design system dan layout responsif.
- [x] Frontend: routing dashboard, groundwater, hotspots, priorities, tasks, dan eksperimen ML.
- [x] Frontend: konteks mode Historical Replay/Current Monitoring dan komponen loading/error/empty.
- [x] Frontend: lint/typecheck/build shell; hasil historis tercatat di tracker.
- [x] Backend: FastAPI, Pydantic, health, dokumentasi OpenAPI, konfigurasi environment dan CORS.
- [x] Backend: auth identitas coordinator/field_officer, dependency pembatas role, validasi token production.
- [x] Backend: SQLAlchemy, Alembic, Docker Compose PostgreSQL/PostGIS dan seed akun demo.
- [x] Backend: verifikasi migration pada PostGIS nyata.
- [ ] Frontend: repository mock/REST, fixture deterministik, Zod validation, integrasi provider.
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
- [ ] Teman: sesuaikan schema respons/REST adapter dengan handoff backend dan uji payload nyata.

Gate: frontend memakai data historis dari API/database dengan provenance dan missing yang benar.

## 3. Tampilan monitoring — milik teman

- [ ] Dashboard: filter area/periode/mode, statistik nyata, prioritas, aktivitas dan sumber/waktu.
- [ ] Groundwater: pilihan BRG6/BRG3/stasiun lain, grafik, tooltip, statistik valid dan gap/null.
- [ ] Groundwater: Current Monitoring menjelaskan GWT terkini belum tersedia.
- [ ] Hotspots: MapLibre zoom/pan, marker/popup, selection tersinkron dengan daftar.
- [ ] Hotspots: filter periode/area/produk/satelit, pagination, UTC dan detail confidence/FRP.
- [ ] Semua query: loading/empty/error/retry, validasi payload, abort/abaikan respons filter lama.
- [ ] Peta: fallback basemap/WebGL; data sintetis berlabel DEMO.
- [ ] Dashboard: integrasi peta ringkas setelah komponen peta siap.

Gate: pengguna dapat menelusuri GWT dan hotspot historis melalui browser.

## 4. NASA FIRMS live — milik kita

- [x] Client FIRMS server-side dengan key dari environment, timeout dan validasi respons.
- [x] Endpoint sync terautentikasi dan role coordinator; lock/cooldown target dan pembatas respons.
- [x] Dedup/upsert CSV/API per produk identik, cache database, mode terkini dan provenance produk.
- [x] Simpan status/waktu sync; error NASA mempertahankan data cache yang sudah ada.
- [x] Tes client/error/dedup dan uji live Batanghari/SNPP: 11 hotspot tersimpan.
- [ ] Review PR BE-04 dan integrasi frontend; uji tambahan target lain sesuai kebutuhan demo.
- [ ] Teman: tampilkan mode terkini, waktu sync, error/fallback dan label sumber.

Gate: hotspot terkini nyata tampil dengan timestamp/sensor; CSV historis tetap fallback berlabel.

## 5. Decision engine dan prioritas

- [ ] Kita: aturan heuristik terkonfigurasi dan ber-versi untuk prioritas pemeriksaan.
- [ ] Kita: snapshot input, reasons, explanation, missing inputs dan rekomendasi tersimpan.
- [ ] Kita: query Historical Replay berhenti di `as_of`, tanpa future leakage atau campuran mode.
- [ ] Kita: data kurang menghasilkan INSUFFICIENT_DATA; koordinat tak sah tidak dipakai menghitung jarak.
- [ ] Kita: implementasi priorities API dan tes determinisme/missing/as_of.
- [ ] Teman: daftar/detail prioritas, alasan, status heuristik, sumber/waktu dan input kurang.
- [ ] Teman: aksi buat tugas terhubung ke workflow setelah tahap 6 siap.

Gate: assessment dapat ditelusuri dan dapat dipakai memulai tugas pemeriksaan.

## 6. Tugas dan laporan verifikasi

- [ ] Kita: API list/detail/create/update tasks, referensi assessment/hotspot, assignee dan prioritas.
- [ ] Kita: state machine OPEN → ASSIGNED → IN_PROGRESS → SUBMITTED.
- [ ] Kita: review VERIFIED/DISMISSED/NEEDS_FOLLOWUP dan NEEDS_FOLLOWUP → ASSIGNED.
- [ ] Kita: role/ownership server-side, report API, status history/aktor dan database persistence.
- [ ] Kita: laporan demo selalu SIMULASI, validasi form/bukti/waktu dan tes transisi ilegal.
- [ ] Teman: form RHF/Zod, tampilan coordinator/petugas, list/filter/detail dan feedback aksi.
- [ ] Teman: repository localStorage untuk mock, penanganan storage invalid dan REST untuk write nyata.
- [ ] Bersama: uji prioritas → tugas → petugas → laporan → review, termasuk reload/follow-up.

Gate: workflow lengkap tersimpan setelah reload dan tindakan sesuai kewenangan.

## 7. Eksperimen ML GWT +1 hari

- [ ] Kita: baseline persistence BRG6/BRG3 dan fitur lag/rolling yang digeser tanpa leakage.
- [ ] Kita: penanganan gap/missing, split kronologis train/validation/test dan training reproducible.
- [ ] Kita: Random Forest, evaluasi MAE/RMSE cm terhadap baseline pada tanggal test yang sama.
- [ ] Kita: artifact/model version, periode/ukuran test, fitur dan metrik tersimpan.
- [ ] Kita: metrics/forecast API; tolak input tak lengkap dan hindari forecast kondisi live tanpa GWT terkini.
- [ ] Teman: UI eksperimen, actual/predicted, perbandingan baseline, empty state dan batasan.
- [ ] Bersama: model yang tidak mengalahkan baseline tetap ditampilkan sebagai eksperimen.

Gate: hasil training nyata dapat diperiksa; angka simulasi tidak disajikan sebagai metrik model.
CHIRPS merupakan P1 opsional dan tidak menghalangi penyelesaian P0.

## 8. Integrasi dan QA akhir

- [ ] Bersama: tutup integrasi seluruh endpoint dan sinkronisasi filter/mode lintas modul.
- [ ] Kita: tes backend/ETL/FIRMS/rules/auth/workflow/ML dan perbaikan temuan.
- [ ] Teman: lint/typecheck/build final, browser/E2E dan perbaikan UI.
- [ ] Teman: desktop 1440, tablet 768, mobile 375, keyboard/fokus dan fallback peta.
- [ ] Bersama: uji loading/error/empty, input invalid, reload, missing data dan transisi ilegal.
- [ ] Bersama: startup reproducible, README/env.example, seed/demo guide dan review secret/provenance.
- [ ] Bersama: review/merge milestone dan freeze fitur setelah acceptance criteria terpenuhi.

Gate: alur demo lengkap lulus pada aplikasi terintegrasi.

## 9. Deployment dan submission

- [ ] Bersama: tetapkan/konfirmasi target frontend/backend/database dan akses deploy.
- [ ] Kita: konfigurasi database, migration, import demo, environment/secret backend dan health.
- [ ] Teman: konfigurasi URL API frontend, build produksi dan deployment.
- [ ] Bersama: CORS domain publik, pemeriksaan auth, backup dataset dan prosedur pemulihan demo.
- [ ] Bersama: smoke/E2E pada URL publik melalui browser incognito.
- [ ] Bersama: panduan akun/alur demo, video, pitch deck, tautan dan berkas submission.
- [ ] Bersama: tandai proyek selesai setelah seluruh gate P0 dan scope ML yang disepakati terpenuhi.

Gate akhir: demo publik dapat digunakan tanpa intervensi developer, data/sumber/waktu transparan,
dan workflow verifikasi persisten. Deployment dilakukan setelah target dan akses disepakati.

## Urutan pekerjaan berikutnya

1. Review branch data dan selaraskan kontrak dengan teman; frontend integrasikan monitoring.
2. Kita implementasi FIRMS live dan priorities pada `feat/backend-firms-priorities`.
3. Kita implementasi tasks/reports pada `feat/backend-tasks`.
4. Kita implementasi eksperimen ML pada `feat/backend-ml`.
5. Kedua engineer menutup QA/integrasi, lalu deployment dan submission.

Riwayat verifikasi tersedia di [TEAM_PROGRESS.md](TEAM_PROGRESS.md).
Detail acceptance frontend tersedia di [tracker frontend](frontend/docs/progress.md).
