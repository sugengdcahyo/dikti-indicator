import type { DataProfile } from "@/types/data";
import { Tag } from "@carbon/react";

export function QualitySummary({ profile }: { profile: DataProfile | null }) {
  if (!profile) {
    return (
      <div
        style={{
          background: "var(--cds-layer-01)",
          border: "1px solid var(--cds-border-subtle-01)",
          borderRadius: "4px",
          padding: "1rem",
          fontSize: "0.875rem",
          color: "var(--cds-text-secondary)",
        }}
      >
        Belum ada data. Upload file terlebih dahulu.
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--cds-layer-01)",
    border: "1px solid var(--cds-border-subtle-01)",
    borderRadius: "4px",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    padding: "0.625rem 1rem",
    borderBottom: "1px solid var(--cds-border-subtle-01)",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    color: "var(--cds-text-secondary)",
  };

  const bodyStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    fontSize: "0.8125rem",
    color: "var(--cds-text-primary)",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: "0.25rem",
    borderBottom: "1px solid var(--cds-border-subtle-00)",
  };

  return (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2, 1fr)" }}>
      {/* Summary Card */}
      <div style={cardStyle}>
        <div style={headerStyle}>Ringkasan Profil Data</div>
        <div style={bodyStyle}>
          <div style={rowStyle}>
            <span style={{ color: "var(--cds-text-secondary)" }}>Total Baris</span>
            <strong>{profile.totalRows}</strong>
          </div>
          <div style={rowStyle}>
            <span style={{ color: "var(--cds-text-secondary)" }}>Total Kolom</span>
            <strong>{profile.totalColumns}</strong>
          </div>
          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <span style={{ color: "var(--cds-text-secondary)" }}>Baris Duplikat</span>
            <Tag type={profile.duplicateRows > 0 ? "warm-gray" : "green"} size="sm">
              {profile.duplicateRows}
            </Tag>
          </div>
        </div>
      </div>

      {/* Column Classification Card */}
      <div style={cardStyle}>
        <div style={headerStyle}>Klasifikasi Kolom</div>
        <div style={{ ...bodyStyle, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--cds-text-secondary)",
                marginBottom: "0.375rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Numerik
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
              {profile.numericColumns.map((c) => (
                <Tag key={c} type="blue" size="sm">
                  {c}
                </Tag>
              ))}
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--cds-text-secondary)",
                marginBottom: "0.375rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Kategorikal
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
              {profile.categoricalColumns.map((c) => (
                <Tag key={c} type="cool-gray" size="sm">
                  {c}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Missing Values Table */}
      <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
        <div style={headerStyle}>Missing Value per Kolom</div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              fontSize: "0.8125rem",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--cds-layer-02)",
                  borderBottom: "1px solid var(--cds-border-subtle-01)",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    fontWeight: 600,
                    color: "var(--cds-text-secondary)",
                    fontSize: "0.75rem",
                  }}
                >
                  Kolom
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 1rem",
                    fontWeight: 600,
                    color: "var(--cds-text-secondary)",
                    fontSize: "0.75rem",
                  }}
                >
                  Missing
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 1rem",
                    fontWeight: 600,
                    color: "var(--cds-text-secondary)",
                    fontSize: "0.75rem",
                  }}
                >
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {profile.missingByColumn.map((item) => (
                <tr
                  key={item.column}
                  style={{ borderBottom: "1px solid var(--cds-border-subtle-00)" }}
                >
                  <td
                    style={{ padding: "0.5rem 1rem", color: "var(--cds-text-primary)" }}
                  >
                    {item.column}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      textAlign: "right",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    {item.missing}
                  </td>
                  <td style={{ padding: "0.5rem 1rem", textAlign: "right" }}>
                    <Tag
                      type={item.percentage > 10 ? "red" : item.percentage > 0 ? "warm-gray" : "green"}
                      size="sm"
                    >
                      {item.percentage.toFixed(2)}%
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
