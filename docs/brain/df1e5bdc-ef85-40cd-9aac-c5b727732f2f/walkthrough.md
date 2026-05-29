# Walkthrough — Varguard Metadata Hub MVP

Kami telah berhasil mengimplementasikan **Varguard Metadata Hub MVP** sebagai aplikasi Next.js mandiri yang siap pakai! Seluruh antarmuka dikembangkan dengan pendekatan *technical, stable, operational, & infrastructure-grade* menggunakan komponen-komponen teruji dari `./shared/design-system`, dipadu dengan visual semantik di `app/globals.css` dan `tailwind.config.ts`.

---

## Yang Telah Diselesaikan

### 1. Struktur Layout & Navigasi Premium
- **App Shell Sidebar**: Menyediakan navigasi lengkap ke 11 modul utama dengan gaya estetika *dark-mode* premium khas Varguard.
- **Tenant Context**: Mendukung pergantian *tenant* secara dinamis antara **SPBE Pemerintah RI** dan **Kementerian Keuangan** dengan visual penanda *environment active status* (PROD, STAGING).
- **Universal Top Bar**: Panel atas yang terintegrasi dengan penelusuran skema, notifikasi sistem, bantuan, dan status administrator.

### 2. Modul Fungsional Utama (Interactive Pages)
- 📊 **Dashboard Modul**: Menyajikan total data registry, kelengkapan rata-rata (*completeness score*), jumlah kegagalan asersi kualitas data, rincian aktivitas terbaru, dan grafik pembagian rumpun data.
- 🗄️ **Dataset Registry**: Katalog tabel operasional. Dilengkapi dengan **Manual Input Dialog** untuk menambahkan rancangan baru secara langsung.
- 🔍 **Detail Dataset Tabs**: Menampilkan 6 tab lengkap: *Overview*, *Schema & Variables*, *FastAPI Data Profiling*, *ETL Lineage logs*, *Quality & Audit*, serta *EA TOGAF Alignment*.
- 📐 **Indicator Registry**: Glosarium indikator statistik nasional terpadu dengan penyunting asersi rumus formula matematika.
- 🔠 **Variable Registry**: Glosarium penamaan kolom standar sektoral lengkap dengan informasi tipe data, *nullable*, dan penanda tingkat sensitivitas data.
- 🌳 **Classifications Tree Hierarchy**: Visualisasi hirarki wilayah (Provinsi → Kabupaten/Kota → Kecamatan) menggunakan struktur pohon interaktif (*expandable/collapsible folder node*).
- ⛓️ **ETL Lineage Graph Canvas**: Graph visualisasi silsilah aliran data master menggunakan **React Flow (`@xyflow/react`)** dengan integrasi panel penelusuran node.
- 🛡️ **Metadata Quality Control**: Dashboard peninjau kepatuhan data master beserta daftar pelanggaran asersi kritis.
- 🧬 **Lightweight MDM Merging**: Layanan pembersihan data kotor menggunakan visual pemadanan fuzzy match dan aksi penggabungan (*merge*) menjadi Golden Record instansi terpadu.
- 🗳️ **Governance Approval Flow**: Modul audit metodologi bagi Walidata untuk menolak atau menyetujui pengajuan dataset baru sebelum dirilis ke SSOT.
- 🔌 **Integrations & Settings**: Panduan penggunaan kunci akses API dan dokumentasi kode asersi cURL untuk Varguard Studio.

### 3. Simulation Engines (lib/ & api/)
- 💾 **Mock Database (`lib/mock-db.ts`)**: In-memory database yang menyimpan state dataset nasional, indikator Susenas, klasifikasi geografis standar BPS, dan relasi EA TOGAF.
- 🐍 **Data Agent Simulator (`lib/data-agent-sim.ts`)**: Simulasi server FastAPI dalam menghitung profiling data (null rate, candidate primary keys, unique count) dan fuzziness score matching.

---

## 🚀 Cara Menjalankan & Menguji Aplikasi

Untuk mencoba secara langsung di server lokal Anda:

1. Jalankan dev server Next.js:
   ```bash
   npm run dev
   ```
2. Buka peramban di alamat: `http://localhost:3000`

### Skenario Pengujian Interaktif yang Direkomendasikan:

1. **Jalankan FastAPI Scanner & Profiler**:
   - Pergi ke menu **Dataset Registry** → Klik dataset **Dataset Kemiskinan Terpadu Nasional**.
   - Buka tab **Schema & Variables** → Tekan tombol **Jalankan FastAPI Scanner**. Anda akan melihat skema tipe data kolom langsung termuat secara otomatis!
   - Buka tab **Data Agent Profiling** → Klik **Mulai Profiling**. Pandas Profiler akan menghitung *null rate*, rentang nilai maksimal/minimal, serta candidate primary key secara dinamis dan memperbarui skor kelengkapan (*completeness score*) di dashboard!

2. **Konsolidasikan Entitas MDM**:
   - Pergi ke menu **Lightweight MDM**.
   - Tinjau daftar usulan penggabungan otomatis (misalnya `Pusdatin B.P.S` → `Pusdatin BPS`).
   - Klik tombol **Gabungkan (Merge)** untuk memproses pembersihan duplikasi instansi menjadi satu Golden Record master!

3. **Gunakan Governance Approval**:
   - Daftarkan dataset baru di menu **Dataset Registry** dengan status awal `DRAFT`.
   - Di halaman detail dataset tersebut, ajukan untuk direview.
   - Buka halaman **Governance Approval** untuk melihat antrean pengajuan, lalu klik **Setujui** untuk mempublikasikannya ke Hub nasional!
