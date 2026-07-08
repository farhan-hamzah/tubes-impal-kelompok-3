# Testing Report – TensorLease

**Repository:** TensorLease (Spring Boot 3.5 + React 19 + Supabase PostgreSQL + Midtrans)
**Metode Pengujian:** API Testing via Postman
**Tanggal Pengujian:** <isi tanggal>
**Penguji:** Farhan Hamzah

---

## 1. Fitur yang Diuji

| Fitur | Endpoint |
|---|---|
| Login | `POST /api/auth/login` |
| Dashboard | `GET /api/client/kontrak/{clientId}`, `GET /api/client/invoice/{clientId}`, `GET /api/user/profile/{clientId}` |
| Upload File | `POST /api/client/invoice/upload-bukti/{invoiceId}` |

---

## 2. Test Case

| No | Fitur | Skenario | Expected Result | Status |
|----|-------|----------|------------------|--------|
| 1 | Login | Email & password Admin valid | 200 OK, response berisi JWT token | |
| 2 | Login | Email & password Client valid | 200 OK, response berisi JWT token | |
| 3 | Login | Password salah untuk email terdaftar | 401 Unauthorized, message error kredensial | |
| 4 | Login | Email tidak terdaftar di sistem | 404 Not Found / 401, message "user not found" | |
| 5 | Login | Body request kosong / field email null | 400 Bad Request, validasi field wajib | |
| 6 | Dashboard | `GET kontrak/{clientId}` dengan token valid | 200 OK, array kontrak sesuai clientId | |
| 7 | Dashboard | `GET invoice/{clientId}` dengan token valid | 200 OK, array invoice sesuai clientId | |
| 8 | Dashboard | `GET profile/{clientId}` dengan token valid | 200 OK, data profil sesuai clientId | |
| 9 | Dashboard | `GET kontrak/{clientId}` tanpa token / token invalid | 401 Unauthorized | |
| 10 | Dashboard | `GET kontrak/{clientId}` untuk client tanpa histori kontrak | 200 OK, array kosong `[]` | |
| 11 | Upload File | Upload `buktiPembayaran` base64 valid untuk invoice UNPAID | 200 OK, status invoice ter-update | |
| 12 | Upload File | Upload dengan `invoiceId` tidak ditemukan di DB | 404 Not Found | |
| 13 | Upload File | Field `buktiPembayaran` kosong / null | 400 Bad Request | |
| 14 | Upload File | String base64 corrupt / bukan encoding valid | 400/500, error decoding ditangani | |
| 15 | Upload File | Upload ulang ke invoice berstatus PAID | Ditolak (409/400), bukan overwrite diam-diam | |

---

## 3. Perhitungan Metrik

### 3.1 Total Test Case
```
Total = 15
```

### 3.2 Pass Rate
```
Pass Rate = (Jumlah PASS / Total Test Case) x 100%
          = ( __ / 15) x 100%
          = __ %
```

### 3.3 Fail Rate
```
Fail Rate = (Jumlah FAIL / Total Test Case) x 100%
          = ( __ / 15) x 100%
          = __ %
```

### 3.4 Defect Count

| Severity | Deskripsi Bug | TC Terkait | Jumlah |
|----------|---------------|------------|--------|
| Critical | | | |
| Major | | | |
| Minor | | | |
| **Total** | | | **__** |

### 3.5 Defect Density (Sederhana)
```
Defect Density = Jumlah Bug / Jumlah Fitur
               = __ / 3
               = __ bug per fitur
```

---

## 4. Dokumentasi Bukti

Screenshot diambil dari Postman, masing-masing menampilkan request (method + URL + body), status code, dan response body dalam satu frame.

| No | File | Skenario |
|---|---|---|
| 1 | `screenshots/01-login-success.png` | Login Client/Admin valid → 200 + JWT token |
| 2 | `screenshots/02-login-error.png` | Login password salah → 401 |
| 3 | `screenshots/03-dashboard-endpoints.png` | GET kontrak & invoice by client → 200 |
| 4 | `screenshots/04-upload-file-error.png` | Upload dengan invoiceId invalid / base64 corrupt |
| 5 | `screenshots/05-dashboard-unauthorized.png` | GET kontrak tanpa token → 401 |
