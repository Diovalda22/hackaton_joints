---
name: GambutOps
description: Panduan gaya UI dashboard GambutOps — sederhana, flat, mudah dibaca.
colors:
  primary: "#18543b"
  ring: "#227b54"
  teal: "#117a77"
  foreground: "#24352d"
  muted-foreground: "#617067"
  background: "#f5f7f5"
  card: "#ffffff"
  sidebar: "#f8faf8"
  secondary: "#e6f1eb"
  muted: "#f0f3f0"
  border: "#dce4de"
  destructive: "#b42332"
font: "Arial, Helvetica, sans-serif"
rounded:
  md: "8px"   # tombol, badge
  lg: "12px"  # item navigasi, blok kecil
  xl: "16px"  # kartu, panel
shadow:
  default: "none"
  max: "shadow-sm"  # hanya Sheet/Dialog/Toast
motion: "transition-colors duration-150"
---

# GambutOps Style Guide

Prinsip: **flat, tenang, mudah dibaca.** Pisahkan elemen dengan border tipis dan beda warna latar, bukan dengan shadow atau efek.

## 1. Warna

Token ada di [globals.css](src/app/globals.css). Pakai kelas Tailwind (`bg-primary`, `text-muted-foreground`, `border-border`), jangan hex langsung.

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `primary` | `#18543b` | Tombol utama, navigasi aktif, ikon penting |
| `teal` | `#117a77` | Eyebrow judul, ikon modul |
| `secondary` | `#e6f1eb` | Latar item aktif, chip ikon |
| `foreground` | `#24352d` | Teks utama |
| `muted-foreground` | `#617067` | Teks sekunder, metadata |
| `background` | `#f5f7f5` | Latar halaman |
| `card` | `#ffffff` | Kartu, header |
| `muted` | `#f0f3f0` | Blok sekunder, hover |
| `border` | `#dce4de` | Semua garis tepi |
| `destructive` | `#b42332` | Error |

- Status DEMO/peringatan: `amber-50` / `amber-200` / `amber-900`.
- Amber dan merah **hanya untuk status**, bukan dekorasi.
- Warna solid saja. **Tidak pakai gradasi.**

## 2. Tipografi

Satu font: Arial. Hierarki dari ukuran dan ketebalan.

| Level | Kelas |
| --- | --- |
| Judul halaman | `text-2xl sm:text-3xl font-bold tracking-tight` |
| Judul kartu/seksi | `text-base font-semibold` |
| Body | `text-sm leading-6` |
| Caption | `text-xs leading-5 text-muted-foreground` |
| Eyebrow | `text-[10px] font-semibold tracking-[0.16em] uppercase` |
| Badge | `text-[11px] font-semibold` |

## 3. Shadow

- Default: **tidak ada shadow** — kartu, tombol, panel, header, sidebar.
- Maksimal `shadow-sm`, hanya untuk elemen yang melayang: Sheet, Dialog, Toast.
- Dilarang: `shadow-md` ke atas, glow, drop-shadow berwarna.

## 4. Hover

Hover hanya mengubah warna, sedikit saja.

| Elemen | Hover |
| --- | --- |
| Tombol primary | `hover:bg-primary/90` |
| Tombol outline/ghost | `hover:bg-muted` |
| Navigasi | `hover:bg-muted hover:text-foreground` |
| Kartu yang bisa diklik | `hover:border-primary/25` |
| Link teks | `hover:underline` |

- Selalu `transition-colors duration-150`.
- Dilarang: `translate`, `scale`, tambah shadow saat hover, `transition-all`.
- Focus ring wajib: `focus-visible:ring-2 focus-visible:ring-ring`.

## 5. Komponen

- **Tombol** ([button.tsx](src/components/ui/button.tsx)): `rounded-md`, tinggi 40px (sm 36px, lg 44px).
- **Kartu** ([card.tsx](src/components/ui/card.tsx)): `rounded-xl border bg-card`, padding `p-5`–`p-6`.
- **Badge** ([badge.tsx](src/components/ui/badge.tsx)): `rounded-md border px-2 py-0.5`, teks kapital pendek.
- **Navigasi** ([sidebar.tsx](src/components/layout/sidebar.tsx)): `min-h-11 rounded-lg`; aktif `bg-secondary text-primary`.
- **Sheet** ([sheet.tsx](src/components/ui/sheet.tsx)): overlay `bg-slate-950/40` tanpa blur, konten `shadow-sm`.
- **Loading/Empty/Error** ([async-states.tsx](src/components/shared/async-states.tsx)): pakai shell kartu yang sama.

## 6. Layout

- Sidebar `w-64` (ringkas `w-20`), header `min-h-20 border-b bg-card`.
- Padding halaman `px-4 md:px-8`, `py-7 md:py-9`.
- Lebar konten `max-w-[1280px] mx-auto`.
- Jarak antar seksi `space-y-7`, grid kartu `gap-3`–`gap-5`.

## 7. Jangan

- Shadow tebal, glow, efek kaca (blur).
- Gradasi warna.
- Hover yang menggerakkan atau membesarkan elemen.
- Border lebih dari 1px (kecuali focus ring).
- Sudut siku 90° pada tombol, kartu, input.
