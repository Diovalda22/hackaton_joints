# GambutOps — Timeline dan Pemantauan Progres

Pembaruan terakhir: **14 Oktober 2026**. Scope: **aplikasi lengkap dalam 3 hari**: frontend, backend, database, ETL, NASA FIRMS, decision engine, tugas/laporan, dan eksperimen ML GWT +1 hari.

## 1. Posisi saat ini

**Shell F0 dan backend foundation/data API sudah diimplementasikan; gate integrasi frontend belum selesai. FIRMS live, priorities, tasks/reports, dan ML menunggu tahap berikutnya.**

| Bagian | Status | Bukti / pekerjaan tersisa |
| --- | --- | --- |
| Setup project dan dependency dasar | IMPLEMENTED | Next.js, TypeScript strict, Tailwind, shadcn/ui, Lucide, formulir/grafik; MapLibre belum dipasang |
| Design system dan application shell | IMPLEMENTED | Sidebar, drawer mobile, topbar, tema terang, identitas demo |
| Routing dan mode switcher | IMPLEMENTED | Enam route, redirect root, Historical Replay default, toast dan konteks lintas halaman |
| Shared states dan provenance | IMPLEMENTED | Komponen loading/empty/error/retry, badge, dan sumber/waktu |
| Kontrak data dan mock repository | IMPLEMENTED | `feat/f0-data`: Zod + tipe, mock + REST repository, tes data 27/27; lihat bagian 10 |
| Integrasi provider ke shell | IMPLEMENTED | `feat/f0-data`: RepositoryProvider, cache query per mode, filter periode/area per mode |
| QA F0 | PARTIAL | Lint/typecheck/build lulus; browser dan instalasi bersih belum terverifikasi |
| F1.1–F1.7 | TODO | Seluruh halaman fitur masih berupa penanda fase |
| Backend foundation/data API | IMPLEMENTED | `feat/backend-data`: ETL GWT, importer VIIRS, API read; 20 tes lulus termasuk PostGIS nyata |
| FIRMS live / rules / tasks / ML | TODO | Milik kita; tahap setelah data API |

Code shell tercatat pada `main` lokal dan referensi lokal `origin/main`, commit **`f3177ea`** (`feat(frontend): implement GambutOps F0 shell and routing`). Ini hasil inspeksi Git lokal, bukan pemeriksaan langsung ke GitHub. Branch shell terpisah juga tersedia pada checkout `/tmp/gambutops-f0-shell`.

Route yang tersedia belum berarti fiturnya selesai. Belum ada statistik pemantauan, grafik GWT, peta hotspot, assessment operasional, form tugas/laporan, atau persistensi demo.

## 2. Asumsi timeline

- Tim: dua engineer, masing-masing memakai AI agent dan melakukan review hasilnya.
- Target: **3 hari kerja intensif**, sekitar 8–10 jam fokus per orang per hari. Kita menangani backend/data/FIRMS/ML; teman menangani seluruh frontend. Kontrak API disepakati pada awal H1. Dependency, PostgreSQL/PostGIS, FIRMS, dan browser harus dapat diakses; target bukan jaminan.
- H1 adalah hari pekerjaan dilanjutkan, bukan tanggal kalender tetap. Deadline belum ditentukan.
- Tahap berikutnya dimulai setelah gate sebelumnya terpenuhi dan instruksi lanjut diberikan. Timeline tidak memberikan izin otomatis untuk mengerjakan seluruh fase sekaligus.
- Pengerjaan paralel memakai checkout dan branch berbeda, dengan kepemilikan file yang disepakati.
- QA dan handoff masuk ke H3; tidak ada hari cadangan terpisah. Jika hambatan dependency, kontrak, atau review belum selesai, catat keterlambatan secara eksplisit; jangan menandai fitur selesai atau menghapus acceptance criteria untuk mengejar target.

## 3. Timeline sampai selesai

| Target | Kita / agent kita | Teman / agent teman | Hasil dan gate |
| --- | --- | --- | --- |
| **H1 awal (±2 jam)** | FastAPI, Pydantic/OpenAPI, PostgreSQL/PostGIS, migrations, `/health`, auth/role demo server-side; sepakati kontrak | Tutup fondasi frontend dan mock provider berdasarkan kontrak; dependency dan smoke shell | Kontrak read/write tersedia; kedua agent dapat bekerja tanpa mengedit file yang sama |
| **H1 sisa (±6–8 jam)** | ETL/audit `mmc1.xlsx`, provenance, stations/GWT API; importer CSV VIIRS idempotent dan hotspot API | Dashboard, Groundwater, dan peta/list Hotspots memakai mock lalu REST untuk endpoint yang siap | Stasiun/GWT/hotspot historis tersimpan; filter tanggal/bbox bekerja; UI inti tersedia |
| **H2 awal (±4–5 jam)** | FIRMS sync server-side, UTC/cache/dedup/error handling; rule engine ber-versi dengan snapshot/as_of | Tutup Hotspots dan Priorities; integrasikan endpoint data, filter, sumber/waktu | Sync NASA dapat diuji; assessment deterministik, input kurang transparan, tidak mencampur mode |
| **H2 sisa (±4–5 jam)** | Tasks/reports API, role enforcement, state machine, history, DB persistence; baseline dan persiapan fitur ML | Tasks/forms/role demo; ML UI; ganti write mock dengan REST saat API siap | Alur tugas dasar persisten; baseline ML berjalan tanpa leakage |
| **H3 awal (±4–5 jam)** | Training/evaluasi Random Forest BRG6/BRG3, split kronologis, MAE/RMSE vs baseline, artifact/version, metrics/forecast API | Integrasikan workflow dan hasil eksperimen ML; tutup dashboard/aktivitas dan responsivitas | Hasil eksperimen nyata tampil; forecast historis hanya untuk input valid; laporan SIMULASI |
| **H3 sisa (±4–5 jam)** | Tes ETL/reimport/rules/status/auth/API/DB/ML; perbaikan bug dan dokumentasi backend | Lint/typecheck/build, browser/E2E, perbaikan UI, dokumentasi demo | E2E terintegrasi lulus; startup reproducible; checklist final terpenuhi |

F1.4 mendahului workflow penuh F1.5. Pembuatan tugas dari prioritas dinilai selesai setelah keduanya terintegrasi. Dashboard dapat dibangun lebih dahulu; integrasi akhir peta ringkas menunggu komponen MapLibre F1.3. Publikasi/deployment memerlukan target hosting dan instruksi tersendiri.

### Checkpoint harian

- **Akhir H1:** kontrak disepakati; data historis dan API read tersedia; UI dashboard/GWT/hotspot dasar siap.
- **Akhir H2:** FIRMS, priorities, dan tasks API tersedia; UI memakai REST bertahap; baseline ML berjalan.
- **Akhir H3:** backend/frontend/ML terintegrasi; workflow persisten dan QA lulus. Gate yang belum lulus tetap dicatat sebagai pekerjaan tersisa.

ML ditargetkan benar-benar dilatih dan dievaluasi, bukan hanya empty state. Jika tidak mengalahkan baseline, hasil tetap ditampilkan sebagai eksperimen dan tidak dipakai decision engine. Tanpa GWT terkini, jangan menghasilkan forecast kondisi 2026. FIRMS live harus diuji ketika akses tersedia; CSV historis adalah fallback berlabel, bukan bukti integrasi live berhasil. CHIRPS tetap opsional sesuai PRD.

## 4. Pembagian kepemilikan dan branch

| Pemilik | Kepemilikan |
| --- | --- |
| Kita | `backend/**`: FastAPI, Pydantic, DB/migrations, auth/role, ETL, FIRMS, rules, tasks/reports, ML, tes dan dokumentasi backend |
| Teman | `frontend/**`: seluruh route/UI, types/Zod, mock dan REST adapters, package/lockfile, MapLibre/Recharts, formulir, tes dan dokumentasi frontend |
| Bersama, melalui review | Kontrak API/OpenAPI, startup gabungan, konfigurasi hosting, integrasi dan E2E |

Shell yang sudah tersedia menjadi handoff untuk teman. Pembagian frontend per modul sebelumnya diganti dengan pembagian frontend/backend. Handoff perubahan yang sedang berjalan sebelum berpindah tanggung jawab. Kita tidak mengedit frontend; kebutuhan UI/adapter disampaikan kepada teman. Tracker bersama ini diperbarui bergantian.

| Tahap | Branch kita | Branch teman |
| --- | --- | --- |
| Foundation | `feat/backend-foundation` | `feat/f0-data` |
| Data/read API | `feat/backend-data` | `feat/frontend-monitoring` |
| FIRMS/rules | `feat/backend-firms-priorities` | `feat/frontend-priorities` |
| Tasks/reports | `feat/backend-tasks` | `feat/frontend-tasks` |
| ML | `feat/backend-ml` | `feat/frontend-ml` |
| Integration/QA | `fix/backend-qa` | `fix/frontend-qa` |

- Buat branch baru dari `main` terbaru setelah dependency tahap sebelumnya digabungkan.
- Teman memiliki `package.json` dan lockfile frontend; kita memiliki dependency Python/backend. Kontrak API dipublikasi sejak H1 dan perubahan dibahas sebelum diterapkan.
- PR berukuran kecil, sertakan fitur/perubahan, hasil tes aktual, dan batas yang belum selesai.
- Engineer pasangan meninjau PR. Merge setelah pemeriksaan yang relevan lulus; agent tidak melakukan merge otomatis.
- Tidak push langsung ke `main`, tidak force push, dan tidak menghapus perubahan pihak lain.

## 5. Checklist per milestone

### F0 — Foundation

- [x] Baca PRD dan periksa repository.
- [x] Setup, design system, shell, routing, mode switcher.
- [x] Shared states, dokumentasi setup, dan factory Context repository.
- [x] Lint/typecheck/build shell dijalankan dan lulus.
- [x] Kontrak tujuh entitas dan Zod schema tersedia (`feat/f0-data`); review backend menunggu.
- [x] Fixture historis/terkini serta mock provider tersedia dan terintegrasi.
- [x] Tes filter, referensi, nilai nullable, determinisme, dan as_of lulus (`test:data` 27/27).
- [ ] MapLibre tersedia sebelum F1.3.
- [ ] Instalasi bersih dan smoke browser pada lingkungan normal lulus.
- [ ] Gate F0 diterima sebelum lanjut F1.1.

### F1.1 — Dashboard

- [ ] Area/periode/mode memengaruhi data provider.
- [ ] Ringkasan hotspot, tugas, kelengkapan data, prioritas, aktivitas, dan provenance tampil.
- [ ] Loading/empty/error/retry tersedia untuk query data.
- [ ] Peta ringkasan terintegrasi setelah komponen F1.3 tersedia.

### F1.2 — Groundwater

- [ ] Pilihan stasiun BRG6/BRG3/lainnya, filter tanggal, grafik dan tooltip.
- [ ] Statistik/tren dihitung hanya dari observasi valid; missing tetap gap/null.
- [ ] Satuan meter, nilai negatif, sumber sintetis, dan keterbatasan jelas.
- [ ] Current Monitoring menampilkan GWT terkini tidak tersedia.

### F1.3 — Hotspots

- [ ] MapLibre zoom/pan, marker/popup, serta sinkronisasi selection peta/daftar.
- [ ] Filter tanggal/sensor/area; sumber, waktu, confidence mentah, FRP, dan verifikasi.
- [ ] Label DEMO pada data sintetis; fallback ketika basemap/WebGL gagal.
- [ ] Empty/error state dan keterangan anomali panas, bukan kebakaran terkonfirmasi.

### F1.4 — Priorities

- [ ] Assessment deterministik, tingkat prioritas, alasan, rekomendasi, sumber/waktu.
- [ ] Input snapshot, missing inputs, rule_version, dan status heuristik tersedia.
- [ ] Tidak ada data setelah as_of atau campuran GWT historis dengan hotspot terkini.
- [ ] Aksi buat tugas berfungsi setelah integrasi F1.5.

### F1.5 — Field Verification

- [ ] Daftar/filter/detail tugas dan form pembuatan RHF/Zod.
- [ ] Tampilan koordinator/petugas dan validasi tindakan sesuai role demo.
- [ ] Transisi OPEN → ASSIGNED → IN_PROGRESS → SUBMITTED tervalidasi.
- [ ] Review VERIFIED / DISMISSED / NEEDS_FOLLOWUP dan penugasan ulang follow-up.
- [ ] Laporan SIMULASI, validasi form, riwayat status/aktor, dan toast.
- [ ] Tugas/laporan bertahan setelah reload: localStorage pada mode mock dan database melalui REST pada mode backend.
- [ ] Error storage atau data tersimpan tidak valid ditangani dengan pesan yang jelas.

### F1.6 — ML Experiment UI

- [ ] Tujuan GWT +1 hari, baseline, satuan metrik, serta batasan dijelaskan.
- [ ] Empty state tampil sebelum model dilatih; setelah tersedia, tampilkan hasil eksperimen nyata dari API.
- [ ] Jika ilustrasi grafik/metrik dipakai, seluruhnya berlabel SIMULASI.
- [ ] Model nyata, metrik test, dan baseline dikonsumsi melalui API; tidak ada forecast kondisi terkini tanpa input GWT.

### F1.7 — Integration & QA

- [ ] Navigasi, seluruh filter, grafik, peta, toast, dan aksi penting berfungsi.
- [ ] E2E prioritas → tugas → petugas → laporan → koordinator → review lulus.
- [ ] Reload mempertahankan tugas/laporan tanpa mencampur mode.
- [ ] Loading/empty/error, input invalid, dan transisi ilegal diuji.
- [ ] Desktop 1440px, tablet 768px, mobile 375px, keyboard/fokus diperiksa.
- [ ] Lint, typecheck, production build, dan browser test final lulus.
- [ ] README, `.env.example`, panduan demo, dan catatan integrasi API final tersedia.
- [ ] Tidak ada tombol aktif tanpa fungsi, secret frontend, atau klaim ilmiah tanpa dukungan.

## 6. Riwayat verifikasi

| Tanggal | Pemeriksaan | Hasil | Catatan |
| --- | --- | --- | --- |
| 2026-10-14 | Lint shell | PASS | Tanpa warning |
| 2026-10-14 | Typecheck shell | PASS | TypeScript strict |
| 2026-10-14 | Production build shell | PASS | Webpack; keenam route diprerender |
| 2026-10-14 | `npm ci --dry-run` offline | PASS | Validasi manifest/lockfile; bukan instalasi bersih |
| 2026-10-14 | Inspeksi HTML route | PASS | Bahasa Indonesia, label DEMO/F0 tersedia |
| 2026-10-14 | Browser smoke shell | FAIL — ENVIRONMENT | Chromium gagal diluncurkan: socket sandbox ditolak; belum menguji interaksi |
| 2026-10-14 | `feat/f0-data`: lint, typecheck, build | PASS | Lingkungan lokal teman |
| 2026-10-14 | `feat/f0-data`: `npm run test:data` | PASS | 27/27 |
| 2026-10-14 | `feat/f0-data`: `npm run test:shell` (`next start` port 3100) | PASS | 1/1; screenshot 1440 px & 375 px tanpa error console/hydration |

Hasil ini bersifat historis. Setelah perubahan kode berikutnya, jalankan ulang pemeriksaan yang relevan dan tambahkan hasil baru; jangan menyebut hasil lama sebagai bukti versi terbaru sudah lulus.

## 7. Hambatan dan aksi berikutnya

| Hambatan | Pemilik | Aksi untuk menutup |
| --- | --- | --- |
| Progres frontend teman belum diketahui | Teman | Ambil handoff shell dan laporkan branch/progres aktual |
| Integrasi kontrak/API frontend | Kedua engineer | Review `/openapi.json`; stations/GWT/hotspots siap, respons hotspots memakai pagination envelope |
| Terminal gagal membuat sandbox sementara: `No space left on device` | Kita | Pulihkan kapasitas disk/temp sebelum menjalankan setup dan tes backend |
| Dependency/DB/FIRMS belum terverifikasi | Kita | Periksa akses dan environment sebelum implementasi backend |
| Registry npm tidak dapat diakses dalam sandbox | Teman | Pasang dependency dan uji `npm ci` pada lingkungan normal |
| Chromium/server tidak dapat diuji dalam sandbox | Teman | Jalankan smoke test dan inspeksi visual pada lingkungan normal |
| Deadline belum ditetapkan | Kedua engineer | Isi tanggal H1 dan deadline, lalu sesuaikan estimasi |

**Langkah terdekat:** frontend mengintegrasikan read API; kita melanjutkan FIRMS live dan rule engine setelah review milestone data. Startup/import dan filter endpoint didokumentasikan dalam `backend/README.md`.

## 8. Cara memperbarui tracker

1. Awal sesi: baca tracker dan pilih pekerjaan pada milestone yang sudah diizinkan.
2. Ubah status menjadi IN_PROGRESS dan catat pemilik serta branch/PR.
3. Setelah implementasi: tandai IMPLEMENTED. Tandai DONE hanya setelah acceptance criteria, tes, review, dan integrasi terpenuhi.
4. Tambahkan hasil tes aktual beserta tanggal/commit; tulis NOT_RUN untuk tes yang belum dijalankan.
5. Akhir sesi: perbarui checklist, hambatan, handoff pasangan, dan pekerjaan berikutnya.

Status: TODO = belum dimulai; IN_PROGRESS = dikerjakan; IMPLEMENTED = kode tersedia, belum menutup gate; WAITING = menunggu input pihak lain; BLOCKED = tidak dapat maju tanpa perubahan kondisi; DONE = gate sudah terpenuhi.

| Tanggal | Milestone / status | Pemilik | Branch / commit / PR | Perubahan dan hasil tes | Handoff berikutnya |
| --- | --- | --- | --- | --- | --- |
| 2026-10-14 | F0 shell / IMPLEMENTED | Kita | `main` lokal, `f3177ea` | Shell tersedia; lint/typecheck/build PASS; browser FAIL karena lingkungan | Integrasi provider teman dan QA browser |
| 2026-10-14 | Backend data / IMPLEMENTED | Kita | `feat/backend-data` | Audit GWT/VIIRS nyata; migration PostGIS upgrade/downgrade PASS; Ruff PASS; 20 pytest PASS | Adapter REST tiga endpoint read; FIRMS/rules berikutnya |
| 2026-10-14 | F0 data / IMPLEMENTED | Teman | `feat/f0-data` | Kontrak, mock/REST repository, provider; lint/typecheck/build/test:data/test:shell PASS | `feat/frontend-monitoring` setelah merge |
| — | — | — | — | — | — |

## 9. Definisi aplikasi selesai

Selesai berarti gate frontend dan backend terpenuhi: API/DB nyata digunakan dalam alur terintegrasi, ETL idempotent dan audit tersedia, FIRMS sync teruji, prioritas dapat ditelusuri, tugas/laporan persisten, model GWT dilatih/evaluasi transparan, auth/role server-side bekerja, serta QA dan startup terdokumentasi. Mode mock tetap tersedia sebagai demo frontend tanpa backend; data nyata/sintetis dibedakan melalui provenance dan label.

### Checklist backend / data / FIRMS / ML — milik kita

- [ ] FastAPI/Pydantic, OpenAPI, health, environment, migrations PostgreSQL/PostGIS.
- [ ] Auth akun demo, role write server-side, CORS, secrets hanya server.
- [x] Audit ulang GWT, hash/provenance, null/gap/duplikat, koordinat nullable; reimport tanpa duplikasi.
- [x] Stations/GWT/hotspots API dengan tanggal/bbox; VIIRS CSV import dan UTC/key stabil.
- [ ] FIRMS sync server-side, dedup/cache, waktu sinkronisasi, penanganan API gagal.
- [ ] Rules deterministik/ber-versi, snapshot/reasons/missing inputs, as_of tanpa future leakage; tetap heuristik belum tervalidasi ilmiah.
- [ ] Tasks/reports API, DB persistence, role/status/history, laporan SIMULASI, transisi follow-up.
- [ ] Baseline persistence, lag/rolling digeser, gap ditangani, split kronologis, Random Forest BRG6/BRG3.
- [ ] MAE/RMSE dalam cm, ukuran/periode test, baseline tanggal sama, artifact/model version, metrics/forecast API.
- [ ] Forecast ditolak jika input kurang; hasil eksperimen tanpa klaim prediksi kebakaran atau kondisi live.
- [ ] Tes backend/ETL/rules/workflow/ML dan E2E gabungan lulus; panduan startup/seed/demo lengkap.

Di luar scope: validasi ilmiah baru atas rule engine, prediksi kebakaran nasional, deteksi api bawah tanah, sensor GWT live, rute patroli, chatbot. Deployment mengikuti target hosting yang disepakati; CHIRPS opsional.

Referensi: [README setup](../README.md), [hasil F0 shell](implementation-plan.md), dan [PRD roadmap](../../../prdFiles/prd-roadmap.md).

## 10. Sesi frontend 2026-10-14 — `feat/f0-data`

**Status:** selesai, menunggu review. Belum di-push dan belum di-merge.

**Scope sesi:** kontrak data, mock + REST repository, integrasi provider, penyesuaian UI ke `style.md`.

#### Commit

| Commit | Isi |
| --- | --- |
| `99204b7` | Schema Zod + tipe, state machine tugas, area, periode, label, komposisi dashboard |
| `5b02166` | `createMockRepository()`, `createRestRepository()`, fixture deterministik, localStorage store, tes data, dependency `tsx` |
| `381bece` | RepositoryProvider, cache query per mode, filter periode/area per mode, panel konteks memakai provider |
| `9e664f8` | `style.md`; Sheet `shadow-sm` tanpa blur; tanpa shadow pada segmen aktif; gradasi kartu dihapus; hover kartu `border-primary/25` |
| (commit docs) | README, `.env.example`, `docs/data-contract.md`, plan, tracker |

#### Tes yang benar-benar dijalankan

| Perintah | Hasil |
| --- | --- |
| `npm run lint` | Lulus |
| `npm run typecheck` | Lulus |
| `npm run build` | Lulus |
| `npm run test:data` | 27/27 lulus |
| `npm run test:shell` terhadap `next start` port 3100 | 1/1 lulus |
| Screenshot dashboard 1440 px & 375 px | Tidak ada error console/hydration |

#### Belum dikerjakan / risiko

- Halaman F1 (dashboard, groundwater, hotspots, priorities, tasks, ML) masih placeholder.
- Persistensi tugas melalui UI belum bisa diuji di browser karena UI tugas baru dibangun pada F1.5. Persistensi sudah diuji di level repository.
- Prioritas mock memakai `demo-rules-0.1`, bukan decision engine backend. Bentuk output mengikuti PRD agar bisa diganti dengan REST.
- `GET /api/v1/users` belum ada di rencana API. REST mode membutuhkan endpoint ini untuk pemilihan petugas.
- MapLibre belum dipasang (F1.3).

#### Handoff berikutnya

Branch `feat/frontend-monitoring` dari `main` setelah `feat/f0-data` digabung: dashboard (F1.1), groundwater (F1.2), hotspots + MapLibre (F1.3) memakai `useDashboardSummary`, `useGroundwater`, `useHotspots`.

## 11. Sesi frontend 2026-10-14 — UX pengguna awam + panduan (lanjutan di `feat/f0-data`)

**Status:** selesai, menunggu review. Belum push/merge.

- Modal panduan (Radix Dialog): auto-open sekali per browser, tab dengan navigasi panah/Home/End, fokus kembali ke tombol pembuka, label "Segera tersedia" untuk modul yang belum siap, catatan darurat 112/BPBD.
- Bahasa awam: kode fase (F0/F1/P1) dan judul Inggris dihapus dari UI; mode jadi "Riwayat"/"Terkini"; tagline "Cegah · Deteksi · Tindak".
- Pengatur periode (input tanggal native) + wilayah + "Kembalikan ke awal"; di layar kecil panel ini tampil sebelum kartu placeholder.
- Tes browser diperluas: panduan pertama kali, tidak muncul ulang, fokus kembali, filter per mode, panduan dari drawer, overflow 768/375.

| Perintah | Hasil |
| --- | --- |
| `npm run lint` / `typecheck` / `build` | Lulus |
| `npm run test:data` | 27/27 lulus |
| `npm run test:shell` (production, port 3100) | 1/1 lulus |
| Screenshot 1440/375 (panduan + ringkasan) | Tanpa error/warning console |

Temuan yang diperbaiki saat tes: fokus tidak kembali ke tombol Panduan setelah modal ditutup; peringatan aksesibilitas Radix `aria-describedby`; nama aksesibel link "Uji prediksi" ganda.

Belum: halaman fitur (F1.1–F1.6) masih placeholder — UX inti baru lengkap setelah modul dibangun.
