"use client";

import { AppDataTable } from "@/components/dashboard/data-table";
import { useDashboardStore, useFilteredRows } from "@/store/dashboard-store";
import { Tag, Tile } from "@carbon/react";
import { PageHeader } from "@/components/layout/page-header";

export default function DataPage() {
  const columns = useDashboardStore((s) => s.columns);
  const profile = useDashboardStore((s) => s.profile);
  const activeFileName = useDashboardStore((s) => s.activeFileName);
  const filtered = useFilteredRows();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <PageHeader
        title="Eksplorasi Data Sumber"
        description="Jelajahi, saring, dan analisa sampel data dari sumber koneksi aktif yang terpilih."
      />

      {/* Section Card 1: Overview Metadata */}
      {profile && (
        <Tile style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
          padding: "1rem"
        }}>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--cds-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.375rem" }}>
              Selected Source File
            </p>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cds-text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={activeFileName}>
              {activeFileName || "Unnamed Dataset"}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--cds-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.375rem" }}>
              Total Records
            </p>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--cds-text-primary)", margin: 0 }}>
              {profile.totalRows} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--cds-text-secondary)" }}>baris</span>
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--cds-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.375rem" }}>
              Total Columns
            </p>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--cds-text-primary)", margin: 0 }}>
              {profile.totalColumns} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--cds-text-secondary)" }}>kolom</span>
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.6875rem", color: "var(--cds-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.375rem" }}>
              Data Integrity
            </p>
            <div style={{ display: "flex", alignItems: "center", height: "100%", minHeight: "20px" }}>
              <Tag type={profile.duplicateRows > 0 ? "warm-gray" : "green"} size="sm" style={{ margin: 0 }}>
                {profile.duplicateRows > 0 ? `${profile.duplicateRows} Baris Duplikat` : "Clean / No Duplicates"}
              </Tag>
            </div>
          </div>
        </Tile>
      )}

      {/* Section Card 2: Column Structure & Data Types Schema Table Summary */}
      {profile && (
        <Tile style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cds-text-primary)", margin: 0 }}>
              Ringkasan Struktur Kolom &amp; Tipe Data (Schema)
            </h4>
            <p style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)", margin: 0 }}>
              Analisa tipe data, kategori kolom, dan sampel nilai dari dataset aktif di bawah.
            </p>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--cds-border-subtle-01)", background: "var(--cds-layer-02)" }}>
                  <th style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>Nama Kolom</th>
                  <th style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>Tipe Data</th>
                  <th style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>Kategori</th>
                  <th style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>Sampel Nilai</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => {
                  const isNumeric = profile.numericColumns.includes(col);
                  const firstRow = filtered[0]?.__raw;
                  const sampleValue = firstRow ? String(firstRow[col] ?? "-") : "-";

                  return (
                    <tr key={col} style={{ borderBottom: "1px solid var(--cds-border-subtle-00)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 500, color: "var(--cds-text-primary)" }}>{col}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: isNumeric ? "rgba(15, 98, 254, 0.1)" : "rgba(138, 63, 252, 0.1)",
                          color: isNumeric ? "#0f62fe" : "#8a3ffc",
                          borderRadius: "4px",
                          padding: "0.125rem 0.375rem",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          fontFamily: "var(--font-ibm-plex-mono)"
                        }}>
                          <span>{isNumeric ? "#" : "abc"}</span>
                          <span style={{ textTransform: "lowercase", fontWeight: 400 }}>{isNumeric ? "number" : "string"}</span>
                        </span>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        <Tag type={isNumeric ? "blue" : "cool-gray"} size="sm" style={{ margin: 0 }}>
                          {isNumeric ? "Measure" : "Dimension"}
                        </Tag>
                      </td>
                      <td style={{ 
                        padding: "0.5rem 0.75rem", 
                        color: "var(--cds-text-helper)", 
                        fontFamily: "var(--font-ibm-plex-mono)", 
                        fontSize: "0.75rem", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap", 
                        maxWidth: "240px" 
                      }} title={sampleValue}>
                        {sampleValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Tile>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <AppDataTable data={filtered.map((r) => r.__raw)} columns={columns} />
      </div>
    </div>
  );
}
