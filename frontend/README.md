# GambutOps — frontend

**Prevent · Detect · Act.** Fondasi tampilan prototype JOINTS Hackathon 2026. Bahasa antarmuka Indonesia; seluruh identitas demo berlabel simulasi. Sumber kebutuhan: 10 PRD dalam `../prdFiles/`.

## Menjalankan aplikasi

Gunakan Node.js 22.13+ (Node 24 direkomendasikan) dan npm 11.

```bash
cd frontend
npm ci
npm run dev
```

Buka http://localhost:3000. Tidak membutuhkan backend, API key, atau `.env`. Lihat `.env.example` untuk mengaktifkan REST adapter. Jangan menyalin file kredensial workspace ke aplikasi atau `public/`.

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Script dev/build menggunakan Webpack, opsi resmi Next.js. Turbopack membutuhkan port internal pemrosesan CSS yang ditolak sandbox tempat implementasi ini dibuat. Typecheck menjalankan `next typegen` sehingga dapat dijalankan sebelum build. Font sistem digunakan; tidak ada unduhan font saat build.

## Bagian yang selesai

- Application shell responsif: sidebar desktop yang dapat diciutkan, drawer mobile dengan fokus terkelola, topbar, skip link, dan footer.
- Routing `/dashboard`, `/groundwater`, `/hotspots`, `/priorities`, `/tasks`, `/experiments/ml`; root mengarah ke dashboard. Halaman fitur masih penanda fase F1, bukan fitur selesai.
- Mode switcher Historical Replay / Current Monitoring. Filter periode dan area disimpan **terpisah per mode** di `MonitoringProvider`; `as_of` = akhir periode.
- **Lapisan data (F0 data):** schema Zod + tipe, `GambutOpsRepository`, `createMockRepository()` (deterministik, localStorage untuk tugas/laporan), `createRestRepository()` (validasi payload, pemetaan error, guard mode), state machine tugas, dan hook data dengan cache per mode serta pembatalan respons lama. Detail: [docs/data-contract.md](docs/data-contract.md).
- Komponen bersama untuk provenance, DEMO/SIMULASI, loading, empty, error/retry, dan toast.
- Panduan gaya UI: [style.md](style.md) — flat, tanpa shadow berlebih, hover halus.

MapLibre belum dipasang; dipasang sebelum F1.3. Tidak ada peta atau koordinat stasiun buatan.

## Sumber data

Default memakai mock repository (data DEMO sintetis, tidak butuh backend). Untuk memakai backend:

```bash
NEXT_PUBLIC_DATA_SOURCE=rest
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Mode `rest` hanya aktif bila URL terisi. Kebutuhan endpoint untuk backend tercatat di [docs/data-contract.md](docs/data-contract.md#kebutuhan-api-untuk-backend).

Komponen memakai hook dari `src/components/providers/data-hooks.ts` (`useHotspots`, `usePriorities`, `useTasks`, `useRepositoryMutation`, dst.). Jangan mengimpor fixture, `fetch`, atau `localStorage` langsung dari komponen.

## Tes data

```bash
npm run test:data
```

Mencakup schema, state machine, mock repository (mode, as_of, determinisme, persistensi, localStorage rusak, abort), dan REST adapter (payload invalid, pemetaan HTTP, guard mode).

## Pengujian browser

Playwright hanya digunakan sebagai driver smoke test; test runner memakai Node bawaan.

```bash
npx playwright install chromium
npm run build
npm run start
```

Di terminal kedua:

```bash
npm run test:shell
```

Opsional: `SHELL_BASE_URL` mengubah alamat server; `PLAYWRIGHT_EXECUTABLE_PATH` memakai Chromium yang sudah terpasang. Test mencakup redirect, keenam route, navigasi aktif, konteks mode lintas halaman, collapse, drawer/keyboard/fokus, 404, dan overflow pada desktop/tablet/mobile. Server dan browser harus dapat dijalankan pada lingkungan pengujian.

Hasil verifikasi aktual dan batas lingkungan dicatat dalam `docs/implementation-plan.md`. Jangan menganggap tes browser berhasil hanya karena build berhasil.

## Referensi implementasi

- [Instalasi dan tooling Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Instalasi manual shadcn/ui](https://ui.shadcn.com/docs/installation/manual)
- [Sheet berbasis Radix](https://ui.shadcn.com/docs/components/radix/sheet)
- [MapLibre dan integrasi bundler untuk F1.3](https://maplibre.org/maplibre-gl-js/docs/)
