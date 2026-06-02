"use client";

import type { ReactNode } from "react";
import {
  Button,
  DataTable,
  InlineNotification,
  OverflowMenu,
  OverflowMenuItem,
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
  { key: "iku_percentage", header: "IKU003 (%)" },
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
  children: ReactNode;
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

export function Iku003DashboardView({
  kpis,
  chartData,
  pieData,
  rankingTopRows,
  rankingBottomRows,
  insights,
  selectedTile,
  onSelectTile,
}: Props) {
  return (
    <>
      <section className="dashboard-grid dashboard-grid--kpi">
        <WorkspaceTile title="TOTAL PROGRAM STUDI" tileId="kpi-1" selectedTile={selectedTile} onSelect={onSelectTile}>
          <div className="workspace-kpi-value">{kpis.totalStudyProgram}</div>
        </WorkspaceTile>
        <WorkspaceTile title="TOTAL FAKULTAS" tileId="kpi-2" selectedTile={selectedTile} onSelect={onSelectTile}>
          <div className="workspace-kpi-value">{kpis.totalFaculty}</div>
        </WorkspaceTile>
        <WorkspaceTile title="TOTAL DOSEN TETAP" tileId="kpi-3" selectedTile={selectedTile} onSelect={onSelectTile}>
          <div className="workspace-kpi-value">{kpis.totalLecturers}</div>
        </WorkspaceTile>
        <WorkspaceTile title="RATA-RATA IKU003" tileId="kpi-4" selectedTile={selectedTile} onSelect={onSelectTile}>
          <div className="workspace-kpi-value">{kpis.avgIkuPercentage.toFixed(2)}%</div>
        </WorkspaceTile>
      </section>

      <section className="dashboard-grid dashboard-grid--two-col">
        <WorkspaceTile title="Persentase IKU per Prodi" tileId="chart-1" selectedTile={selectedTile} onSelect={onSelectTile}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis />
              <Tooltip
                content={<ChartTooltip />}
                wrapperStyle={{ opacity: 1 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              />
              <Bar dataKey="iku_percentage" fill={CDS_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </WorkspaceTile>
        <WorkspaceTile title="Distribusi IKU per Fakultas" tileId="chart-2" selectedTile={selectedTile} onSelect={onSelectTile}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="total" nameKey="faculty" innerRadius={80} outerRadius={120}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CDS_COLORS[i % CDS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={<ChartTooltip />}
                wrapperStyle={{ opacity: 1 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              />
              <Legend verticalAlign="bottom" wrapperStyle={CHART_LEGEND_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </WorkspaceTile>
      </section>

      <section className="dashboard-grid dashboard-grid--two-col">
        <WorkspaceTile title="Komponen IKU003" tileId="chart-3" selectedTile={selectedTile} onSelect={onSelectTile}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis />
              <Tooltip
                content={<ChartTooltip />}
                wrapperStyle={{ opacity: 1 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              />
              <Legend verticalAlign="top" wrapperStyle={CHART_LEGEND_STYLE} />
              <Bar dataKey="iku_017" stackId="stack" fill={CDS_COLORS[0]} />
              <Bar dataKey="iku_018" stackId="stack" fill={CDS_COLORS[1]} />
              <Bar dataKey="coaching_achievement" stackId="stack" fill={CDS_COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        </WorkspaceTile>
        <WorkspaceTile title="Total Dosen per Program" tileId="chart-4" selectedTile={selectedTile} onSelect={onSelectTile}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="study_program" hide />
              <YAxis />
              <Tooltip
                content={<ChartTooltip />}
                wrapperStyle={{ opacity: 1 }}
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                itemStyle={CHART_TOOLTIP_ITEM_STYLE}
              />
              <Bar dataKey="total_lecturers" fill={CDS_COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </WorkspaceTile>
      </section>

      <section className="dashboard-grid dashboard-grid--two-col">
        <WorkspaceTile title="Top 10 Prodi" tileId="table-1" selectedTile={selectedTile} onSelect={onSelectTile}>
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
        </WorkspaceTile>
        <WorkspaceTile title="Bottom 10 Prodi" tileId="table-2" selectedTile={selectedTile} onSelect={onSelectTile}>
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
  );
}
