# Arsip Panduan Visual: Baseline Component, UI/UX, & Typewriter Style

Arsip ini merupakan dokumentasi resmi standarisasi desain untuk Varguard Metadata Hub, yang dirancang selaras dengan platform SaaS enterprise berkinerja tinggi seperti Databricks, Modal, dan Vercel.

---

## 1. Baseline Components (Komponen Dasar)

Varguard menggunakan fondasi komponen dasar (*atomic components*) yang terpusat di direktori `/shared/design-system/components/` untuk memastikan konsistensi antarmuka:

### A. Label Form (`DsLabel`)
- **Konvensi**: Menggunakan *sentence-case* (huruf kecil, kapital hanya di awal).
- **Styling**: `text-xs font-semibold text-muted-foreground block mb-1.5`
- **Tujuan**: Menghindari pemakaian uppercase yang tidak konsisten dan menjaga keterbacaan yang optimal.
- **Implementasi**:
  ```tsx
  import { DsLabel } from "@/shared/design-system/components";
  
  <DsLabel htmlFor="username">Nama Pengguna</DsLabel>
  ```

### B. Input Field (`DsInput` & `DsTextarea`)
- **Styling**: Memiliki ketebalan border `1px` (`border-input`), warna latar card (`bg-card`), dan bayangan halus (`shadow-sm`).
- **Sudut (Border Radius)**: Ditajamkan menjadi `rounded-control` (setara **4px** atau `0.25rem`) untuk kesan teknis yang kokoh.

### C. Tombol (`DsButton`)
- **Ketentuan**: Mendukung variant `default`, `secondary`, `outline`, dan `destructive`. Sudut diatur tajam (`rounded-control`) untuk menyesuaikan konsistensi visual.

---

## 2. Standardisasi UI/UX (Vibes Databricks)

Gaya visual Varguard diproyeksikan untuk menyerupai *Managed Compute Control Center* dengan karakteristik utama sebagai berikut:

- **Kepadatan Informasi Tinggi (High Density)**: Padding yang kompak, ukuran teks yang kecil namun tebal, serta margin yang rapat untuk menyajikan banyak data logikal dalam satu layar.
- **Tipografi Bersih (Inter Font)**: Memanfaatkan font **Inter** sebagai basis sans-serif utama karena memiliki keterbacaan yang luar biasa tajam pada resolusi kecil.
- **Pewarnaan Kontras & Presisi**:
  - *Light Mode*: Latar belakang abu-abu terang datar (`slate-50`/`slate-100`) dengan panel putih tajam.
  - *Dark Mode*: Latar belakang arang hitam pekat (`zinc-950`/`slate-950`) dengan panel datar (`zinc-900`/`neutral-900`) dan border abu-abu gelap (`zinc-800`).

---

## 3. Gaya Mesin Tik (Typewriter Style)

Untuk menyajikan elemen dinamis seperti subheadline promosi, control terminal, command logs, atau status pemrosesan data AI, kami menyediakan kelas animasi **Typewriter** berbasis CSS murni.

### A. Kelas Utilitas: `.animate-typewriter`
Kelas ini menyimulasikan ketikan teks karakter-demi-karakter secara otomatis dengan kursor ketikan berkedip (*blinking caret*).

### B. Contoh Implementasi JSX
Gunakan elemen dengan tag `span` atau `div` block pendek. Pastikan teks tidak terlalu panjang agar tidak terpotong saat animasi berjalan.

```tsx
{/* Judul Beranimasi Ketikan */}
<div className="font-mono text-sm text-primary">
  <span className="animate-typewriter font-semibold tracking-wide">
    Initializing Neon PostgreSQL Database...
  </span>
</div>
```

### C. Cara Kerja CSS (di `/app/globals.css`)
```css
/* Animasi Ketikan Karakter */
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

/* Animasi Kursor Berkedip */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: hsl(var(--primary)); }
}

.animate-typewriter {
  display: inline-block;
  overflow: hidden;
  border-right: 2px solid hsl(var(--primary));
  white-space: nowrap;
  animation: 
    typewriter 3.5s steps(40, end) infinite alternate,
    blink-caret 0.75s step-end infinite;
}
```
 Panduan ini dirancang untuk mempermudah onboarding developer agar tidak merusak harmoni UI/UX Varguard Metadata Hub yang sudah terstandar premium.
