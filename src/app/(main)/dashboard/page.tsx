"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  DataTable,
  Dropdown,
  InlineNotification,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  SkeletonPlaceholder,
  SkeletonText,
  TextInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Tile,
  Toggle,
  TreeNode,
  TreeView,
} from "@carbon/react";
import {
  Analytics,
  ChartBar,
  DataBase,
  Filter,
  Settings,
  Table as TableIcon,
  Upload,
  Undo,
  Redo,
} from "@carbon/icons-react";
import { useDashboardMetrics, useDashboardStore } from "@/store/dashboard-store";

const CDS_COLORS = ["#0f62fe", "#198038", "#8a3ffc", "#009d9a", "#ee538b", "#6929c4"];
const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#161616",
  border: "1px solid rgba(244, 244, 244, 0.32)",
  borderRadius: "4px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
  opacity: 1,
};
const CHART_TOOLTIP_LABEL_STYLE = { color: "#ffffff", fontWeight: 600 };
const CHART_TOOLTIP_ITEM_STYLE = { color: "#f4f4f4" };
const CHART_LEGEND_STYLE = { color: "#161616", fontWeight: 600 };
const tableHeaders = [
  { key: "study_program", header: "Program Studi" },
  { key: "faculty", header: "Fakultas" },
  { key: "iku_percentage", header: "IKU003 (%)" },
];
const activityItems = [
  { id: "data", label: "Data Source", icon: DataBase },
  { id: "visual", label: "Visualizations", icon: ChartBar },
  { id: "insights", label: "Insights", icon: Analytics },
  { id: "quality", label: "Data Quality", icon: TableIcon },
  { id: "upload", label: "Upload", icon: Upload },
] as const;

type ActivityId = (typeof activityItems)[number]["id"];
type ExistingConnectionOption = { id: string; label: string };

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: string | number; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid rgba(244, 244, 244, 0.32)",
        borderRadius: "4px",
        padding: "0.5rem 0.625rem",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
        opacity: 1,
      }}
    >
      {label !== undefined && (
        <div style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.25rem" }}>{String(label)}</div>
      )}
      {payload.map((entry, idx) => (
        <div key={`${entry.name || "item"}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#f4f4f4", fontSize: "0.75rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color || "#f4f4f4", flexShrink: 0 }} />
          <span>{entry.name || "Nilai"}:</span>
          <strong style={{ color: "#ffffff" }}>{String(entry.value ?? "-")}</strong>
        </div>
      ))}
    </div>
  );
}

function WorkspaceTile({
  title,
  tileId,
  selectedTile,
  onSelect,
  children,
}: {
  title: string;
  tileId: string;
  selectedTile: string;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Tile
      className={`workspace-tile${selectedTile === tileId ? " is-selected" : ""}`}
      onClick={() => onSelect(tileId)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(tileId);
        }
      }}
    >
      <div className="workspace-tile__header">
        <h4>{title}</h4>
        <OverflowMenu size="sm" ariaLabel={`${title} options`} onClick={(event) => event.stopPropagation()}>
          <OverflowMenuItem itemText="Configure" />
          <OverflowMenuItem itemText="Duplicate" />
          <OverflowMenuItem itemText="Export" />
          <OverflowMenuItem itemText="Remove" hasDivider isDelete />
        </OverflowMenu>
      </div>
      <div className="workspace-tile__body">{children}</div>
    </Tile>
  );
}

// ── Overview Dashboard Component (Carbon Standards) ──
function OverviewDashboard({
  kpis,
  hasValidData,
  threshold,
  onOpenUpload
}: {
  kpis: any;
  hasValidData: boolean;
  threshold: number;
  onOpenUpload: () => void;
}) {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {/* KPI Overview Tiles */}
      <section className="dashboard-grid dashboard-grid--kpi">
        <Tile className="iku-kpi-tile">
          <div className="iku-kpi-tile__label">Indikator Terintegrasi</div>
          <div className="iku-kpi-tile__value" style={{ color: "#0f62fe" }}>
            {hasValidData ? "1 / 7" : "0 / 7"}
          </div>
          <div className="iku-kpi-tile__subtext">IKU 003 aktif, lainnya siap dihubungkan</div>
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

      {/* IKU Catalog Table Tile */}
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
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>IKU 001</TableCell>
                <TableCell>Kesiapan Lulusan Mendapatkan Pekerjaan Layak</TableCell>
                <TableCell><Tag type="red">Belum Terhubung</Tag></TableCell>
                <TableCell style={{ fontFamily: "monospace" }}>-</TableCell>
                <TableCell>{renderChannelAction(false)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>IKU 002</TableCell>
                <TableCell>Mahasiswa Mendapatkan Pengalaman di Luar Kampus</TableCell>
                <TableCell><Tag type="red">Belum Terhubung</Tag></TableCell>
                <TableCell style={{ fontFamily: "monospace" }}>-</TableCell>
                <TableCell>{renderChannelAction(false)}</TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: "var(--cds-layer-hover-01)" }}>
                <TableCell style={{ fontWeight: 600, color: "#0f62fe" }}>IKU 003</TableCell>
                <TableCell style={{ fontWeight: 500 }}>Dosen Berkegiatan di Luar Kampus (Keaktifan Dosen Tetap)</TableCell>
                <TableCell>
                  <Tag type={hasValidData ? "green" : "red"}>
                    {hasValidData ? "Aktif & Terhubung" : "Belum Terhubung"}
                  </Tag>
                </TableCell>
                <TableCell style={{ fontWeight: 600, fontFamily: "monospace" }}>
                  {hasValidData ? `${kpis.avgIkuPercentage.toFixed(2)}%` : "-"}
                </TableCell>
                <TableCell>{renderChannelAction(hasValidData)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>IKU 005</TableCell>
                <TableCell>Hasil Kerja Dosen Digunakan Oleh Masyarakat (Riset &amp; Publikasi)</TableCell>
                <TableCell><Tag type="red">Belum Terhubung</Tag></TableCell>
                <TableCell style={{ fontFamily: "monospace" }}>-</TableCell>
                <TableCell>{renderChannelAction(false)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>IKU 007</TableCell>
                <TableCell>Kelas yang Kolaboratif dan Partisipatif (Case Method / Team Project)</TableCell>
                <TableCell><Tag type="red">Belum Terhubung</Tag></TableCell>
                <TableCell style={{ fontFamily: "monospace" }}>-</TableCell>
                <TableCell>{renderChannelAction(false)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>IKU 009</TableCell>
                <TableCell>Indikator Tambahan Institusi &amp; Internasionalisasi</TableCell>
                <TableCell><Tag type="red">Belum Terhubung</Tag></TableCell>
                <TableCell style={{ fontFamily: "monospace" }}>-</TableCell>
                <TableCell>{renderChannelAction(false)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Tile>
    </div>
  );
}

// ── Placeholder Connect Portal Component for other IKUs ──
function PlaceholderDashboard({
  ikuCode,
  title,
  description,
  onOpenUpload
}: {
  ikuCode: string;
  title: string;
  description: string;
  onOpenUpload: () => void;
}) {
  return (
    <Tile style={{ padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "420px", background: "var(--cds-layer-01)", border: "1px solid var(--cds-border-subtle-01)", borderRadius: "0", width: "100%" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--cds-layer-selected-01)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: "#0f62fe" }}>
        <Upload size={24} style={{ margin: "auto" }} />
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--cds-text-primary)", marginBottom: "0.5rem" }}>
        Dasbor {ikuCode} Belum Terhubung
      </h3>
      <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--cds-text-secondary)", marginBottom: "2rem", maxWidth: "560px", lineHeight: "1.4" }}>
        <strong>{title}</strong> — {description}
      </p>
      
      <div style={{ textAlign: "left", background: "var(--cds-layer-hover-01)", padding: "1.5rem", borderLeft: "4px solid #0f62fe", marginBottom: "2rem", maxWidth: "600px", width: "100%", borderRadius: "0" }}>
        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--cds-text-primary)", margin: "0 0 0.55rem 0" }}>
          Langkah Penyelarasan Data Sumber:
        </p>
        <ol style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)", paddingLeft: "1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <li>Pastikan berkas spreadsheets Anda memiliki format penamaan terstruktur baku: <code>{ikuCode}_[Fakultas]_[Nama_Koneksi].xlsx</code>.</li>
          <li>Pastikan nama header kolom skema utama terisi lengkap sesuai standar parameter KPI institusi.</li>
          <li>Klik tombol di bawah ini atau tombol tambah (+) di bagian atas panel <strong>Connected Sources</strong> di sebelah kiri untuk menyambungkan tautan Google Drive / Spreadsheet.</li>
        </ol>
      </div>

      <Button
        size="sm"
        renderIcon={Upload}
        onClick={onOpenUpload}
        iconDescription={`Hubungkan Data ${ikuCode}`}
      >
        Hubungkan Data {ikuCode}
      </Button>
    </Tile>
  );
}

function MainContentSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
        <Tile><SkeletonText heading width="70%" /><SkeletonText paragraph lineCount={2} width="90%" /></Tile>
        <Tile><SkeletonText heading width="70%" /><SkeletonText paragraph lineCount={2} width="90%" /></Tile>
        <Tile><SkeletonText heading width="70%" /><SkeletonText paragraph lineCount={2} width="90%" /></Tile>
        <Tile><SkeletonText heading width="70%" /><SkeletonText paragraph lineCount={2} width="90%" /></Tile>
      </div>
      <Tile style={{ minHeight: "220px" }}>
        <SkeletonText heading width="40%" />
        <SkeletonPlaceholder style={{ width: "100%", height: "160px", marginTop: "1rem" }} />
      </Tile>
      <Tile style={{ minHeight: "220px" }}>
        <SkeletonText heading width="40%" />
        <SkeletonPlaceholder style={{ width: "100%", height: "160px", marginTop: "1rem" }} />
      </Tile>
    </div>
  );
}

export default function DashboardPage() {
  const { kpis, chartData, rankingTop, rankingBottom, insights } = useDashboardMetrics();
  const { rows, columns, normalizedRows, filters, setFilter, resetFilters, kpiThreshold, setKpiThreshold, activeDashboardTab } = useDashboardStore();

  const [showFilterBar, setShowFilterBar] = useState(true);
  const [selectedTile, setSelectedTile] = useState("kpi-1");
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isConnectExistingModalOpen, setIsConnectExistingModalOpen] = useState(false);
  const [existingConnectionOptions, setExistingConnectionOptions] = useState<ExistingConnectionOption[]>([]);
  const [selectedExistingConnection, setSelectedExistingConnection] = useState<ExistingConnectionOption | null>(null);
  const previousTabRef = useRef(activeDashboardTab);

  const hasValidData = rows.length > 0 && chartData.length > 0;

  useEffect(() => {
    const handler = () => setShowFilterBar((prev) => !prev);
    window.addEventListener("dashboard:toggle-filters", handler);
    return () => window.removeEventListener("dashboard:toggle-filters", handler);
  }, []);

  useEffect(() => {
    if (previousTabRef.current === activeDashboardTab) {
      return;
    }
    previousTabRef.current = activeDashboardTab;
    setIsSwitchLoading(true);
    const timeout = window.setTimeout(() => {
      setIsSwitchLoading(false);
    }, 280);
    return () => window.clearTimeout(timeout);
  }, [activeDashboardTab]);

  useEffect(() => {
    const raw = localStorage.getItem("iku-sheet-connections");
    if (!raw) {
      setExistingConnectionOptions([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setExistingConnectionOptions([]);
        return;
      }
      const options = parsed.flatMap((conn: any) => {
        const root = {
          id: conn.id,
          label: conn.type === "folder" ? `${conn.name} (Folder)` : `${conn.name} (Sheet)`,
        };
        const files = Array.isArray(conn.files)
          ? conn.files.map((f: any) => ({ id: f.id, label: `${f.name} (${conn.name})` }))
          : [];
        return [root, ...files];
      }) as ExistingConnectionOption[];
      setExistingConnectionOptions(options);
    } catch {
      setExistingConnectionOptions([]);
    }
  }, [isConnectExistingModalOpen]);

  const years = [...new Set(normalizedRows.map((r) => r.year).filter(Boolean))] as string[];
  const faculties = [...new Set(normalizedRows.map((r) => r.faculty).filter(Boolean))] as string[];
  const degrees = [...new Set(normalizedRows.map((r) => r.degree).filter(Boolean))] as string[];

  const pieData = useMemo(
    () =>
      Object.values(
        chartData.reduce<Record<string, { faculty: string; total: number }>>((acc, item) => {
          if (!acc[item.faculty]) acc[item.faculty] = { faculty: item.faculty, total: 0 };
          acc[item.faculty].total += 1;
          return acc;
        }, {}),
      ),
    [chartData],
  );

  const openUploadModal = () => {
    setSelectedExistingConnection(null);
    setIsConnectExistingModalOpen(true);
  };

  const handleConnectExistingSource = () => {
    if (!selectedExistingConnection) return;
    window.dispatchEvent(
      new CustomEvent("app:select-source", {
        detail: { sourceId: selectedExistingConnection.id },
      }),
    );
    setIsConnectExistingModalOpen(false);
  };

  // Helper dictionary mapping IKU codes to their details
  const ikuDetails: Record<string, { title: string; description: string }> = {
    "IKU 001": {
      title: "Lulusan Mendapatkan Pekerjaan Layak",
      description: "Mengukur persentase mahasiswa jenjang diploma dan sarjana yang berhasil mendapatkan pekerjaan layak dengan pendapatan di atas UMR, melanjutkan studi ke jenjang yang lebih tinggi, atau berwirausaha secara mandiri dalam waktu 12 bulan setelah kelulusan."
    },
    "IKU 002": {
      title: "Mahasiswa Mendapatkan Pengalaman di Luar Kampus",
      description: "Mengukur persentase mahasiswa aktif yang menghabiskan minimal 20 SKS di luar prodi asal melalui program MBKM seperti magang industri, proyek desa, wirausaha, mengajar di sekolah, pertukaran pelajar, penelitian, atau berprestasi di tingkat nasional/internasional."
    },
    "IKU 005": {
      title: "Hasil Kerja Dosen Digunakan Oleh Masyarakat",
      description: "Mengukur persentase dosen tetap yang hasil riset, kepakaran, karya ilmiah bereputasi, produk paten/hak cipta, atau buku ajar miliknya berhasil diaplikasikan secara nyata oleh dunia industri, masyarakat umum, atau sebagai dasar perumusan kebijakan publik."
    },
    "IKU 007": {
      title: "Kelas yang Kolaboratif dan Partisipatif",
      description: "Mengukur persentase mata kuliah program sarjana dan diploma yang dinilai interaktif menggunakan metode pembelajaran berbasis kasus nyata (Case Method) atau berbasis proyek kelompok kolaboratif (Team-Based Project)."
    },
    "IKU 009": {
      title: "Kategori Tambahan & Internasionalisasi Institusi",
      description: "Mengukur akreditasi internasional program studi, tingkat keaktifan kemitraan global universitas, serta penjaminan mutu tata kelola lembaga pendidikan tinggi berbasis standar global terintegrasi."
    }
  };

  return (
    <>
      {isSwitchLoading && <MainContentSkeleton />}

      {/* View 1: Overview Dashboard */}
      {!isSwitchLoading && activeDashboardTab === "Overview" && (
        <OverviewDashboard
          kpis={kpis}
          hasValidData={hasValidData}
          threshold={kpiThreshold}
          onOpenUpload={openUploadModal}
        />
      )}

      {/* View 2: Detailed IKU 003 Dashboard */}
      {!isSwitchLoading && activeDashboardTab === "IKU 003" && (
        <>
          {showFilterBar && (
            <div className="dashboard-filter-inline">
              <Dropdown
                id="filter-year"
                titleText=""
                label="Filter: Tahun"
                size="sm"
                items={["Semua Tahun", ...years]}
                selectedItem={filters.year || "Semua Tahun"}
                onChange={({ selectedItem }) => setFilter("year", selectedItem === "Semua Tahun" ? "" : String(selectedItem || ""))}
              />
              <Dropdown
                id="filter-faculty"
                titleText=""
                label="Filter: Fakultas"
                size="sm"
                items={["Semua Fakultas", ...faculties]}
                selectedItem={filters.faculty || "Semua Fakultas"}
                onChange={({ selectedItem }) => setFilter("faculty", selectedItem === "Semua Fakultas" ? "" : String(selectedItem || ""))}
              />
              <Dropdown
                id="filter-degree"
                titleText=""
                label="Filter: Jenjang"
                size="sm"
                items={["Semua Jenjang", ...degrees]}
                selectedItem={filters.degree || "Semua Jenjang"}
                onChange={({ selectedItem }) => setFilter("degree", selectedItem === "Semua Jenjang" ? "" : String(selectedItem || ""))}
              />
              <Search
                id="filter-search"
                size="sm"
                labelText="Search prodi"
                placeholder="Search prodi"
                value={filters.search}
                onChange={(event) => setFilter("search", event.currentTarget.value)}
              />
              <Button kind="ghost" size="sm" onClick={resetFilters}>Reset</Button>
            </div>
          )}

          {(filters.year || filters.faculty || filters.degree) && (
            <div className="dashboard-filter-chips">
              {filters.year && <Tag type="gray">Tahun: {filters.year}</Tag>}
              {filters.faculty && <Tag type="gray">Fakultas: {filters.faculty}</Tag>}
              {filters.degree && <Tag type="gray">Jenjang: {filters.degree}</Tag>}
            </div>
          )}

          {hasValidData && (
            <>
              <section className="dashboard-grid dashboard-grid--kpi">
                <WorkspaceTile title="TOTAL PROGRAM STUDI" tileId="kpi-1" selectedTile={selectedTile} onSelect={setSelectedTile}><div className="workspace-kpi-value">{kpis.totalStudyProgram}</div></WorkspaceTile>
                <WorkspaceTile title="TOTAL FAKULTAS" tileId="kpi-2" selectedTile={selectedTile} onSelect={setSelectedTile}><div className="workspace-kpi-value">{kpis.totalFaculty}</div></WorkspaceTile>
                <WorkspaceTile title="TOTAL DOSEN TETAP" tileId="kpi-3" selectedTile={selectedTile} onSelect={setSelectedTile}><div className="workspace-kpi-value">{kpis.totalLecturers}</div></WorkspaceTile>
                <WorkspaceTile title="RATA-RATA IKU003" tileId="kpi-4" selectedTile={selectedTile} onSelect={setSelectedTile}><div className="workspace-kpi-value">{kpis.avgIkuPercentage.toFixed(2)}%</div></WorkspaceTile>
              </section>

              <section className="dashboard-grid dashboard-grid--two-col">
                <WorkspaceTile title="Persentase IKU per Prodi" tileId="chart-1" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <ResponsiveContainer width="100%" height={320}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /><XAxis dataKey="study_program" hide /><YAxis /><Tooltip content={<ChartTooltip />} wrapperStyle={{ opacity: 1 }} contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE} /><Bar dataKey="iku_percentage" fill={CDS_COLORS[0]} /></BarChart></ResponsiveContainer>
                </WorkspaceTile>
                <WorkspaceTile title="Distribusi IKU per Fakultas" tileId="chart-2" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <ResponsiveContainer width="100%" height={320}><PieChart><Pie data={pieData} dataKey="total" nameKey="faculty" innerRadius={80} outerRadius={120}>{pieData.map((_, i) => <Cell key={i} fill={CDS_COLORS[i % CDS_COLORS.length]} />)}</Pie><Tooltip content={<ChartTooltip />} wrapperStyle={{ opacity: 1 }} contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE} /><Legend verticalAlign="bottom" wrapperStyle={CHART_LEGEND_STYLE} /></PieChart></ResponsiveContainer>
                </WorkspaceTile>
              </section>

              <section className="dashboard-grid dashboard-grid--two-col">
                <WorkspaceTile title="Komponen IKU003" tileId="chart-3" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <ResponsiveContainer width="100%" height={320}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /><XAxis dataKey="study_program" hide /><YAxis /><Tooltip content={<ChartTooltip />} wrapperStyle={{ opacity: 1 }} contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE} /><Legend verticalAlign="top" wrapperStyle={CHART_LEGEND_STYLE} /><Bar dataKey="iku_017" stackId="stack" fill={CDS_COLORS[0]} /><Bar dataKey="iku_018" stackId="stack" fill={CDS_COLORS[1]} /><Bar dataKey="coaching_achievement" stackId="stack" fill={CDS_COLORS[2]} /></BarChart></ResponsiveContainer>
                </WorkspaceTile>
                <WorkspaceTile title="Total Dosen per Program" tileId="chart-4" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <ResponsiveContainer width="100%" height={320}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /><XAxis dataKey="study_program" hide /><YAxis /><Tooltip content={<ChartTooltip />} wrapperStyle={{ opacity: 1 }} contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE} /><Bar dataKey="total_lecturers" fill={CDS_COLORS[3]} /></BarChart></ResponsiveContainer>
                </WorkspaceTile>
              </section>

              <section className="dashboard-grid dashboard-grid--two-col">
                <WorkspaceTile title="Top 10 Prodi" tileId="table-1" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <DataTable rows={rankingTop.slice(0, 10).map((r, i) => ({ id: `top-${i}`, ...r, iku_percentage: (r.iku_percentage ?? 0).toFixed(2) }))} headers={tableHeaders}>
                    {({ rows, headers, getHeaderProps, getRowProps, getTableContainerProps, getTableProps }) => (
                      <TableContainer {...getTableContainerProps()}>
                        <Table {...getTableProps()} size="sm"><TableHead><TableRow>{headers.map((header) => {
                          const headerProps = getHeaderProps({ header });
                          const { key, ...rest } = headerProps;
                          return <TableHeader key={String(key ?? header.key)} {...rest}>{header.header}</TableHeader>;
                        })}</TableRow></TableHead><TableBody>{rows.map((row) => {
                          const rowProps = getRowProps({ row });
                          return <TableRow {...rowProps}>{row.cells.map((cell) => <TableCell key={cell.id}>{cell.value}</TableCell>)}</TableRow>;
                        })}</TableBody></Table>
                      </TableContainer>
                    )}
                  </DataTable>
                </WorkspaceTile>
                <WorkspaceTile title="Bottom 10 Prodi" tileId="table-2" selectedTile={selectedTile} onSelect={setSelectedTile}>
                  <DataTable rows={rankingBottom.slice(0, 10).map((r, i) => ({ id: `bot-${i}`, ...r, iku_percentage: (r.iku_percentage ?? 0).toFixed(2) }))} headers={tableHeaders}>
                    {({ rows, headers, getHeaderProps, getRowProps, getTableContainerProps, getTableProps }) => (
                      <TableContainer {...getTableContainerProps()}>
                        <Table {...getTableProps()} size="sm"><TableHead><TableRow>{headers.map((header) => {
                          const headerProps = getHeaderProps({ header });
                          const { key, ...rest } = headerProps;
                          return <TableHeader key={String(key ?? header.key)} {...rest}>{header.header}</TableHeader>;
                        })}</TableRow></TableHead><TableBody>{rows.map((row) => {
                          const rowProps = getRowProps({ row });
                          return <TableRow {...rowProps}>{row.cells.map((cell) => <TableCell key={cell.id}>{cell.value}</TableCell>)}</TableRow>;
                        })}</TableBody></Table>
                      </TableContainer>
                    )}
                  </DataTable>
                </WorkspaceTile>
              </section>

              <section style={{ width: "100%" }}>
                <InlineNotification
                  kind="info"
                  title="Insight Ringkas"
                  subtitle={`Fakultas terbaik: ${insights.topFaculty?.faculty ?? "-"}. Prodi terbaik: ${insights.topProgram?.study_program ?? "-"}. Prodi terendah: ${insights.bottomProgram?.study_program ?? "-"}. Di bawah target ${insights.threshold}%: ${insights.belowThreshold.length} prodi.`}
                  lowContrast
                  hideCloseButton
                />
              </section>
            </>
          )}
        </>
      )}

      {/* View 3: Other IKUs Placeholder Connect Portals */}
      {!isSwitchLoading && activeDashboardTab !== "Overview" && activeDashboardTab !== "IKU 003" && ikuDetails[activeDashboardTab] && (
        <PlaceholderDashboard
          ikuCode={activeDashboardTab}
          title={ikuDetails[activeDashboardTab].title}
          description={ikuDetails[activeDashboardTab].description}
          onOpenUpload={openUploadModal}
        />
      )}

      <Modal
        open={isConnectExistingModalOpen}
        modalHeading="Pilih Koneksi Data Eksisting"
        primaryButtonText="Gunakan Koneksi"
        secondaryButtonText="Batal"
        onRequestClose={() => setIsConnectExistingModalOpen(false)}
        onRequestSubmit={handleConnectExistingSource}
        primaryButtonDisabled={!selectedExistingConnection}
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "0.25rem" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--cds-text-secondary)", lineHeight: 1.5 }}>
            Pilih sumber data yang sudah terhubung untuk langsung digunakan pada dashboard ini.
          </p>
          <Dropdown
            id="overview-existing-connection"
            titleText="Daftar Koneksi"
            label={existingConnectionOptions.length > 0 ? "Pilih sumber data yang sudah terkoneksi" : "Belum ada koneksi tersimpan"}
            items={existingConnectionOptions}
            itemToString={(item) => item?.label || ""}
            selectedItem={selectedExistingConnection}
            onChange={({ selectedItem }) => setSelectedExistingConnection((selectedItem as ExistingConnectionOption) || null)}
            disabled={existingConnectionOptions.length === 0}
            size="md"
          />
        </div>
      </Modal>
    </>
  );
}
