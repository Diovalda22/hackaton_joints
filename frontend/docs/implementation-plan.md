# F0 — bagian shell

## Checklist

- [x] Baca seluruh 10 PRD dalam `prdFiles/`.
- [x] Setup Next.js App Router 16, React 19, TypeScript strict, npm lockfile, Tailwind 4, ESLint.
- [x] Konfigurasi shadcn/ui berbasis Radix, theme tokens terang, Lucide, dan Sonner.
- [x] Shell desktop/mobile, navigasi aktif, collapse, drawer, identitas demo.
- [x] Keenam route dan redirect root; isi modul jelas berstatus tahap berikutnya.
- [x] Mode Context default historis dan keterangan Current Monitoring.
- [x] Shared loading/empty/error/retry, provenance, badge demo/simulasi.
- [x] Titik integrasi repository generic tanpa kontrak tandingan.
- [x] README, `.env.example`, dan smoke test browser.
- [ ] Gabungkan kontrak dan provider dari `feat/f0-data`, kemudian hubungkan ke AppProviders.
- [ ] Pasang MapLibre saat paket tersedia, sebelum F1.3.
- [ ] Verifikasi browser pada lingkungan yang mengizinkan server dan Chromium.

## Keputusan PRD

1. Backend/database/API health pada PRD roadmap ditunda karena instruksi fase ini frontend-only. Tidak ada ETL, pembacaan dataset asli, atau panggilan NASA.
2. Folder sumber sebenarnya `prdFiles/`, bukan `gambutops-prd/`.
3. UI tidak menampilkan angka observasi, assessment, metrik ML, atau waktu sinkronisasi tanpa provider. Semua halaman selain shell tetap penanda F1.
4. Mode historis dan terkini merupakan konteks berbeda. GWT 2018–2019 tidak menggambarkan 2026.
5. Koordinat stasiun tanpa sumber tetap null di kontrak milik teman; shell tidak membuat pin stasiun.
6. Hotspot disebut anomali panas, confidence bukan probabilitas kebakaran, dan prioritas merupakan heuristik belum tervalidasi.
7. Workflow kontrak teman mencakup `NEEDS_FOLLOWUP → ASSIGNED` dari PRD. Implementasi transisi dan localStorage menunggu F1.5.

## Batas kepemilikan dan Git

Shell hanya mengubah konfigurasi frontend, `src/app`, `src/components`, tes shell, dan dokumentasi ini. Folder `src/types`, `src/lib`, serta tes data tidak dibuat atau diubah.

Metadata `.git` workspace bersifat read-only dalam sandbox. `feat/f0-shell` dibuat pada checkout `/tmp/gambutops-f0-shell`; source frontend juga tersedia di workspace asli untuk review. Tidak melakukan merge, push, atau mengubah branch `main` workspace. Git bundle disiapkan untuk memindahkan branch ke checkout normal.

## Verifikasi aktual

Pemeriksaan pada 14 Oktober 2026, Node.js 24.16.0 / npm 11.18.0:

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run lint` | Lulus, exit 0, tanpa warning |
| `npm run typecheck` | Lulus, exit 0 |
| `npm run build` (Webpack) | Lulus, exit 0; keenam route berhasil diprerender |
| `npm ci --dry-run --offline --ignore-scripts --no-audit --no-fund` | Lulus, exit 0; konsistensi manifest/lockfile tervalidasi, bukan instalasi bersih |
| Inspeksi HTML production keenam route | Lulus; HTML tersedia, bahasa Indonesia, label DEMO/F0 |
| `npm run test:shell` dengan executable Brave/Chromium terpasang | Gagal, exit 1 sebelum interaksi; sandbox menolak socket Chromium (`setsockopt: Operation not permitted`, SIGTRAP) |

Build pertama dengan Turbopack gagal karena sandbox menolak bind port internal CSS. Script dev/build memakai Webpack; build final berhasil. Instalasi menggunakan cache npm dan paket lokal dengan versi yang dipin; instalasi bersih melalui registry belum diuji karena DNS registry menghasilkan ENOTFOUND.

Smoke test browser belum lulus. Responsivitas visual, interaksi, fokus drawer, dan navigasi client masih harus diperiksa melalui browser pada checkout normal. Tidak ada browser terkoneksi yang tersedia melalui tool UI pada sesi ini.

## Tahap selanjutnya — belum dikerjakan

- [ ] F1.1 Dashboard: statistik provider, filter area/periode, peta ringkasan, aktivitas.
- [ ] F1.2 Groundwater: stasiun, grafik interaktif, gap/missing, statistik/tren.
- [ ] F1.3 Hotspots: MapLibre, popup, selection dan sinkronisasi daftar, filter.
- [ ] F1.4 Priorities: assessment, alasan, snapshot, rekomendasi, pembuatan tugas.
- [ ] F1.5 Tasks: role demo, form, state machine, laporan, riwayat, persistensi.
- [ ] F1.6 ML: presentasi eksperimen tanpa hasil atau metrik ilmiah rekaan.
- [ ] F1.7 Integration & QA seluruh workflow.

Backend berikutnya menangani REST, auth/role enforcement, database, sumber data nyata, FIRMS server-side, dan hasil ML tervalidasi. Tidak ada kunci API pada frontend.
