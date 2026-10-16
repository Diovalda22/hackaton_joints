# PeatSignal

Aplikasi pemantauan gambut: muka air tanah, titik panas satelit, prioritas pemeriksaan,
tugas/laporan lapangan, dan eksperimen prediksi muka air tanah +1 hari.

Frontend memakai **Next.js**, backend memakai **FastAPI**, dan database memakai
**PostgreSQL/PostGIS**. Untuk menjalankan aplikasi lengkap, frontend harus memakai
mode **REST** agar terhubung ke backend.

## Prasyarat

- Python **3.12+** beserta modul `venv` dan pip.
- Node.js **22.13+** (disarankan Node 24) dan npm **11**.
- Docker beserta Docker Compose jika menggunakan database lokal.
- Folder `dataset/` berisi `mmc1.xlsx` dan CSV VIIRS untuk mengisi database baru.
- Internet untuk instalasi dependency, peta dasar, Supabase, dan sinkron NASA FIRMS.

Perintah berikut untuk Bash pada Linux/macOS, dimulai dari root repository.
Gunakan **dua terminal** saat menjalankan backend dan frontend.

## 1. Setup backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[dev]'
```

Pilih salah satu database di bawah. Jika `backend/.env` sudah dikonfigurasi, gunakan
file yang ada; jangan menimpanya dengan template baru.

### Opsi A — PostgreSQL/PostGIS lokal

Dari folder `backend/`:

```bash
[ -f .env ] || cp .env.example .env
docker compose up -d postgres
docker compose ps
```

Tunggu container database berstatus `healthy`. Pastikan `backend/.env` memuat:

```dotenv
GAMBUTOPS_APP_ENV=development
GAMBUTOPS_DATABASE_URL=postgresql+psycopg://gambutops:gambutops@127.0.0.1:5433/gambutops
GAMBUTOPS_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
GAMBUTOPS_COORDINATOR_TOKEN=
GAMBUTOPS_FIELD_OFFICER_TOKEN=
GAMBUTOPS_FIRMS_MAP_KEY=
GAMBUTOPS_ML_ARTIFACT_DIR=var/ml
```

Database Docker memakai port host **5433**. Backend membaca `.env` relatif terhadap
direktori kerja, jadi jalankan perintah backend dari folder `backend/`.

### Opsi B — Database Supabase yang sudah tersedia

Docker tidak diperlukan jika memakai Supabase. Dari folder `backend/`:

```bash
[ -f .env ] || cp .env.supabase.example .env
```

Edit `backend/.env`: isi `GAMBUTOPS_DATABASE_URL` menggunakan connection string
PostgreSQL/Supavisor **session mode** milik project. Jika menggunakan template repository,
ganti `URL_ENCODED_DATABASE_PASSWORD` dengan password database yang sudah di-URL-encode.
Gunakan password database, bukan publishable/anon key.

Pastikan origin frontend diizinkan:

```dotenv
GAMBUTOPS_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
GAMBUTOPS_ML_ARTIFACT_DIR=var/ml
```

Frontend mengakses Supabase **melalui FastAPI**; connection string database tetap hanya
berada di backend. Jangan menaruh password database atau key NASA pada `NEXT_PUBLIC_*`.

### Jalankan migration

Untuk kedua opsi database, dari `backend/`:

```bash
.venv/bin/alembic upgrade head
.venv/bin/alembic current
```

Migration membuat tabel aplikasi dan identitas koordinator/petugas demo. Database baru
belum berisi data pengukuran dan hotspot; isi melalui langkah berikut.

## 2. Isi data historis dan siapkan ML

Jalankan dari `backend/`. Jika database sudah berisi dataset yang diperlukan, import
dapat dilewati. Import bersifat idempotent terhadap data sumber yang sama.

```bash
# Import pengukuran muka air tanah dan stasiun.
.venv/bin/python -m app.cli import-gwt ../dataset/mmc1.xlsx --apply

# Import hotspot historis pada periode demo dan cakupan kedua wilayah pemantauan.
.venv/bin/python -m app.cli import-hotspots ../dataset/viirs-snpp_2019_Indonesia.csv \
  --from 2019-08-01 --to 2019-09-15 --bbox '100,-4,112,2' --apply

# Training model BRG6 dan BRG3, sekaligus membuat metrics dan artifact lokal.
.venv/bin/python -m app.cli train-gwt ../dataset/mmc1.xlsx
```

Artifact disimpan di `backend/var/ml/` dan tidak ikut Git. Meski database Supabase sudah
berisi data, host backend tetap memerlukan artifact lokal agar halaman ML menampilkan hasil.
Training cukup dijalankan saat artifact belum tersedia atau saat model perlu diperbarui.

Model saat ini berstatus `EXPERIMENT_ONLY`: hasil historis ditampilkan untuk evaluasi,
tidak digunakan oleh mesin prioritas. Data GWT historis tidak mewakili kondisi terkini.

### Opsional — Aktifkan NASA FIRMS live

Isi `GAMBUTOPS_FIRMS_MAP_KEY` pada `backend/.env`. Jika file key lokal
`api_key_firms.md` tersedia, gunakan helper yang tidak mencetak key:

```bash
.venv/bin/python scripts/configure_firms_key.py
```

Tanpa key, data historis tetap berjalan; aksi sinkron NASA menampilkan pesan key belum
dikonfigurasi. Setelah key tersedia, koordinator dapat memilih mode **Terkini** pada
halaman **Titik panas** lalu menekan **Sinkronkan**. Cooldown berlaku 10 menit per target.

## 3. Jalankan backend — terminal pertama

Dari root repository:

```bash
cd backend
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Biarkan terminal ini berjalan. Backend tersedia di:

| Alamat | Kegunaan |
| --- | --- |
| http://localhost:8000/health | Liveness API; respons `{"status":"ok"}` |
| http://localhost:8000/docs | Dokumentasi API interaktif |
| http://localhost:8000/api/v1/stations | Cek koneksi database dan daftar stasiun |
| http://localhost:8000/api/v1/ml/metrics | Cek ketersediaan hasil eksperimen ML |

`/health` memeriksa proses API. Gunakan endpoint stasiun untuk memastikan koneksi database
dan hasil import juga tersedia.

## 4. Setup dan jalankan frontend — terminal kedua

Dari root repository:

```bash
cd frontend
npm ci
[ -f .env.local ] || cp .env.example .env.local
```

Edit `frontend/.env.local` dan aktifkan nilai berikut (hapus tanda `#` jika masih komentar):

```dotenv
NEXT_PUBLIC_DATA_SOURCE=rest
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEMO_COORDINATOR_TOKEN=demo-coordinator-token
NEXT_PUBLIC_DEMO_FIELD_OFFICER_TOKEN=demo-field-officer-token
```

Token di atas adalah token **demo development**, sesuai default backend ketika token
di `backend/.env` kosong. Jika token backend sudah diganti, samakan nilai token frontend
untuk masing-masing peran. Token demo frontend ikut dikirim ke browser.

Jalankan:

```bash
npm run dev
```

Buka **http://localhost:3000**. Root mengarah ke dashboard. Pilih pengguna demo di header
untuk berpindah antara koordinator dan petugas lapangan.

Untuk data historis, gunakan mode **Riwayat**. Periode awal aplikasi adalah
17 Agustus–15 September 2019. Data NASA terbaru ditampilkan terpisah pada mode **Terkini**;
GWT terkini akan menampilkan pemberitahuan belum tersedia bila belum ada pengukuran baru.

## Menjalankan lagi setelah setup pertama

Terminal pertama, dari root (lewati perintah Docker jika memakai Supabase):

```bash
cd backend
docker compose up -d postgres
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Terminal kedua, dari root:

```bash
cd frontend
npm run dev
```

Tidak perlu mengulang instalasi, import, migration atau training kecuali dependency,
schema, dataset, atau artifact berubah.

## Build frontend production lokal

Dari `frontend/`, dengan `.env.local` REST sudah sesuai:

```bash
npm run build
npm run start
```

Backend tetap harus berjalan. Nilai `NEXT_PUBLIC_*` dibaca saat build; setelah mengubah
URL API atau token pada build production, jalankan build ulang. Untuk mode dev, restart
`npm run dev` setelah mengubah `.env.local`.

## Frontend saja tanpa backend

Untuk mencoba antarmuka dengan data sintetis, atur `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_DATA_SOURCE=mock
```

Lalu restart frontend. Mode mock tidak membutuhkan database/backend; tugas dan laporan
disimpan di localStorage browser. Hasil eksperimen ML tidak direkayasa dan akan tampil
sebagai belum tersedia. Kembalikan ke `rest` untuk memakai backend/database asli.

## Pemeriksaan dan troubleshooting

| Kendala | Yang perlu diperiksa |
| --- | --- |
| Frontend masih menampilkan data DEMO | `NEXT_PUBLIC_DATA_SOURCE=rest`, URL API terisi, lalu restart/build ulang frontend |
| API tidak terhubung | Backend port 8000 aktif; buka `/health`, lalu `/api/v1/stations` |
| Database connection refused | Docker `healthy`, URL DB sesuai; database lokal memakai port 5433 |
| Data historis kosong | Migration dan import sudah dijalankan; periksa mode, tanggal, serta wilayah |
| Hasil ML belum tersedia | Jalankan `train-gwt`; pastikan metrics dan `.joblib` ada di direktori artifact backend |
| Buat tugas/laporan gagal 401/403 | Token frontend sesuai backend dan pengguna demo memiliki peran yang tepat |
| Browser melaporkan CORS | Origin frontend harus ada di `GAMBUTOPS_CORS_ALLOWED_ORIGINS`; restart backend |
| Frontend pindah ke port 3001 | Hentikan proses lain pada 3000, atau tambahkan origin port baru pada CORS backend |
| Peta dasar tidak termuat | Periksa internet; aplikasi menyediakan fallback latar polos |

Perintah verifikasi dari folder masing-masing:

```bash
# backend/
.venv/bin/ruff check .
.venv/bin/pytest

# frontend/
npm run lint
npm run typecheck
npm run test:data
npm run build
```

Tes integrasi database backend memerlukan database khusus tes; tanpa konfigurasi tersebut,
sebagian tes dilewati. Lihat [QA backend](backend/docs/backend-qa.md). Untuk pengujian
browser ke backend asli dengan rollback data uji, ikuti
[QA integrasi frontend](frontend/docs/live-integration-qa.md).

Hentikan backend/frontend dengan **Ctrl+C**. Untuk menghentikan database lokal tanpa
menghapus volume data, jalankan `docker compose stop postgres` dari `backend/`.

Detail tambahan: [backend](backend/README.md), [frontend](frontend/README.md), dan
[progres frontend](frontend/docs/progress.md).
