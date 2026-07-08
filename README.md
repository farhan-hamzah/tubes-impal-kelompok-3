# TensorLease

Platform manajemen penyewaan infrastruktur High Performance Computing (HPC) — mencakup katalog paket GPU/compute, kontrak sewa, invoicing, hingga pembayaran online terintegrasi Midtrans.

---

## Fitur Utama

- **Autentikasi** – registrasi & login untuk Client dan Admin (JWT-based), forgot/reset password
- **Katalog Paket HPC** – CRUD paket sewa (spesifikasi GPU, CPU core, RAM, storage, tarif) dari sisi Admin
- **Kontrak Sewa** – pembuatan kontrak oleh Client maupun Admin, filter berdasarkan status (ACTIVE/dll)
- **Invoice & Pembayaran** – generate invoice otomatis, integrasi Midtrans Snap untuk pembayaran online, upload bukti transfer manual
- **Manajemen User** – update profil, ganti password, hapus akun
- **Dashboard Admin** – kelola data client dan kontrak secara terpusat

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Java (Spring Boot 3.5) |
| Frontend | JavaScript (React 19, Vite) |
| Database | Supabase (PostgreSQL) |
| Payment Gateway | Midtrans (Snap API) |
| Deployment | Railway (backend), Vercel (frontend) |

---

## Struktur Project

```
tubes-impal-kelompok-3/
├── backend/                   # Spring Boot REST API
│   └── src/main/java/com/tensorldease/backend/
│       ├── controller/        # AuthController, PaketHpcController, PaymentController, dll
│       ├── service/           # AuthService, PaymentService, UserService, dll
│       └── repository/        # JPA repositories
├── frontend/                  # React SPA
│   └── src/
│       ├── pages/
│       │   ├── admin/         # Dashboard, KelolaPaket, KontrakAdmin, InvoiceAdmin, Laporan
│       │   ├── client/        # Katalog, Monitoring, RiwayatTransaksi
│       │   └── auth/          # Login, Profile
│       ├── context/           # AuthContext
│       └── services/          # API service layer (PaketService, InvoiceService, dll)
└── docs/
    ├── ERD.png
    ├── classDiagram.png
    ├── DFD Lvl 0 & DFD Lvl 1
    └── testing-metrics/        # Testing report & bukti pengujian
```

---

## API Overview

Base URL (production): `https://tubes-impal-kelompok-3-production.up.railway.app/api`

| Modul | Endpoint Utama |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Paket HPC | `GET /paket/all`, `POST /admin/paket`, `PUT /admin/paket/{id}`, `DELETE /admin/paket/{id}` |
| Kontrak | `POST /client/kontrak`, `POST /admin/kontrak`, `GET /admin/kontrak`, `GET /client/kontrak/{clientId}` |
| Invoice | `POST /admin/invoice`, `GET /admin/invoice`, `GET /client/invoice/{clientId}`, `POST /client/invoice/upload-bukti/{invoiceId}` |
| Payment | `POST /payment/snap-token`, `POST /payment/notification` (webhook Midtrans) |
| User | `GET /user/profile/{clientId}`, `PUT /user/update/{clientId}`, `POST /user/logout`, `DELETE /user/delete/{clientId}` |
| Admin | `GET /admin/clients`, `GET /admin/clients/{clientId}` |

Dokumentasi lengkap request/response tersedia di Postman collection tim (lihat `docs/testing-metrics/`).

---

## Menjalankan Secara Lokal

### Prasyarat
- JDK 17+
- Node.js 18+
- Akun Supabase (PostgreSQL connection string)
- Akun Midtrans Sandbox (server key & client key)

### Backend

```bash
cd backend
# isi application.properties / .env dengan:
# - Supabase DB connection string
# - Midtrans server key
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
# isi .env dengan base URL backend & Midtrans client key
npm run dev
```

---

## Testing

Pengujian fungsional dilakukan pada level API menggunakan Postman terhadap endpoint production. Laporan lengkap (test case, metrik pass/fail rate, defect density, dan analisis) tersedia di:

```
docs/testing-metrics/testing-report.md
```

Unit test backend (JUnit) tersedia di `backend/src/test/java/com/tensorldease/backend/`.

---

## Kontributor

- [farhan-hamzah](https://github.com/farhan-hamzah)
- [mihsanaa](https://github.com/mihsanaa)
- [tianisasianipar](https://github.com/tianisasianipar)

---

## Lisensi

Proyek ini dibuat untuk keperluan tugas besar akademik (Telkom University).
