"use client";

import {
  DataTable,
  InlineNotification,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";
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
  { key: "iku_percentage", header: "IKU 003 (%)" },
];

type TableRowItem = {
  id: string;
  study_program?: string;
  faculty?: string;
  iku_percentage: string;
};

type Props = {
  kpis: {
    totalStudyProgram: number;
    totalFaculty: number;
    totalLecturers: number;
    avgIkuPercentage: number;
  };
  chartData: Array<Record<string, string | number>>;
  pieData: Array<{ faculty: string; total: number }>;
  rankingTopRows: TableRowItem[];
  rankingBottomRows: TableRowItem[];
  insights: {
    topFaculty?: { faculty?: string };
    topProgram?: { study_program?: string };
    bottomProgram?: { study_program?: string };
    belowThreshold: string[];
    threshold: number;
  };
  selectedTile: string;
  onSelectTile: (id: string) => void;
};

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
        <div style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          {String(label)}
        </div>
      )}
      {payload.map((entry, idx) => (
        <div
          key={`${entry.name || "item"}-${idx}`}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#f4f4f4", fontSize: "0.75rem" }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: entry.color || "#f4f4f4",
              flexShrink: 0,
            }}
          />
          <span>{entry.name || "Nilai"}:</span>
          <strong style={{ color: "#ffffff" }}>{String(entry.value ?? "-")}</strong>
        </div>
      ))}
    </div>
  );
}

export function Iku003DashboardView({
  kpis,
  chartData,
  pieData,
  rankingTopRows,
  rankingBottomRows,
  insights,
}: Omit<Props, "selectedTile" | "onSelectTile">) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {/* KPI Summary Tiles */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <Tile>
          <div className="iku-kpi-tile__label">Total Program Studi</div>
          <div className="iku-kpi-tile__value">{kpis.totalStudyProgram}</div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Total Fakultas</div>
          <div className="iku-kpi-tile__value">{kpis.totalFaculty}</div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Total Dosen Tetap</div>
          <div className="iku-kpi-tile__value">{kpis.totalLecturers}</div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Rata-rata IKU 003</div>
          <div className="iku-kpi-tile__value" style={{ color: "#0f62fe" }}>
            {kpis.avgIkuPercentage.toFixed(2)}%
          </div>
        </Tile>
      </section>

      {/* Main Charts */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Persentase Capaian IKU per Program Studi</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="iku_percentage" fill={CDS_COLORS[0]} name="Capaian IKU (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>

        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Distribusi Capaian IKU per Fakultas</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="total" nameKey="faculty" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CDS_COLORS[i % CDS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend verticalAlign="bottom" wrapperStyle={CHART_LEGEND_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </Tile>
      </section>

      {/* Stacked Component Charts & Total Lecturers */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Komponen Kategori Penunjang IKU 003</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={CHART_LEGEND_STYLE} />
              <Bar dataKey="iku_017" stackId="stack" fill={CDS_COLORS[0]} name="IK-017 (Tridharma)" />
              <Bar dataKey="iku_018" stackId="stack" fill={CDS_COLORS[1]} name="IK-018 (Praktisi)" />
              <Bar dataKey="coaching_achievement" stackId="stack" fill={CDS_COLORS[2]} name="Membina Mahasiswa" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>

        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Total Dosen Tetap per Program Studi</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="total_lecturers" fill={CDS_COLORS[3]} name="Jumlah Dosen" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>
      </section>

      {/* Top 10 and Bottom 10 Program Study Tables */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Top 10 Program Studi Terbaik</h4>
          <DataTable rows={rankingTopRows} headers={tableHeaders}>
            {({ rows, headers, getHeaderProps, getRowProps, getTableContainerProps, getTableProps }) => (
              <TableContainer {...getTableContainerProps()}>
                <Table {...getTableProps()} size="sm">
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => {
                        const headerProps = getHeaderProps({ header });
                        const { key, ...rest } = headerProps;
                        return (
                          <TableHeader key={String(key ?? header.key)} {...rest}>
                            {header.header}
                          </TableHeader>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const rowProps = getRowProps({ row });
                      const { key, ...rest } = rowProps;
                      return (
                        <TableRow key={String(key ?? row.id)} {...rest}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Tile>

        <Tile>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Bottom 10 Program Studi Terendah</h4>
          <DataTable rows={rankingBottomRows} headers={tableHeaders}>
            {({ rows, headers, getHeaderProps, getRowProps, getTableContainerProps, getTableProps }) => (
              <TableContainer {...getTableContainerProps()}>
                <Table {...getTableProps()} size="sm">
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => {
                        const headerProps = getHeaderProps({ header });
                        const { key, ...rest } = headerProps;
                        return (
                          <TableHeader key={String(key ?? header.key)} {...rest}>
                            {header.header}
                          </TableHeader>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const rowProps = getRowProps({ row });
                      const { key, ...rest } = rowProps;
                      return (
                        <TableRow key={String(key ?? row.id)} {...rest}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Tile>
      </section>

      {/* Automated Insight Notification */}
      <section style={{ width: "100%" }}>
        <InlineNotification
          kind="info"
          title="Analisis Insight Ringkas IKU 003"
          subtitle={`Fakultas dengan rata-rata kinerja terbaik diraih oleh ${insights.topFaculty?.faculty ?? "-"}. Program Studi dengan capaian tertinggi diraih oleh ${insights.topProgram?.study_program ?? "-"}, sedangkan capaian terendah berada pada ${insights.bottomProgram?.study_program ?? "-"}. Sebanyak ${insights.belowThreshold.length} program studi masih berada di bawah target keberhasilan ${insights.threshold}%.`}
          lowContrast
          hideCloseButton
        />
      </section>
    </div>
  );
}
