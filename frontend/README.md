# GambutOps — frontend F0

**Prevent · Detect · Act.** Fondasi tampilan prototype JOINTS Hackathon 2026. Bahasa antarmuka Indonesia; seluruh identitas demo berlabel simulasi. Sumber kebutuhan: 10 PRD dalam `../prdFiles/`.

## Menjalankan aplikasi

Gunakan Node.js 22.13+ (Node 24 direkomendasikan) dan npm 11.

```bash
cd frontend
npm ci
npm run dev
```

Buka http://localhost:3000. Tidak membutuhkan backend, API key, atau `.env`. `.env.example` memuat catatan konfigurasi REST masa depan; konfigurasi tersebut belum digunakan pada F0. Jangan menyalin file kredensial workspace ke aplikasi atau `public/`.

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Script dev/build menggunakan Webpack, opsi resmi Next.js. Turbopack membutuhkan port internal pemrosesan CSS yang ditolak sandbox tempat implementasi ini dibuat. Typecheck menjalankan `next typegen` sehingga dapat dijalankan sebelum build. Font sistem digunakan; tidak ada unduhan font saat build.

## Bagian yang selesai

- Application shell responsif: sidebar desktop yang dapat diciutkan, drawer mobile dengan fokus terkelola, topbar, skip link, dan footer.
- Routing `/dashboard`, `/groundwater`, `/hotspots`, `/priorities`, `/tasks`, `/experiments/ml`; root mengarah ke dashboard. Halaman fitur merupakan penanda fase, bukan fitur F1 yang sudah selesai.
- Historical Replay sebagai mode awal. Context mode bertahan selama navigasi client; reload memulai Historical Replay kembali. Tidak ada data historis yang ditampilkan sebagai kondisi terkini.
- Mode switcher memperbarui badge/keterangan dan memunculkan toast. Current Monitoring menampilkan “Data muka air terkini tidak tersedia”.
- Komponen bersama untuk provenance, DEMO/SIMULASI, loading, empty, error/retry, dan toast.
- TypeScript strict, ESLint, Tailwind 4, komponen shadcn/ui berbasis Radix, dan dependency formulir/grafik untuk tahap berikutnya.

MapLibre belum dipasang: tidak digunakan pada F0 dan paket tidak tersedia di cache lokal saat registry tidak dapat diakses. Instalasi MapLibre serta CSS/worker client dilakukan sebelum F1.3. Tidak ada peta atau koordinat stasiun buatan pada F0.

## Pembagian kepemilikan

Branch kita: `feat/f0-shell`. Branch teman: `feat/f0-data`.

| Bagian kita | Bagian teman |
| --- | --- |
| Konfigurasi, package.json/lockfile | `src/types/` |
| `src/app/`, `src/components/` | `src/lib/schemas/`, `src/lib/mock/`, `src/lib/api/` |
| Tes shell dan dokumentasi tampilan | Tes data dan dokumentasi kontrak |

Tidak ada duplicate fixture atau kontrak entitas dalam branch shell. F0 lengkap memerlukan penggabungan branch data. Mutasi/persistensi tugas dan laporan tetap menunggu F1.5.

## Integrasi provider berikutnya

`src/components/providers/repository-context.tsx` menyediakan factory Context generic. Setelah branch data digabungkan, buat binding **sekali di module scope**:

```tsx
"use client";

import type { GambutOpsRepository } from "@/lib/api";
import { createRepositoryContext } from "@/components/providers/repository-context";

export const { RepositoryProvider, useRepository } =
  createRepositoryContext<GambutOpsRepository>();
```

Di AppProviders, buat instance `createMockRepository` secara stabil melalui lazy `useState`, lalu bungkus aplikasi dengan `RepositoryProvider`. Hook fitur memakai `useRepository()` dan `useMonitoring()`; perubahan mode harus membatalkan/mengabaikan respons request lama sebelum menampilkan hasil baru. Komponen tidak membaca fixture atau localStorage langsung.

Nilai mode UI mengikuti kontrak yang disepakati: `HISTORICAL_REPLAY` dan `CURRENT_MONITORING`. `DemoMode` merupakan tipe konteks tampilan sementara; gunakan tipe mode bersama dari branch data ketika tersedia. Jangan membuat schema entitas kedua.

Belum ada REST adapter. Backend berikutnya membutuhkan endpoint API v1 PRD, validasi payload, autentikasi/otorisasi server, provenance data nyata, sinkronisasi FIRMS server-side, serta persistensi. Factory Context menerima mock atau REST repository dengan interface yang sama.

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
