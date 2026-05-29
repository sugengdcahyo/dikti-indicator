# Rencana Implementasi: Fitur Autentikasi (Google Auth, Internal Login, Registrasi, Forgot Password)

Rencana ini bertujuan untuk menambahkan halaman dan alur autentikasi lengkap dengan desain premium, modern, dan interaktif (mendukung mode gelap/terang bawaan Varguard).

## Deskripsi Rencana
Kami akan membangun sistem autentikasi interaktif berbasis client-side session yang persisten menggunakan `localStorage` agar terintegrasi mulus dengan dashboard dan tenant management saat ini.

Fitur yang akan diimplementasikan meliputi:
1. **Halaman Login (`/login`)**:
   - Pilihan login dengan Google Auth (simulasi pop-up / dialog Google premium).
   - Login internal dengan Email / Username + Password (validasi interaktif, visibilitas password toggle).
   - Navigasi ke registrasi dan lupa password.
2. **Halaman Registrasi (`/register`)**:
   - Pendaftaran akun dengan form interaktif (Nama, Email, Username, Password, Konfirmasi Password, Pilihan Instansi/Tenant, Peran).
   - Simulasi pengiriman & input kode OTP verifikasi email dengan animasi transisi yang cantik.
3. **Halaman Lupa Password (`/forgot-password`)**:
   - Form input Email untuk pemulihan.
   - Simulasi kode verifikasi keamanan yang dikirim ke email.
   - Reset password baru dengan indikator kekuatan password yang interaktif.
4. **Integrasi Session & Proteksi Route**:
   - Integrasi ke `WorkspaceLayoutProvider` agar membaca data user aktif dari `localStorage`.
   - Tombol logout di bagian menu profil.
   - Deteksi rute publik (`/login`, `/register`, `/forgot-password`) agar tidak menampilkan layout sidebar/header utama.

---

## Proposed Changes

### 1. `components`

#### [MODIFY] [workspace-layout-provider.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/components/workspace-layout-provider.tsx)
- Menambahkan pemeriksaan `usePathname()` untuk mengecualikan rute autentikasi (`/login`, `/register`, `/forgot-password`) dari layout utama (sidebar, header, dsb).
- Menambahkan fitur membaca profil pengguna aktif dari `localStorage` (misal: nama, inisial, peran, tenant).
- Menambahkan tombol **Logout** yang membersihkan session `localStorage` dan merujuk kembali ke `/login`.
- Melakukan redirect otomatis jika user belum masuk saat mencoba mengakses halaman dashboard/metadata.

---

### 2. `app`

#### [NEW] [login/page.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/login/page.tsx)
- Membuat halaman login dengan estetika premium: glassmorphism, efek hover dinamis, transisi halus, mendukung dark/light mode.
- Form login email/username dan password.
- Tombol login Google dengan simulasi jendela otorisasi Google yang memukau.

#### [NEW] [register/page.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/register/page.tsx)
- Form pendaftaran multi-step yang modern:
  - Step 1: Informasi Dasar & Akun (Nama, Email, Password).
  - Step 2: Instansi & Peran (pilihan Tenant: SPBE / Kemenkeu, Peran: Walidata / Produsen Data).
  - Step 3: Verifikasi Kode OTP (input kode OTP yang dinamis dengan 6-digit box).

#### [NEW] [forgot-password/page.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/forgot-password/page.tsx)
- Form pemulihan kata sandi multi-step:
  - Step 1: Input email terdaftar.
  - Step 2: Input kode keamanan 6-digit yang disimulasikan.
  - Step 3: Pengaturan password baru dengan bar indikator kekuatan password.
  - Step 4: Layar sukses dengan animasi centang hijau dan tombol kembali ke Login.

---

## Rencana Verifikasi

### Manual Verification
- Uji navigasi antar halaman `/login`, `/register`, `/forgot-password`.
- Uji alur masuk menggunakan Google Auth (pastikan dialog Google muncul dengan indah, login berhasil, nama & avatar terupdate, dan meredirect ke dashboard).
- Uji alur masuk menggunakan kredensial internal (misal admin@varguard.id / admin123).
- Uji validasi form login, registrasi (termasuk OTP), dan lupa password (termasuk kekuatan sandi).
- Pastikan tampilan responsif pada layar mobile, tablet, dan desktop.
- Pastikan perubahan mode gelap/terang (theme toggle) berjalan selaras dan serasi di semua halaman login/regis/lupa password.
