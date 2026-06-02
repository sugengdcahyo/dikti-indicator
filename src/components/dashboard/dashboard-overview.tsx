"use client";

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tag, Tile } from "@carbon/react";
import { overviewDashboardItems, type DashboardTabConnection } from "@/lib/dashboard-config";

type OverviewKpis = {
  totalStudyProgram: number;
  avgIkuPercentage: number;
};

type Props = {
  kpis: OverviewKpis;
  hasValidData: boolean;
  threshold: number;
  onOpenUpload: () => void;
  dashboardConnections: DashboardTabConnection[];
};

export function DashboardOverview({ kpis, hasValidData, threshold, onOpenUpload, dashboardConnections }: Props) {
  const renderChannelAction = (isConnected: boolean) => {
    if (isConnected) {
      return (
        <Button kind="tertiary" size="sm" onClick={onOpenUpload}>
          Kelola Koneksi
        </Button>
      );
    }

    return (
      <Button kind="ghost" size="sm" onClick={onOpenUpload}>
        Hubungkan
      </Button>
    );
  };

  const connectionsByTab = new Map(dashboardConnections.map((connection) => [connection.dashboardTab, connection]));
  const overviewRows = overviewDashboardItems.map((item) => {
    const mappedConnection = connectionsByTab.get(item.tab);
    const isConnected = Boolean(mappedConnection);
    const sourceLabel = mappedConnection?.sourceLabel || "";
    const metricValue = item.tab === "IKU 003" && isConnected && hasValidData ? `${kpis.avgIkuPercentage.toFixed(2)}%` : "-";

    return {
      ...item,
      isConnected,
      sourceLabel,
      metricValue,
    };
  });
  const connectedCount = overviewRows.filter((item) => item.isConnected).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <section className="dashboard-grid dashboard-grid--kpi">
        <Tile className="iku-kpi-tile">
          <div className="iku-kpi-tile__label">Indikator Terintegrasi</div>
          <div className="iku-kpi-tile__value" style={{ color: "#0f62fe" }}>
            {connectedCount} / {overviewRows.length}
          </div>
          <div className="iku-kpi-tile__subtext">Mengikuti pemetaan koneksi dashboard per indikator</div>
        </Tile>
        <Tile className="iku-kpi-tile">
          <div className="iku-kpi-tile__label">Total Program Studi</div>
          <div className="iku-kpi-tile__value">{hasValidData ? kpis.totalStudyProgram : 0}</div>
          <div className="iku-kpi-tile__subtext">Terpantau aktif dalam sistem</div>
        </Tile>
        <Tile className="iku-kpi-tile">
          <div className="iku-kpi-tile__label">Rata-rata Kinerja (IKU 003)</div>
          <div className="iku-kpi-tile__value" style={{ color: hasValidData && kpis.avgIkuPercentage >= threshold ? "#198038" : "inherit" }}>
            {hasValidData ? `${kpis.avgIkuPercentage.toFixed(2)}%` : "0.00%"}
          </div>
          <div className="iku-kpi-tile__subtext">Target kelulusan ambang batas: {threshold}%</div>
        </Tile>
        <Tile className="iku-kpi-tile">
          <div className="iku-kpi-tile__label">Status Integrasi</div>
          <div className="iku-kpi-tile__value" style={{ fontSize: "1.25rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.375rem", minHeight: "auto", margin: "0.375rem 0" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: hasValidData ? "#198038" : "#da1e28", display: "inline-block" }} />
            {hasValidData ? "Sinkron Terjaga" : "Menunggu Data"}
          </div>
          <div className="iku-kpi-tile__subtext">{hasValidData ? "Pembaruan real-time terdeteksi" : "Hubungkan data di samping"}</div>
        </Tile>
      </section>

      <Tile style={{ padding: "1.5rem", background: "var(--cds-layer-01)", border: "1px solid var(--cds-border-subtle-01)", borderRadius: "0" }}>
        <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--cds-text-primary)" }}>
          Daftar Pencapaian Indikator Kinerja Utama (IKU) Universitas
        </h4>
        <div style={{ overflowX: "auto" }}>
          <Table size="lg">
            <TableHead>
              <TableRow>
                <TableHeader>Indikator</TableHeader>
                <TableHeader>Deskripsi Kinerja Utama</TableHeader>
                <TableHeader>Status Sumber</TableHeader>
                <TableHeader>Capaian Rata-Rata</TableHeader>
                <TableHeader>Aksi Saluran</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {overviewRows.map((item) => (
                <TableRow
                  key={item.tab}
                  style={item.tab === "IKU 003" ? { backgroundColor: "var(--cds-layer-hover-01)" } : undefined}
                >
                  <TableCell style={{ fontWeight: 600, color: item.tab === "IKU 003" ? "#0f62fe" : undefined }}>
                    {item.tab}
                  </TableCell>
                  <TableCell style={item.tab === "IKU 003" ? { fontWeight: 500 } : undefined}>{item.title}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
                      <Tag type={item.isConnected ? "green" : "red"}>
                        {item.isConnected ? "Aktif & Terhubung" : "Belum Terhubung"}
                      </Tag>
                      {item.sourceLabel ? (
                        <span style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>{item.sourceLabel}</span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell style={{ fontWeight: item.metricValue !== "-" ? 600 : undefined, fontFamily: "monospace" }}>
                    {item.metricValue}
                  </TableCell>
                  <TableCell>{renderChannelAction(item.isConnected)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Tile>
    </div>
  );
}
