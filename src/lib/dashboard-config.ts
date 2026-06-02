"use client";

export const dashboardMenuItems = [
  "Overview",
  "IKU 001",
  "IKU 002",
  "IKU 003",
  "IKU 005",
  "IKU 007",
  "IKU 009",
] as const;

export type DashboardMenuItem = (typeof dashboardMenuItems)[number];
export type MappedDashboardTab = Exclude<DashboardMenuItem, "Overview">;

export type DashboardTabConnection = {
  userEmail: string;
  dashboardTab: string;
  sourceId: string;
  sourceLabel: string;
};

export const overviewDashboardItems = [
  { tab: "IKU 001", title: "Kesiapan Lulusan Mendapatkan Pekerjaan Layak" },
  { tab: "IKU 002", title: "Mahasiswa Mendapatkan Pengalaman di Luar Kampus" },
  { tab: "IKU 003", title: "Dosen Berkegiatan di Luar Kampus (Keaktifan Dosen Tetap)" },
  { tab: "IKU 005", title: "Hasil Kerja Dosen Digunakan Oleh Masyarakat (Riset & Publikasi)" },
  { tab: "IKU 007", title: "Kelas yang Kolaboratif dan Partisipatif (Case Method / Team Project)" },
  { tab: "IKU 009", title: "Indikator Tambahan Institusi & Internasionalisasi" },
] as const;

export const ikuDashboardDetails: Record<MappedDashboardTab, { title: string; description: string }> = {
  "IKU 001": {
    title: "Lulusan Mendapatkan Pekerjaan Layak",
    description:
      "Mengukur persentase mahasiswa jenjang diploma dan sarjana yang berhasil mendapatkan pekerjaan layak dengan pendapatan di atas UMR, melanjutkan studi ke jenjang yang lebih tinggi, atau berwirausaha secara mandiri dalam waktu 12 bulan setelah kelulusan.",
  },
  "IKU 002": {
    title: "Mahasiswa Mendapatkan Pengalaman di Luar Kampus",
    description:
      "Mengukur persentase mahasiswa aktif yang menghabiskan minimal 20 SKS di luar prodi asal melalui program MBKM seperti magang industri, proyek desa, wirausaha, mengajar di sekolah, pertukaran pelajar, penelitian, atau berprestasi di tingkat nasional/internasional.",
  },
  "IKU 003": {
    title: "Dosen Berkegiatan di Luar Kampus (Keaktifan Dosen Tetap)",
    description:
      "Mengukur persentase dosen tetap yang melaksanakan kegiatan tridharma di luar kampus (mengajar, membina mahasiswa, meneliti) atau praktisi industri yang mengajar di dalam kampus.",
  },
  "IKU 005": {
    title: "Hasil Kerja Dosen Digunakan Oleh Masyarakat",
    description:
      "Mengukur persentase dosen tetap yang hasil riset, kepakaran, karya ilmiah bereputasi, produk paten/hak cipta, atau buku ajar miliknya berhasil diaplikasikan secara nyata oleh dunia industri, masyarakat umum, atau sebagai dasar perumusan kebijakan publik.",
  },
  "IKU 007": {
    title: "Kelas yang Kolaboratif dan Partisipatif",
    description:
      "Mengukur persentase mata kuliah program sarjana dan diploma yang dinilai interaktif menggunakan metode pembelajaran berbasis kasus nyata (Case Method) atau berbasis proyek kelompok kolaboratif (Team-Based Project).",
  },
  "IKU 009": {
    title: "Kategori Tambahan & Internasionalisasi Institusi",
    description:
      "Mengukur akreditasi internasional program studi, tingkat keaktifan kemitraan global universitas, serta penjaminan mutu tata kelola lembaga pendidikan tinggi berbasis standar global terintegrasi.",
  },
};
