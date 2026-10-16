# PeatSignal

**Prevent, Detection, Action** — prototipe pendukung pencegahan kebakaran gambut melalui pengukuran muka air tanah, titik panas satelit, rekomendasi yang dapat dijelaskan, dan koordinasi pemeriksaan lapangan.

Submission JOINTS Hackathon 2026. README ini merupakan panduan utama menjalankan dan menilai aplikasi dari komputer lokal.

**Anggota:** Ferren Diovalda · A. Farkhan Dwi Kusuma · Achmad Kamal · Nicholas Devin Daniardi.

[Instalasi](#instalasi-lengkap-rest) · [Menjalankan](#menjalankan-aplikasi) · [Demo juri](#alur-demo-juri-10-menit) · [API](#kontrak-api) · [Model dan batasan](#groundwater-forecasting-dan-batasan) · [Troubleshooting](#troubleshooting)

## Apa yang dapat dinilai

| Fitur | Perilaku yang tersedia | Halaman |
| --- | --- | --- |
| Ringkasan | Indikator pemantauan, prioritas, kegiatan, dan peta hotspot sesuai mode/filter | `/dashboard` |
| Muka air tanah / GWT | Grafik pengukuran stasiun, kualitas data, dan tanggal yang tidak tersedia | `/groundwater` |
| Hotspot | Peta seluruh marker, daftar berhalaman, filter satelit, detail dan status verifikasi | `/hotspots` |
| Prioritas wilayah | Aturan berbasis bukti hotspot, tren GWT dan laporan; menyertakan alasan, snapshot, data kurang | `/priorities` |
| Groundwater Forecasting | Input 7 hari GWT manual/demo, kandidat ML dan baseline +1 hari, hujan otomatis, rekomendasi pencegahan, ekspor JSON | `/experiments/ml` |
| Tugas dan laporan | Koordinator menugaskan petugas; petugas mengirim laporan; koordinator meninjau; riwayat perubahan tersimpan | `/tasks` |
| Landing dan panduan | Penjelasan alur, fitur forecasting, prinsip data, FAQ, panduan aplikasi | `/` |

**Cara penilaian yang disarankan:** gunakan mode **REST**, database lokal, dan dataset yang disertakan. Mode **mock** tersedia untuk pratinjau antarmuka, tetapi tidak menjalankan model/backend atau mengambil hujan nyata.

## Requirement dan arsitektur

### Kebutuhan sistem

| Komponen | Kebutuhan |
| --- | --- |
| Python | **3.12+**, modul `venv`, dan pip |
| Node.js | **22.13+**, disarankan 24, beserta npm |
| Database | PostgreSQL + PostGIS; Compose menyediakan PostgreSQL 16 / PostGIS 3.5 |
| Container | Docker Engine/Desktop dan Docker Compose v2 untuk database lokal |
| Browser | Browser modern; WebGL untuk peta interaktif |
| Koneksi internet | Instalasi dependency/image Docker, peta dasar, hujan eksternal, dan NASA FIRMS bila diaktifkan |
| Terminal | Bash Linux/macOS/WSL2; jalankan backend dan frontend pada dua terminal |

Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, MapLibre, Recharts. Backend: FastAPI, Pydantic, SQLAlchemy, Alembic. ML: scikit-learn Random Forest dan joblib.

```mermaid
flowchart LR
    J[Browser juri / petugas] --> F[Next.js frontend]
    F -->|REST /api/v1| B[FastAPI]
    B --> D[(PostgreSQL + PostGIS)]
    B --> M[Artifact Random Forest + baseline]
    B --> W[Open-Meteo / ClimateSERV CHIRPS]
    B --> N[NASA FIRMS opsional]
```

### Requirement fungsional yang diimplementasikan

- Pisahkan data **Riwayat** (`HISTORICAL_REPLAY`) dan **Terkini** (`CURRENT_MONITORING`).
- Tampilkan sumber, periode, kualitas, status simulasi, dan kekurangan data.
- Nilai kosong tetap kosong; tidak diubah menjadi pengukuran nol atau kondisi aman.
- Model dibandingkan dengan baseline menggunakan MAE/RMSE historis.
- Rekomendasi menyebut alasan dan tindakan pemeriksaan, bukan probabilitas kebakaran.
- Perubahan tugas/laporan diperiksa berdasarkan role dan transisi status; tercatat dalam history.
- UI responsif; animasi mendukung preferensi pengurangan gerakan.

## Instalasi lengkap (REST)

### 1. Ambil repository

```bash
git clone https://github.com/Diovalda22/hackaton_joints.git
cd hackaton_joints
```

Jika sudah memperoleh ZIP submission, ekstrak dan buka terminal pada folder yang berisi `backend/`, `frontend/`, dan `dataset/`. Gunakan revisi submission yang diserahkan tim.

Dataset yang disertakan:

- `dataset/mmc1.xlsx`: pengukuran GWT historis, sumber training BRG3/BRG6.
- `dataset/viirs-snpp_2019_Indonesia.csv`: hotspot historis untuk demo.
- CSV VIIRS 2018 lain tersedia untuk eksplorasi tambahan.

### 2. Instal backend

Dari root repository:

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[dev]'
[ -f .env ] || cp .env.example .env
```

Template default sudah sesuai database Compose lokal. Untuk konfigurasi submission lokal, pastikan `backend/.env` berisi:

```dotenv
GAMBUTOPS_APP_ENV=development
GAMBUTOPS_DATABASE_URL=postgresql+psycopg://gambutops:gambutops@127.0.0.1:5433/gambutops
GAMBUTOPS_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
GAMBUTOPS_COORDINATOR_TOKEN=
GAMBUTOPS_FIELD_OFFICER_TOKEN=
GAMBUTOPS_FIRMS_MAP_KEY=
GAMBUTOPS_ML_ARTIFACT_DIR=var/ml
```

Nama konfigurasi `GAMBUTOPS_*`, nama package, serta kunci penyimpanan lama dipertahankan untuk kompatibilitas; nama produk di aplikasi adalah **PeatSignal**. Jangan menimpa `.env` yang sudah memiliki konfigurasi yang diperlukan.

### 3. Jalankan database dan migration

Masih dari `backend/`:

```bash
docker compose up -d postgres
docker compose ps
```

Tunggu status database `healthy`, kemudian:

```bash
.venv/bin/alembic upgrade head
.venv/bin/alembic current
```

Database menggunakan port host **5433**, bukan 5432. Migration membuat schema dan pengguna demo; data pengukuran/hotspot diisi pada langkah berikut. Database PostgreSQL/PostGIS eksternal juga dapat digunakan dengan mengganti URL koneksi; Compose dapat dilewati.

### 4. Import data dan training model

Masih dari `backend/`:

```bash
.venv/bin/python -m app.cli import-gwt ../dataset/mmc1.xlsx --apply

.venv/bin/python -m app.cli import-hotspots ../dataset/viirs-snpp_2019_Indonesia.csv \
  --from 2019-08-01 --to 2019-09-15 --bbox '100,-4,112,2' --apply

.venv/bin/python -m app.cli train-gwt ../dataset/mmc1.xlsx
```

Import sumber yang sama bersifat idempotent. Untuk audit sebelum menulis database, jalankan perintah import tanpa `--apply`. Training menghasilkan metrics JSON dan artifact `.joblib` di **`backend/var/ml/`**. Direktori ini diabaikan Git, sehingga **training perlu dijalankan pada komputer juri** walaupun database yang digunakan sudah berisi data.

Training memakai dataset lokal; tidak memerlukan key layanan ML. Jangan memuat artifact joblib dari sumber tidak tepercaya.

### 5. Instal frontend

Buka terminal kedua dari root repository:

```bash
cd frontend
npm ci
[ -f .env.local ] || cp .env.example .env.local
```

Aktifkan empat variabel berikut dalam `frontend/.env.local` (template mengomentarinya secara default):

```dotenv
NEXT_PUBLIC_DATA_SOURCE=rest
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEMO_COORDINATOR_TOKEN=demo-coordinator-token
NEXT_PUBLIC_DEMO_FIELD_OFFICER_TOKEN=demo-field-officer-token
```

Token tersebut sesuai default backend development saat kedua token `.env` backend kosong. Jika diganti, sesuaikan peran di kedua sisi. Token ini khusus demo dan terlihat di browser; jangan masukkan password database atau NASA key ke `NEXT_PUBLIC_*`.

## Menjalankan aplikasi

**Terminal 1 — dari root:**

```bash
cd backend
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — dari root:**

```bash
cd frontend
npm run dev
```

| Alamat | Kegunaan |
| --- | --- |
| http://localhost:3000 | Landing page PeatSignal |
| http://localhost:3000/login | Pilih akun demo dan masuk |
| http://localhost:8000/health | Liveness API |
| http://localhost:8000/docs | Swagger UI: schema lengkap dan **Try it out** |
| http://localhost:8000/openapi.json | Kontrak OpenAPI yang dihasilkan dari kode |
| http://localhost:8000/api/v1/stations | Memastikan DB dan data stasiun terbaca |
| http://localhost:8000/api/v1/ml/metrics | Memastikan artifact ML tersedia |

`/health` merespons `status`, `service`, `version`, dan `environment`; endpoint ini tidak menguji koneksi database. Gunakan `/stations` untuk mengecek database/import.

### Akun penilaian

Tidak ada registrasi atau password pengguna. Pilih akun di halaman login. Klik **Keluar** untuk berpindah peran.

| Akun | Role | Yang dinilai |
| --- | --- | --- |
| Koordinator Demo | `coordinator` | Membuat/menugaskan tugas, meninjau laporan, sinkron FIRMS |
| Petugas Lapangan Demo | `field_officer` | Memulai tugas yang ditugaskan kepadanya dan mengirim laporan |

Ini autentikasi role demo berbasis Bearer token, bukan sistem akun produksi. Dalam mode REST, tugas/laporan tersimpan di PostgreSQL dan tetap ada setelah refresh. Input uji forecasting tidak disimpan sebagai observasi atau assessment wilayah.

### Menjalankan lagi

Setelah setup pertama, cukup hidupkan database (`docker compose up -d postgres` dari `backend/`) dan kedua server di atas. Migration/import/training tidak perlu diulang kecuali schema, dataset, dependency, atau artifact berubah.

Hentikan server dengan **Ctrl+C**. Untuk menghentikan database tanpa menghapus data:

```bash
cd backend
docker compose stop postgres
```

### Build produksi lokal

Dengan `.env.local` sudah benar, dari `frontend/`:

```bash
npm run build
npm run start
```

Backend tetap dijalankan secara terpisah. Nilai `NEXT_PUBLIC_*` dimasukkan saat build; ubah konfigurasi lalu build ulang bila alamat API/token berubah. Mode dev perlu direstart setelah perubahan `.env.local`. Untuk deployment lintas komputer, URL API harus dapat diakses browser pengunjung dan origin frontend perlu diizinkan di CORS backend.

### Pratinjau frontend saja

Atur `NEXT_PUBLIC_DATA_SOURCE=mock` di `.env.local` dan jalankan/restart frontend. Tidak perlu backend/database; data berlabel DEMO dan tugas/laporan disimpan di browser. ML serta hujan nyata tidak dibuat-buat. Kembalikan ke `rest` untuk penilaian integrasi lengkap.

## Alur demo juri (±10 menit)

1. **Landing → Masuk:** lihat identitas PeatSignal, penjelasan Forecasting, lalu pilih Koordinator Demo.
2. **Riwayat:** gunakan periode awal **17 Agustus–15 September 2019**. Buka Muka air tanah, pilih BRG6/BRG3; tunjukkan grafik dan tanggal kosong.
3. **Hotspot:** pilih titik di peta, baca satelit/waktu/status. Dashboard dan peta Hotspot memuat sumber marker yang sama jika mode, tanggal, wilayah dan satelit sama.
4. **Prioritas:** baca alasan prioritas, snapshot sumber, dan data yang belum tersedia; buat tugas dari assessment atau hotspot yang ada.
5. **Workflow:** pilih Petugas Lapangan Demo sebagai assignee. Keluar, masuk sebagai petugas; mulai tugas dan kirim laporan berlabel SIMULASI. Kembali sebagai koordinator, tinjau laporan dan lihat history.
6. **GWT Forecasting:** buka `/experiments/ml` → **Contoh kering** → **Hitung prediksi & rekomendasi**. Tunjukkan GWT, baseline/kandidat ML, alasan dan tindakan. Bandingkan **Contoh pulih** serta **Tanpa data hujan**. Unduh JSON sebagai bukti input/hasil.
7. **Hujan terkini:** pada sumber hujan pilih **Otomatis · cuaca terkini**. Tunjukkan provider dan status kelengkapan. Untuk agregasi tujuh hari yang sudah selesai, pilih tanggal akhir **kemarin**; perubahan tanggal mengosongkan input GWT, sehingga perlu diisi lagi. Jangan mengklaim angka demo sebagai pengukuran lapangan.
8. **Evaluasi ML:** buka bagian **Evaluasi model historis**; tunjukkan MAE/RMSE serta baseline. Hasil yang lebih sederhana tetap dipilih bila model belum lebih baik.
9. **Terkini (opsional):** buka Hotspot dalam mode Terkini. Bila key FIRMS tersedia, sinkron data. Tanpa key, penilaian historis dan forecasting manual tetap dapat dijalankan.

Data live bergantung jaringan dan publikasi provider. Demo utama dengan data historis dan skenario manual tidak memerlukan key NASA atau akun Earth Engine.

## Sumber data dan wilayah

| Sumber | Kegunaan | Ketersediaan / makna |
| --- | --- | --- |
| BRG `mmc1.xlsx` | Pengamatan historis dan training model | 2018–2019; bukan sensor GWT terkini |
| CSV VIIRS dalam `dataset/` | Replay hotspot historis | Anomali panas, perlu verifikasi lapangan |
| NASA FIRMS NRT | Sinkron hotspot terkini | Opsional, memerlukan key backend |
| Open-Meteo | Hujan otomatis untuk tanggal akhir dalam 14 hari terakhir | Estimasi model cuaca pada titik acuan |
| CHIRPS via ClimateSERV | Hujan historis / pilihan CHIRPS eksplisit | Rata-rata kotak wilayah DEMO; dapat tertunda/belum terbit |
| Input manual / skenario | Uji GWT tujuh hari dan rekomendasi | Manual belum diverifikasi; contoh selalu SIMULASI |

**Forecasting BRG3/BRG6 memakai konteks DEMO Batanghari, Jambi.** Open-Meteo memakai titik acuan **1,75° LS, 103,45° BT**, bukan koordinat persis stasiun. CHIRPS memakai bbox DEMO Batanghari `[102.9, -2.2, 104.0, -1.3]` (barat, selatan, timur, utara). Koordinat resmi stasiun belum tersedia. Filter wilayah pemantauan tidak mengubah lokasi uji forecasting. Halaman pemantauan juga menyediakan konteks Kubu Raya; kotak wilayah merupakan perkiraan, bukan batas administratif resmi.

Pada data hujan, **`0` berarti estimasi/pengukuran nol**; **`null` berarti belum tersedia**. Hari ini dari Open-Meteo berjenis `FORECAST`: ditampilkan, tetapi dikecualikan dari agregasi rekomendasi. Total tujuh hari dan dry spell hanya dihitung jika semua tujuh nilai memenuhi syarat.

## Groundwater Forecasting dan batasan

- Model Random Forest per stasiun mempelajari perubahan GWT satu hari dari lag dan statistik tujuh hari sebelumnya. Split kronologis: 70% train, 15% validation, 15% test; tidak mengisi gap observasi.
- Baseline persistence menganggap GWT besok sama dengan pengukuran terakhir. Model dipilih dalam uji input lapangan hanya jika **MAE dan RMSE historis keduanya lebih baik** daripada baseline.
- Hasil referensi dataset lokal (dapat direproduksi dengan `train-gwt`; lihat metrics artifact untuk hasil aktual):

| Stasiun | Hari test | ML MAE / RMSE (cm) | Baseline MAE / RMSE (cm) |
| --- | ---: | ---: | ---: |
| BRG6 | 81 | 2,843 / 4,191 | 1,705 / 3,094 |
| BRG3 | 75 | 2,444 / 3,832 | 1,339 / 3,329 |

Kedua model referensi **belum mengalahkan baseline**. MAE/RMSE adalah ukuran galat historis, bukan persentase akurasi kondisi hari ini. Evaluasi historis berstatus `EXPERIMENT_ONLY`; prediksi dengan input baru tetap eksperimental, belum divalidasi untuk periode terkini atau wilayah lain. Tanpa artifact, uji lapangan tetap memberikan baseline dan rekomendasi; bukan hasil ML palsu.

Input lapangan terakhir lebih dari dua hari lalu menjadi `STALE`, prediksi terkini tidak tersedia, dan rekomendasi menjadi `INSUFFICIENT_DATA`. GWT dalam UI input memakai **cm**, API memakai **meter**: `-40 cm = -0.40 m`, yaitu air berada di bawah permukaan tanah.

### Dua jenis penilaian

1. **Prioritas wilayah (`GET /priorities`):** menilai bukti DB menurut mode/cutoff, menyimpan snapshot, dan dapat menjadi referensi tugas.
2. **Rekomendasi input lapangan (`POST /prevention/assess`):** menilai tujuh GWT yang diberikan, memakai hujan bila lengkap, tidak menyimpan observasi atau membuat tugas otomatis.

Aturan lapangan `field-prevention-1.0`: GWT ≤ −0,40 m merupakan indikator muka air rendah; penurunan ≥5 cm selama tujuh tanggal merupakan indikator penurunan; hujan <10 mm/7 hari lengkap merupakan indikator hujan minim. Prioritas HIGH bila muka air rendah disertai penurunan atau hujan minim; MEDIUM bila ada salah satu indikator. Ambang ini konfigurasi prototipe, bukan model probabilitas kebakaran. **Prediksi ML tidak menaikkan prioritas**. Hujan belum menjadi fitur training model GWT saat ini.

## Kontrak API

Base URL lokal: **`http://localhost:8000/api/v1`**. JSON memakai `snake_case`, UUID berupa string, tanggal `YYYY-MM-DD`, timestamp berzona waktu. Contoh `bbox=west,south,east,north`. `/health`, `/docs`, dan `/openapi.json` berada di root origin.

Schema request/response lengkap dan nilai enum: **[Swagger lokal](http://localhost:8000/docs)** / **[OpenAPI lokal](http://localhost:8000/openapi.json)**. Contoh payload, validasi, peran dan error: **[panduan kontrak API](backend/docs/api-contract.md)**.

| Method | Path relatif `/api/v1` | Input utama / hasil | Akses demo |
| --- | --- | --- | --- |
| GET | `/auth/me` | Identitas dari Bearer token | Token role |
| GET | `/users` | Opsional `role`; daftar akun | Publik |
| GET | `/stations` | Stasiun, provenance dan kualitas | Publik |
| GET | `/stations/{id}/groundwater` | `from`, `to`, `mode`; observasi | Publik |
| GET | `/hotspots` | `from`, `to`, `mode`, `bbox`, `satellite`, `source_product`, `limit`, `offset` | Publik |
| GET | `/hotspots/map` | Filter yang sama tanpa pagination; seluruh marker | Publik |
| GET | `/hotspots/sync-status` | Opsional `area_id`, `source_product`; status sinkron | Publik |
| POST | `/admin/hotspots/sync` | `area_id`, `source_product`, `day_range` | Koordinator |
| GET | `/priorities` | Wajib `mode`, `as_of`; opsional `area_id` | Publik; menyimpan snapshot assessment |
| GET | `/ml/metrics` | Metrics, baseline, prediction test, versi dan gate | Publik |
| POST | `/ml/forecast` | `station_id`, `date`; forecast dari observasi historis DB | Publik |
| GET | `/rainfall/automatic` | Wajib `area_id`, `date_to`; seri 7 hari dan provenance | Publik |
| GET | `/rainfall/chirps` | Wajib `area_id`, `date_to`; CHIRPS eksplisit | Publik |
| POST | `/prevention/assess` | 7 readings, stasiun, sumber, mode hujan; forecast + rekomendasi | Publik, stateless |
| GET | `/tasks` | Opsional `mode`, `status` CSV, `assignee_id` | Publik |
| POST | `/tasks` | Referensi assessment/hotspot dan assignment | Koordinator |
| GET | `/tasks/{id}` | Detail, history dan reports | Publik |
| PATCH | `/tasks/{id}` | Status, assignee atau note | Sesuai role/ownership/transisi |
| POST | `/tasks/{id}/reports` | Hasil pemeriksaan dan catatan | Petugas yang ditugaskan |

Contoh verifikasi tanpa menulis data domain:

```bash
curl -sS http://localhost:8000/health
curl -sS http://localhost:8000/api/v1/stations
curl -sS http://localhost:8000/api/v1/ml/metrics
curl -sS http://localhost:8000/api/v1/auth/me \
  -H 'Authorization: Bearer demo-coordinator-token'
curl -sS 'http://localhost:8000/api/v1/hotspots?mode=HISTORICAL_REPLAY&from=2019-08-17&to=2019-09-15&limit=5&offset=0'
```

## NASA FIRMS live (opsional)

Isi `GAMBUTOPS_FIRMS_MAP_KEY` di `.env` backend, restart backend, lalu pilih mode **Terkini** → **Titik panas** → **Sinkronkan** sebagai koordinator. API key hanya di backend. Produk: `VIIRS_SNPP_NRT` / `VIIRS_NOAA20_NRT`, `day_range` 1–5; cooldown 10 menit per target. Tidak ada sinkron otomatis wajib untuk menjalankan demo historis.

Open-Meteo dan CHIRPS melalui ClimateSERV tidak memerlukan key Earth Engine pada implementasi ini. CHIRPS dapat mengembalikan `PENDING`; UI memeriksa ulang job. Data Final minggu ini mungkin belum tersedia, sehingga mode otomatis memakai Open-Meteo untuk periode terkini.

## Pengujian dan bukti penilaian

Dari `backend/`:

```bash
.venv/bin/ruff check .
.venv/bin/pytest
```

Dari `frontend/`:

```bash
npm run lint
npm run typecheck
npm run test:data
npm run build
```

Tes backend yang membutuhkan database tes dapat dilewati bila `GAMBUTOPS_TEST_DATABASE_URL` tidak diatur. Gunakan database khusus tes berakhiran `_test`, **bukan DB demo**: tes migration dapat menghapus/membuat ulang tabel. Prosedur: [QA backend](backend/docs/backend-qa.md).

Tes browser terfokus (server backend/frontend REST sudah berjalan; dari `frontend/`):

```bash
npx playwright install chromium
SHELL_BASE_URL=http://localhost:3000 ML_E2E_REST=1 node --test --test-isolation=none \
  tests/shell/landing.test.mjs tests/shell/auth.test.mjs \
  tests/shell/prevention.test.mjs tests/shell/chirps.test.mjs \
  tests/shell/ml.test.mjs tests/shell/dashboard-map.test.mjs
```

Sebagian tes browser memakai respons terkontrol untuk menguji edge case; ini tidak membuktikan provider eksternal selalu tersedia. Untuk workflow yang menulis tugas/laporan dengan isolasi transaksi, ikuti [QA integrasi frontend](frontend/docs/live-integration-qa.md). Artefak penilaian: metrics JSON hasil training, response API/provenance, history tugas, dan JSON unduhan uji lapangan.

## Troubleshooting

| Gejala | Penyebab / langkah |
| --- | --- |
| Backend tidak bisa import module | Jalankan dari `backend/` dengan `.venv/bin/uvicorn`; selesaikan `pip install -e '.[dev]'` |
| Python dependency gagal dipasang | Pastikan Python 3.12+ dan `venv`/pip tersedia |
| Database connection refused | Cek `docker compose ps`, status `healthy`, URL dan port host 5433 |
| Data kosong | Migration dan import selesai; periksa mode Riwayat, tanggal serta wilayah |
| Masih data mock/DEMO | Aktifkan `rest` **dan** isi API base URL; restart dev/build ulang |
| Login/mutasi 401/403 | Cocokkan token peran frontend/backend; periksa pemilik tugas dan peran login |
| Browser CORS / Network error | API hidup dan dapat diakses browser; origin frontend tercantum di CORS |
| Port 3000 terpakai | Hentikan proses lama, atau gunakan port lain dan sesuaikan CORS |
| Next loader hilang / `.next` manifest tidak ada | Hentikan dev server terlebih dahulu, jalankan `npm ci`; bila masih gagal, pindahkan `.next` ke folder backup lalu jalankan satu dev server |
| ML `NOT_AVAILABLE` / baseline saja | Jalankan `train-gwt`; cek `backend/var/ml/` dan direktori kerja backend |
| Forecast historis `REJECTED` | Pilih stasiun dengan artifact dan tanggal yang memiliki tujuh pengukuran DB valid berurutan |
| GWT terkini belum tersedia | Pemantauan tidak memiliki sensor terkini; gunakan input manual atau contoh berlabel di GWT Forecasting |
| Hujan `0` vs kosong | Nol berasal dari provider/input; kosong adalah tidak tersedia dan tidak dianggap kering |
| Hujan 6/7 hari untuk rekomendasi | Nilai hari ini masih prakiraan dan dikecualikan; gunakan tanggal akhir kemarin |
| CHIRPS `PENDING` / `NOT_AVAILABLE` | Tunggu/periksa ulang, pilih periode historis, atau gunakan mode otomatis untuk cuaca terkini |
| NASA tidak bisa sinkron | Isi key backend; periksa cooldown dan koneksi. Historis tetap bisa dinilai |
| Peta dasar tidak muncul | Periksa internet/WebGL. Ada fallback latar polos; periksa status data terpisah |
| Logo/tab masih versi lama | Hard refresh atau buka tab baru untuk memperbarui cache favicon/aset |

## Struktur repository dan dokumen lanjutan

```text
.
├── README.md                    # Panduan submission ini
├── dataset/                     # GWT dan CSV VIIRS sumber
├── backend/
│   ├── app/api/routes/          # Endpoint FastAPI
│   ├── app/data/                # Import, provider cuaca, aturan
│   ├── app/ml/                  # Training, artifact, inferensi
│   ├── app/repositories/        # Akses DB dan workflow
│   ├── app/schemas/             # Kontrak Pydantic
│   ├── alembic/                 # Migration
│   ├── docs/                    # Kontrak dan QA teknis
│   ├── tests/
│   └── var/ml/                  # Dibuat lokal oleh training, tidak di Git
└── frontend/
    ├── src/app/                 # Routing Next.js
    ├── src/components/          # UI modul, landing, splash
    ├── src/lib/                 # Repository REST/mock, schema dan domain
    ├── public/brand/            # Logo SVG dan logo 3D transparan
    └── tests/                   # Data, browser, integrasi
```

- [Kontrak API dan contoh request](backend/docs/api-contract.md)
- [Forecasting lapangan dan aturan pencegahan](backend/docs/field-forecast-prevention.md)
- [Pipeline ML dan evaluasi baseline](backend/docs/ml-handoff.md)
- [Integrasi hujan CHIRPS/Open-Meteo](backend/docs/chirps-handoff.md)
- [Workflow tugas dan laporan](backend/docs/tasks-handoff.md)
- [Setup backend](backend/README.md) dan [frontend](frontend/README.md)

Sebagian handoff mencatat tahap implementasi terdahulu. Untuk status fitur submission gunakan README ini; untuk field, enum dan validasi HTTP gunakan OpenAPI dari versi aplikasi yang dijalankan.

## Lingkup prototipe

PeatSignal mendukung penentuan pemeriksaan; bukan sistem darurat atau klaim deteksi kebakaran terkonfirmasi. Hotspot memerlukan verifikasi. Wilayah/stasiun demo dan model historis belum tervalidasi lintas lokasi. Laporan workflow prototipe berlabel SIMULASI; input manual berlabel belum diverifikasi. GWT terkini belum tersambung sensor, dan ekspor hasil bukan publikasi observasi lapangan resmi.

Repository menyertakan data untuk reproduksi demo; ketentuan penggunaan data eksternal tetap mengikuti penyedia masing-masing. Tidak ada klaim lisensi tambahan atas dataset. Jangan menyertakan `.env`, key NASA, password DB atau isi file key lokal dalam submission publik.
