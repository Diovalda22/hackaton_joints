# GambutOps Backend

Foundation backend untuk GambutOps: FastAPI/Pydantic, kontrak OpenAPI v1, autentikasi role
demo di server, CORS allowlist, SQLAlchemy, dan migration PostgreSQL/PostGIS.

## Menjalankan lokal

Gunakan Python 3.12+ dan Docker. Dari direktori `backend/`:

```bash
cp .env.example .env
docker compose up -d postgres
python3 -m venv .venv
.venv/bin/pip install -e '.[dev]'
.venv/bin/alembic upgrade head
.venv/bin/uvicorn app.main:app --reload
```

API tersedia di `http://localhost:8000`, dokumentasi interaktif di `/docs`, kontrak mesin
di `/openapi.json`, dan liveness di `/health`. Konfigurasi memakai prefix
`GAMBUTOPS_`; jangan commit `.env` atau kunci FIRMS.

## Autentikasi demo

Endpoint write memakai `Authorization: Bearer <token>`. Pada development/test saja tersedia
token deterministik `demo-coordinator-token` dan `demo-field-officer-token`. Untuk production,
`GAMBUTOPS_COORDINATOR_TOKEN` dan `GAMBUTOPS_FIELD_OFFICER_TOKEN` wajib diisi dengan nilai kuat
minimal 32 karakter dan berbeda; aplikasi menolak startup bila keduanya tidak valid. Kedua identitas demo memiliki
UUID stabil yang diseed oleh migration awal.

Contoh:

```bash
curl http://localhost:8000/health
curl -H 'Authorization: Bearer demo-coordinator-token' \
  http://localhost:8000/api/v1/auth/me
```

Skema endpoint tahap berikut sudah diterbitkan di OpenAPI agar frontend dapat menyelaraskan
payload. Sampai milestone implementasinya selesai, endpoint data tersebut sengaja merespons
HTTP `501`; hanya `/health`, `/openapi.json`, `/docs`, dan `/api/v1/auth/me` yang operasional
pada foundation ini.

## Database

Migration pertama mengaktifkan PostGIS dan `pgcrypto`, lalu membuat:

- `data_sources`, `stations`, dan `groundwater_observations` dengan provenance serta nilai null;
- `hotspots` dengan titik EPSG:4326 dan indeks GiST;
- `priority_assessments` dengan snapshot JSON dan versi rule;
- `users`, `inspection_tasks`, `field_reports`, serta `task_status_history`.

Koordinat stasiun harus lengkap dan memiliki `coordinate_source`. Status, role, mode, prioritas,
dan kualitas data dibatasi oleh constraint database. Menjalankan migration offline tanpa database:

```bash
.venv/bin/alembic upgrade head --sql
```

## Verifikasi

```bash
.venv/bin/ruff check .
.venv/bin/pytest
```

Tes foundation mencakup health, autentikasi/otorisasi role, CORS, publikasi kontrak OpenAPI,
konfigurasi production, nullable GWT, mode historis, dan metadata tabel. Tes migration terhadap
PostgreSQL nyata memerlukan Docker/PostGIS yang aktif.

