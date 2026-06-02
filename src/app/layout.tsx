import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "IKU Kampus Analytics – Dashboard Indikator",
  description:
    "Visualisasi dan analitik data IKU kampus berbasis upload CSV, Excel, dan koneksi Google Spreadsheet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
