"use client";

import { Button, Tile } from "@carbon/react";
import { Upload } from "@carbon/icons-react";

type Props = {
  ikuCode: string;
  title: string;
  description: string;
  onOpenUpload: () => void;
  hasConnection: boolean;
};

export function DashboardPlaceholder({ ikuCode, title, description, onOpenUpload, hasConnection }: Props) {
  return (
    <Tile
      style={{
        padding: "3rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "420px",
        background: "var(--cds-layer-01)",
        border: "1px solid var(--cds-border-subtle-01)",
        borderRadius: "0",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--cds-layer-selected-01)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          color: "#0f62fe",
        }}
      >
        <Upload size={24} style={{ margin: "auto" }} />
      </div>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--cds-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        Dasbor {ikuCode} {hasConnection ? "Sudah Terhubung" : "Belum Terhubung"}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--cds-text-secondary)",
          marginBottom: "2rem",
          maxWidth: "560px",
          lineHeight: "1.4",
        }}
      >
        <strong>{title}</strong> - {description}
      </p>

      <div
        style={{
          textAlign: "left",
          background: "var(--cds-layer-hover-01)",
          padding: "1.5rem",
          borderLeft: "4px solid #0f62fe",
          marginBottom: "2rem",
          maxWidth: "600px",
          width: "100%",
          borderRadius: "0",
        }}
      >
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--cds-text-primary)",
            margin: "0 0 0.55rem 0",
          }}
        >
          Langkah Penyelarasan Data Sumber:
        </p>
        <ol
          style={{
            fontSize: "0.75rem",
            color: "var(--cds-text-secondary)",
            paddingLeft: "1.25rem",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <li>
            Pastikan berkas spreadsheets Anda memiliki format penamaan terstruktur baku:{" "}
            <code>{ikuCode}_[Fakultas]_[Nama_Koneksi].xlsx</code>.
          </li>
          <li>Pastikan nama header kolom skema utama terisi lengkap sesuai standar parameter KPI institusi.</li>
          <li>
            Klik tombol di bawah ini atau tombol tambah (+) di bagian atas panel <strong>Connected Sources</strong> di
            sebelah kiri untuk menyambungkan tautan Google Drive / Spreadsheet.
          </li>
        </ol>
      </div>

      <Button
        size="sm"
        renderIcon={Upload}
        onClick={onOpenUpload}
        iconDescription={hasConnection ? `Ganti Koneksi ${ikuCode}` : `Hubungkan Data ${ikuCode}`}
      >
        {hasConnection ? `Ganti Koneksi ${ikuCode}` : `Hubungkan Data ${ikuCode}`}
      </Button>
    </Tile>
  );
}
