"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  InlineNotification,
  Tile,
  Tag,
  Button,
  Loading,
  Dropdown,
  Search,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  SkeletonText,
  SkeletonPlaceholder
} from "@carbon/react";
import { Filter, Download } from "@carbon/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import type { RawRow } from "@/types/data";

type Props = {
  rows: RawRow[];
  parseStatus: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
};

type ParsedRow = {
  year: string;
  faculty: string;
  studyProgram: string;
  degree: string;
  totalGraduates: number;
  respondentTs: number;
  work6mG: number;
  work1yG: number;
  work1yL: number;
  study: number;
  entrepreneur: number;
  unemployed: number;
  untracked: number;
  // Computed fields
  totalWorking: number;
  totalSuccess: number; // Bekerja + Lanjut Studi + Wirausaha
  ikuPercentage: number;
  responseRate: number;
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#161616",
  border: "1px solid rgba(244, 244, 244, 0.32)",
  borderRadius: "4px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
  opacity: 1
};

const PIE_COLORS = ["#0f62fe", "#8a3ffc", "#198038", "#ee538b", "#6f6f6f"];
const PIE_LABELS = ["Bekerja", "Lanjut Studi", "Wirausaha", "Belum Bekerja", "Tidak Terlacak"];

function Iku002ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: string | number; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={CHART_TOOLTIP_STYLE}>
      {label !== undefined && (
        <div style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          {String(label)}
        </div>
      )}
      {payload.map((entry, idx) => (
        <div key={`${entry.name || "item"}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#f4f4f4", fontSize: "0.75rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color || "#f4f4f4", flexShrink: 0 }} />
          <span>{entry.name || "Nilai"}:</span>
          <strong style={{ color: "#ffffff" }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString("id-ID") : String(entry.value ?? "-")}
          </strong>
        </div>
      ))}
    </div>
  );
}

const findColumn = (columns: string[], patterns: RegExp[], fallback = "") => {
  for (const pattern of patterns) {
    const found = columns.find((c) => pattern.test(c.toLowerCase()));
    if (found) return found;
  }
  return fallback;
};

const toNum = (v: unknown) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, ".").replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const toStr = (v: unknown) => (v == null ? "" : String(v).trim());

export function Iku002Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Tile style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Loading withOverlay={false} small description="Memuat data IKU 002..." />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <strong style={{ fontSize: "0.875rem", color: "var(--cds-text-primary)" }}>Memuat data IKU 002</strong>
          <span style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>
            Sedang mengurai spreadsheet dan menyiapkan visualisasi tracer study.
          </span>
        </div>
      </Tile>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Tile key={idx}><SkeletonText heading width="70%" /><SkeletonText paragraph lineCount={2} width="90%" /></Tile>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Tile><SkeletonPlaceholder style={{ width: "100%", height: "280px" }} /></Tile>
        <Tile><SkeletonPlaceholder style={{ width: "100%", height: "280px" }} /></Tile>
      </div>
    </div>
  );
}

export function Iku002Dashboard({ rows, parseStatus, errorMessage }: Props) {
  const { data: sheetRows, isLoading } = useSWR(["iku002-source", rows.length], async () => rows, {
    revalidateOnFocus: false,
    keepPreviousData: true
  });

  const parsed = useMemo(() => {
    if (!sheetRows || sheetRows.length === 0) return [] as ParsedRow[];

    const cols = Object.keys(sheetRows[0]);

    const yearCol = findColumn(cols, [/^tahun$/, /year/]);
    const facCol = findColumn(cols, [/fakultas/, /faculty/]);
    const prodiCol = findColumn(cols, [/prodi/, /program.*studi/, /study.*program/]);
    const degreeCol = findColumn(cols, [/jenjang/, /degree/]);
    const totalGradCol = findColumn(cols, [/total.*lulusan/, /jumlah.*lulusan/, /graduates/]);
    const respondentCol = findColumn(cols, [/responden.*ts/, /responden/, /tracer.*study/]);
    const work6mGCol = findColumn(cols, [/bekerja.*<6.*>1\.2/, /bekerja.*6.*bulan.*>/, /<6.*bulan/]);
    const work1yGCol = findColumn(cols, [/bekerja.*<1.*>1\.2/, /bekerja.*1.*tahun.*>/, /<1.*tahun.*>/]);
    const work1yLCol = findColumn(cols, [/bekerja.*<1.*<1\.2/, /bekerja.*1.*tahun.*</, /<1.*tahun.*</]);
    const studyCol = findColumn(cols, [/lanjut.*studi/, /studi.*lanjut/, /wira.*usaha.*tidak/, /lanjut/]);
    const entrepreneurCol = findColumn(cols, [/wirausaha/, /entrepreneur/]);
    const unemployedCol = findColumn(cols, [/belum.*bekerja/, /unemployed/]);
    const untrackedCol = findColumn(cols, [/tidak.*terlacak/, /untracked/]);

    if (!yearCol || !facCol || !prodiCol || !totalGradCol) return [];

    return sheetRows.map((row) => {
      const year = toStr(row[yearCol]);
      const faculty = toStr(row[facCol]);
      const studyProgram = toStr(row[prodiCol]);
      const degree = toStr(row[degreeCol]);

      const totalGraduates = Math.max(0, toNum(row[totalGradCol]));
      const respondentTs = Math.max(0, toNum(row[respondentCol]));
      const work6mG = Math.max(0, toNum(row[work6mGCol]));
      const work1yG = Math.max(0, toNum(row[work1yGCol]));
      const work1yL = Math.max(0, toNum(row[work1yLCol]));
      const study = Math.max(0, toNum(row[studyCol]));
      const entrepreneur = Math.max(0, toNum(row[entrepreneurCol]));
      const unemployed = Math.max(0, toNum(row[unemployedCol]));
      const untracked = Math.max(0, toNum(row[untrackedCol]));

      const totalWorking = work6mG + work1yG + work1yL;
      const totalSuccess = totalWorking + study + entrepreneur;
      const ikuPercentage = totalGraduates > 0 ? (totalSuccess / totalGraduates) * 100 : 0;
      const responseRate = totalGraduates > 0 ? (respondentTs / totalGraduates) * 100 : 0;

      return {
        year,
        faculty,
        studyProgram,
        degree,
        totalGraduates,
        respondentTs,
        work6mG,
        work1yG,
        work1yL,
        study,
        entrepreneur,
        unemployed,
        untracked,
        totalWorking,
        totalSuccess,
        ikuPercentage,
        responseRate
      };
    }).filter((r) => r.year && r.faculty && r.studyProgram);
  }, [sheetRows]);

  const [year, setYear] = useState("");
  const [faculty, setFaculty] = useState("");
  const [degree, setDegree] = useState("");
  const [program, setProgram] = useState("");
  const [search, setSearch] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showInsightToast, setShowInsightToast] = useState(true);

  // Filter list extraction
  const years = useMemo(() => [...new Set(parsed.map((r) => r.year))].sort(), [parsed]);
  const faculties = useMemo(() => [...new Set(parsed.map((r) => r.faculty))].sort(), [parsed]);
  const degrees = useMemo(() => [...new Set(parsed.map((r) => r.degree))].filter(Boolean).sort(), [parsed]);
  const programs = useMemo(() => [...new Set(parsed.map((r) => r.studyProgram))].sort(), [parsed]);

  // Apply filters
  const filtered = useMemo(() => {
    return parsed.filter((r) => {
      if (year && r.year !== year) return false;
      if (faculty && r.faculty !== faculty) return false;
      if (degree && r.degree !== degree) return false;
      if (program && r.studyProgram !== program) return false;
      if (search && !r.studyProgram.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [parsed, year, faculty, degree, program, search]);

  // Aggregate stats
  const summary = useMemo(() => {
    const totalGraduates = filtered.reduce((a, b) => a + b.totalGraduates, 0);
    const totalRespondent = filtered.reduce((a, b) => a + b.respondentTs, 0);
    const totalWork6mG = filtered.reduce((a, b) => a + b.work6mG, 0);
    const totalWork1yG = filtered.reduce((a, b) => a + b.work1yG, 0);
    const totalWork1yL = filtered.reduce((a, b) => a + b.work1yL, 0);
    const totalStudy = filtered.reduce((a, b) => a + b.study, 0);
    const totalEntrepreneur = filtered.reduce((a, b) => a + b.entrepreneur, 0);
    const totalUnemployed = filtered.reduce((a, b) => a + b.unemployed, 0);
    const totalUntracked = filtered.reduce((a, b) => a + b.untracked, 0);

    const totalWorking = totalWork6mG + totalWork1yG + totalWork1yL;
    const totalSuccess = totalWorking + totalStudy + totalEntrepreneur;
    const ikuPercentage = totalGraduates > 0 ? (totalSuccess / totalGraduates) * 100 : 0;
    const responseRate = totalGraduates > 0 ? (totalRespondent / totalGraduates) * 100 : 0;

    return {
      totalGraduates,
      totalRespondent,
      totalWorking,
      totalStudy,
      totalEntrepreneur,
      totalSuccess,
      totalUnemployed,
      totalUntracked,
      ikuPercentage,
      responseRate,
      totalFaculty: new Set(filtered.map((r) => r.faculty)).size,
      totalProgram: new Set(filtered.map((r) => r.studyProgram)).size
    };
  }, [filtered]);

  // Trend analysis (multi-year 2024-2026)
  const trendData = useMemo(() => {
    const map = new Map<string, ParsedRow[]>();
    for (const r of filtered) {
      const arr = map.get(r.year) ?? [];
      arr.push(r);
      map.set(r.year, arr);
    }
    return [...map.entries()]
      .map(([yr, items]) => {
        const grads = items.reduce((a, b) => a + b.totalGraduates, 0);
        const succ = items.reduce((a, b) => a + b.totalSuccess, 0);
        const val = grads > 0 ? (succ / grads) * 100 : 0;
        return { year: yr, iku: Number(val.toFixed(2)) };
      })
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [filtered]);

  // Faculty comparison (Horizontal Bar Chart)
  const facultyData = useMemo(() => {
    const map = new Map<string, ParsedRow[]>();
    for (const r of filtered) {
      const arr = map.get(r.faculty) ?? [];
      arr.push(r);
      map.set(r.faculty, arr);
    }
    return [...map.entries()]
      .map(([fac, items]) => {
        const grads = items.reduce((a, b) => a + b.totalGraduates, 0);
        const succ = items.reduce((a, b) => a + b.totalSuccess, 0);
        const val = grads > 0 ? (succ / grads) * 100 : 0;
        return { faculty: fac, iku: Number(val.toFixed(2)) };
      })
      .sort((a, b) => b.iku - a.iku);
  }, [filtered]);

  // Ranking Program Studi (Top 10 & Bottom 10)
  const prodiPerformance = useMemo(() => {
    const map = new Map<string, { prodi: string; faculty: string; grads: number; succ: number }>();
    for (const r of filtered) {
      const key = `${r.faculty}::${r.studyProgram}`;
      const cur = map.get(key) ?? { prodi: r.studyProgram, faculty: r.faculty, grads: 0, succ: 0 };
      cur.grads += r.totalGraduates;
      cur.succ += r.totalSuccess;
      map.set(key, cur);
    }
    return [...map.values()]
      .map((p) => {
        const val = p.grads > 0 ? (p.succ / p.grads) * 100 : 0;
        return { studyProgram: p.prodi, faculty: p.faculty, iku: Number(val.toFixed(2)), graduates: p.grads };
      })
      .sort((a, b) => b.iku - a.iku);
  }, [filtered]);

  const top10 = useMemo(() => prodiPerformance.slice(0, 10), [prodiPerformance]);
  const bottom10 = useMemo(() => [...prodiPerformance].slice(-10).reverse(), [prodiPerformance]);

  // Donut chart distribution (Outcome alumni)
  const outcomeDistribution = useMemo(() => {
    const totalWorking = filtered.reduce((a, b) => a + b.totalWorking, 0);
    const totalStudy = filtered.reduce((a, b) => a + b.study, 0);
    const totalEntrepreneur = filtered.reduce((a, b) => a + b.entrepreneur, 0);
    const totalUnemployed = filtered.reduce((a, b) => a + b.unemployed, 0);
    const totalUntracked = filtered.reduce((a, b) => a + b.untracked, 0);

    return [
      { name: "Bekerja", value: totalWorking },
      { name: "Lanjut Studi", value: totalStudy },
      { name: "Wirausaha", value: totalEntrepreneur },
      { name: "Belum Bekerja", value: totalUnemployed },
      { name: "Tidak Terlacak", value: totalUntracked }
    ].filter((item) => item.value > 0);
  }, [filtered]);

  // Stacked bar chart: Composition per Faculty
  const facultyComposition = useMemo(() => {
    const map = new Map<string, { faculty: string; working: number; study: number; entrepreneur: number }>();
    for (const r of filtered) {
      const cur = map.get(r.faculty) ?? { faculty: r.faculty, working: 0, study: 0, entrepreneur: 0 };
      cur.working += r.totalWorking;
      cur.study += r.study;
      cur.entrepreneur += r.entrepreneur;
      map.set(r.faculty, cur);
    }
    return [...map.values()];
  }, [filtered]);

  // Heatmap Fakultas vs Tahun Matrix
  const heatmapMatrix = useMemo(() => {
    const yearHeaders = [...new Set(filtered.map((r) => r.year))].sort();
    const facultyList = [...new Set(filtered.map((r) => r.faculty))].sort();

    const dataRows = facultyList.map((fac) => {
      const cells = yearHeaders.map((yr) => {
        const matching = filtered.filter((r) => r.faculty === fac && r.year === yr);
        const grads = matching.reduce((a, b) => a + b.totalGraduates, 0);
        const succ = matching.reduce((a, b) => a + b.totalSuccess, 0);
        const pct = grads > 0 ? (succ / grads) * 100 : 0;
        return { year: yr, iku: pct, grads };
      });
      return { faculty: fac, cells };
    });

    return { headers: yearHeaders, rows: dataRows };
  }, [filtered]);

  // Automatic insight narrative
  const insight = useMemo(() => {
    if (trendData.length === 0 || facultyData.length === 0 || prodiPerformance.length === 0) {
      return "Belum ada data tracer study yang mencukupi untuk memformulasikan insight otomatis.";
    }

    const lastTrend = trendData[trendData.length - 1];
    const prevTrend = trendData.length > 1 ? trendData[trendData.length - 2] : null;
    const diff = prevTrend ? lastTrend.iku - prevTrend.iku : 0;

    const bestFaculty = facultyData[0];
    const bestProdi = prodiPerformance[0];

    // Compute contribution factor
    // Total success contributions
    const contributionMap = new Map<string, number>();
    for (const r of filtered) {
      const cur = contributionMap.get(r.faculty) ?? 0;
      contributionMap.set(r.faculty, cur + r.totalSuccess);
    }
    const sortedContributors = [...contributionMap.entries()].sort((a, b) => b[1] - a[1]);
    const topContributor = sortedContributors[0]
      ? `${sortedContributors[0][0]} dengan kontribusi ${sortedContributors[0][1]} alumni`
      : "-";

    const trendText = prevTrend
      ? `tren capaian ${diff >= 0 ? "meningkat" : "menurun"} sebesar ${Math.abs(diff).toFixed(2)}% dari tahun sebelumnya`
      : "tren performa awal tahun tercatat";

    return `Capaian IKU 002 Universitas saat ini berada pada angka ${summary.ikuPercentage.toFixed(2)}%. Berdasarkan analisis multi-tahun, terdapat ${trendText}. Fakultas ${bestFaculty.faculty} merupakan fakultas dengan persentase capaian tertinggi (${bestFaculty.iku.toFixed(2)}%), sedangkan Program Studi ${bestProdi.studyProgram} mencatatkan capaian individu tertinggi (${bestProdi.iku.toFixed(2)}%). Kontributor terbesar yang menyumbang angka keberhasilan alumni terbanyak adalah Fakultas ${topContributor}.`;
  }, [trendData, facultyData, prodiPerformance, summary, filtered]);

  // Detailed table rows structure
  const tableRows = useMemo(() => {
    return prodiPerformance.map((p, idx) => {
      // Find matches in filtered to count detail categories
      const match = filtered.filter((r) => r.studyProgram === p.studyProgram && r.faculty === p.faculty);
      const totalWorking = match.reduce((a, b) => a + b.totalWorking, 0);
      const study = match.reduce((a, b) => a + b.study, 0);
      const entrepreneur = match.reduce((a, b) => a + b.entrepreneur, 0);

      return {
        id: `prodi-iku002-${idx}`,
        studyProgram: p.studyProgram,
        faculty: p.faculty,
        graduates: String(p.graduates),
        working: String(totalWorking),
        study: String(study),
        entrepreneur: String(entrepreneur),
        iku: `${p.iku.toFixed(2)}%`
      };
    });
  }, [prodiPerformance, filtered]);

  // CSV Export utility
  const handleExportCsv = () => {
    if (filtered.length === 0) return;
    const columns = [
      "Tahun",
      "Fakultas",
      "Program Studi",
      "Jenjang",
      "Total Lulusan",
      "Responden TS",
      "Bekerja (<6m >1.2 UMP)",
      "Bekerja (<1y >1.2 UMP)",
      "Bekerja (<1y <1.2 UMP)",
      "Lanjut Studi",
      "Wirausaha",
      "Belum Bekerja",
      "Tidak Terlacak",
      "Persentase IKU (%)"
    ];

    const escapeCell = (v: unknown) => {
      const text = String(v ?? "");
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const csvContent = [
      columns.join(","),
      ...filtered.map((r) =>
        [
          r.year,
          r.faculty,
          r.studyProgram,
          r.degree,
          r.totalGraduates,
          r.respondentTs,
          r.work6mG,
          r.work1yG,
          r.work1yL,
          r.study,
          r.entrepreneur,
          r.unemployed,
          r.untracked,
          r.ikuPercentage.toFixed(2)
        ]
          .map(escapeCell)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TracerStudy_IKU002_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Export utility using dynamic xlsx
  const handleExportExcel = async () => {
    if (filtered.length === 0) return;
    try {
      const XLSX = await import("xlsx");
      const exportRows = filtered.map((r) => ({
        "Tahun": r.year,
        "Fakultas": r.faculty,
        "Program Studi": r.studyProgram,
        "Jenjang": r.degree,
        "Total Lulusan": r.totalGraduates,
        "Responden TS": r.respondentTs,
        "Bekerja (<6bln >1.2 UMP)": r.work6mG,
        "Bekerja (<1thn >1.2 UMP)": r.work1yG,
        "Bekerja (<1thn <1.2 UMP)": r.work1yL,
        "Lanjut Studi": r.study,
        "Wirausaha": r.entrepreneur,
        "Belum Bekerja": r.unemployed,
        "Tidak Terlacak": r.untracked,
        "Capaian IKU 002 (%)": Number(r.ikuPercentage.toFixed(2))
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "IKU 002 Detail");
      XLSX.writeFile(workbook, `TracerStudy_IKU002_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) {
      console.error("Gagal mengekspor data ke Excel:", err);
    }
  };

  if (parseStatus === "loading" || isLoading) return <Iku002Skeleton />;

  if (parseStatus === "error") {
    return (
      <InlineNotification
        kind="error"
        title="Gagal Mengakses Sheet"
        subtitle={errorMessage || "Sumber data tidak dapat diakses. Periksa koneksi Google Sheet yang aktif."}
        hideCloseButton
        lowContrast
      />
    );
  }

  if (!parsed.length) {
    return (
      <Tile style={{ padding: "1.25rem" }}>
        <InlineNotification
          kind="warning"
          title="Data IKU 002 Tidak Tersedia"
          subtitle="Dataset aktif belum memiliki kolom minimal: Tahun, Fakultas, Prodi, Total Lulusan, Bekerja, Lanjut Studi, Wirausaha."
          hideCloseButton
          lowContrast
        />
      </Tile>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {/* Sticky Filter Toolbar */}
      <Tile style={{ padding: "0.5rem", position: "sticky", top: "0.5rem", zIndex: 40 }}>
        <div style={{ background: "var(--cds-layer-01)" }}>
          <div className="dashboard-toolbars" style={{ position: "relative" }}>
            <Search
              id="iku002-search"
              size="sm"
              labelText="Cari Program Studi"
              placeholder="Cari Program Studi"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <div className="iku001-filter-dropdown" style={{ position: "relative" }}>
              <Button
                size="sm"
                kind="tertiary"
                renderIcon={Filter}
                onClick={() => setShowFilterDropdown((prev) => !prev)}
              >
                Filter
              </Button>
            </div>
            {showFilterDropdown && (
              <div className="iku001-filter-panel iku001-filter-panel--overlay">
                <div className="iku001-filter-card">
                  <Dropdown
                    id="iku002-year"
                    size="sm"
                    titleText="Tahun"
                    label="Pilih tahun"
                    items={["Semua", ...years]}
                    selectedItem={year || "Semua"}
                    onChange={({ selectedItem }) => setYear(selectedItem === "Semua" ? "" : String(selectedItem || ""))}
                  />
                </div>
                <div className="iku001-filter-card">
                  <Dropdown
                    id="iku002-fac"
                    size="sm"
                    titleText="Fakultas"
                    label="Pilih fakultas"
                    items={["Semua", ...faculties]}
                    selectedItem={faculty || "Semua"}
                    onChange={({ selectedItem }) => setFaculty(selectedItem === "Semua" ? "" : String(selectedItem || ""))}
                  />
                </div>
                <div className="iku001-filter-card">
                  <Dropdown
                    id="iku002-degree"
                    size="sm"
                    titleText="Jenjang"
                    label="Pilih jenjang"
                    items={["Semua", ...degrees]}
                    selectedItem={degree || "Semua"}
                    onChange={({ selectedItem }) => setDegree(selectedItem === "Semua" ? "" : String(selectedItem || ""))}
                  />
                </div>
                <div className="iku001-filter-card">
                  <Dropdown
                    id="iku002-prodi"
                    size="sm"
                    titleText="Program Studi"
                    label="Pilih program studi"
                    items={["Semua", ...programs]}
                    selectedItem={program || "Semua"}
                    onChange={({ selectedItem }) => setProgram(selectedItem === "Semua" ? "" : String(selectedItem || ""))}
                  />
                </div>
                <Button
                  size="sm"
                  kind="ghost"
                  onClick={() => {
                    setYear("");
                    setFaculty("");
                    setDegree("");
                    setProgram("");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </Tile>

      {/* KPI Cards section */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <Tile>
          <div className="iku-kpi-tile__label">Capaian IKU 002</div>
          <div className="iku-kpi-tile__value" style={{ color: "#0f62fe" }}>
            {summary.ikuPercentage.toFixed(2)}%
          </div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Total Lulusan</div>
          <div className="iku-kpi-tile__value">
            {summary.totalGraduates.toLocaleString("id-ID")}
          </div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Alumni Memenuhi IKU</div>
          <div className="iku-kpi-tile__value">
            {summary.totalSuccess.toLocaleString("id-ID")}
          </div>
        </Tile>
        <Tile>
          <div className="iku-kpi-tile__label">Response Rate Tracer Study</div>
          <div className="iku-kpi-tile__value">
            {summary.responseRate.toFixed(2)}%
          </div>
        </Tile>
      </section>

      {/* Multi-Year Trend & Faculty Comparison */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Tren Multi-Tahun Capaian IKU 002</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<Iku002ChartTooltip />} />
              <Line type="monotone" dataKey="iku" stroke="#0f62fe" strokeWidth={2.5} name="Persentase IKU (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Tile>

        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Perbandingan Capaian IKU per Fakultas</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facultyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="faculty" type="category" width={80} style={{ fontSize: "0.75rem" }} />
              <Tooltip content={<Iku002ChartTooltip />} />
              <Bar dataKey="iku" fill="#8a3ffc" radius={[0, 4, 4, 0]} name="Capaian IKU (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>
      </section>

      {/* Top 10 Prodi & Outcome Distribution */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Top 10 Capaian Program Studi</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="studyProgram" tick={false} />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<Iku002ChartTooltip />} />
              <Bar dataKey="iku" fill="#198038" name="Capaian (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>

        <Tile style={{ minHeight: "320px", display: "flex", flexDirection: "column" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Distribusi Outcome Alumni</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, gap: "1rem" }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={outcomeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {outcomeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<Iku002ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "45%" }}>
              {outcomeDistribution.map((entry, index) => {
                const totalVal = summary.totalGraduates || 1;
                const percentage = ((entry.value / totalVal) * 100).toFixed(1);
                return (
                  <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                    <span style={{ width: "10px", height: "10px", backgroundColor: PIE_COLORS[index % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{entry.name}</span>
                    <strong style={{ fontVariantNumeric: "tabular-nums" }}>{percentage}%</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </Tile>
      </section>

      {/* Composition & Heatmap section */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1rem" }}>
        <Tile style={{ minHeight: "320px" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Komposisi Keberhasilan Alumni per Fakultas</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facultyComposition} stackOffset="none">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faculty" style={{ fontSize: "0.75rem" }} />
              <YAxis />
              <Tooltip content={<Iku002ChartTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="working" stackId="outcome" fill="#0f62fe" name="Bekerja" />
              <Bar dataKey="study" stackId="outcome" fill="#8a3ffc" name="Lanjut Studi" />
              <Bar dataKey="entrepreneur" stackId="outcome" fill="#198038" name="Wirausaha" />
            </BarChart>
          </ResponsiveContainer>
        </Tile>

        <Tile style={{ minHeight: "320px", display: "flex", flexDirection: "column" }}>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Heatmap Capaian Fakultas vs Tahun</h4>
          <div style={{ flex: 1, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--cds-layer-02)", borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <th style={{ padding: "0.5rem", fontWeight: 600 }}>Fakultas</th>
                  {heatmapMatrix.headers.map((yr) => (
                    <th key={yr} style={{ padding: "0.5rem", textAlign: "center", fontWeight: 600 }}>{yr}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapMatrix.rows.map((row, idx) => (
                  <tr key={row.faculty} style={{ borderBottom: "1px solid var(--cds-border-subtle-00)" }}>
                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>{row.faculty}</td>
                    {row.cells.map((cell) => {
                      // Determine background color based on percentage
                      const val = cell.iku;
                      let bg = "rgba(15, 98, 254, 0.05)";
                      let textCol = "var(--cds-text-primary)";
                      if (val > 80) {
                        bg = "rgba(25, 128, 56, 0.2)"; // green tint
                      } else if (val > 60) {
                        bg = "rgba(15, 98, 254, 0.25)"; // blue medium tint
                      } else if (val > 40) {
                        bg = "rgba(15, 98, 254, 0.15)"; // blue lighter tint
                      } else if (val > 0) {
                        bg = "rgba(238, 83, 139, 0.15)"; // red tint
                      }

                      return (
                        <td
                          key={cell.year}
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            backgroundColor: bg,
                            color: textCol,
                            fontWeight: 600,
                            fontVariantNumeric: "tabular-nums"
                          }}
                        >
                          {cell.grads > 0 ? `${val.toFixed(1)}%` : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tile>
      </section>

      {/* Rankings breakdown panels */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
        <Tile>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Ranking Top 10 Prodi</h4>
          {top10.map((r, i) => (
            <div key={`${r.studyProgram}-${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", padding: "0.25rem 0", borderBottom: "1px solid var(--cds-border-subtle-00)" }}>
              <span>{r.studyProgram}</span>
              <strong>{r.iku.toFixed(2)}%</strong>
            </div>
          ))}
        </Tile>
        <Tile>
          <h4 style={{ margin: "0 0 0.75rem 0" }}>Ranking Bottom 10 Prodi</h4>
          {bottom10.map((r, i) => (
            <div key={`${r.studyProgram}-${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", padding: "0.25rem 0", borderBottom: "1px solid var(--cds-border-subtle-00)" }}>
              <span>{r.studyProgram}</span>
              <strong>{r.iku.toFixed(2)}%</strong>
            </div>
          ))}
        </Tile>
      </section>

      {/* Detail Data Table */}
      <Tile>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h4 style={{ margin: 0 }}>Data Rincian Program Studi IKU 002</h4>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" kind="tertiary" renderIcon={Download} onClick={handleExportCsv}>
              Ekspor CSV
            </Button>
            <Button size="sm" kind="primary" renderIcon={Download} onClick={handleExportExcel}>
              Ekspor Excel
            </Button>
          </div>
        </div>

        <DataTable
          rows={tableRows}
          headers={[
            { key: "studyProgram", header: "Program Studi" },
            { key: "faculty", header: "Fakultas" },
            { key: "graduates", header: "Total Lulusan" },
            { key: "working", header: "Bekerja" },
            { key: "study", header: "Lanjut Studi" },
            { key: "entrepreneur", header: "Wirausaha" },
            { key: "iku", header: "Persentase IKU" }
          ]}
          isSortable
          size="sm"
        >
          {({ rows, headers, getTableProps, getTableContainerProps, getToolbarProps, getHeaderProps, getRowProps }) => (
            <TableContainer {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Cari Program Studi"
                    onChange={(e: any) => setSearch(e.target.value)}
                    value={search}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      const { key, ...rest } = getHeaderProps({ header });
                      return <TableHeader key={String(key ?? header.key)} {...rest}>{header.header}</TableHeader>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const { key, ...rest } = getRowProps({ row });
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

      {/* Floating Automated Insight Toast */}
      {showInsightToast && (
        <div
          style={{
            position: "fixed",
            right: "1rem",
            bottom: "1rem",
            zIndex: 1200,
            width: "min(420px, calc(100vw - 2rem))"
          }}
        >
          <InlineNotification
            kind="info"
            title="Analisis Insight Otomatis"
            subtitle={insight}
            lowContrast
            onCloseButtonClick={() => setShowInsightToast(false)}
          />
        </div>
      )}
    </div>
  );
}
