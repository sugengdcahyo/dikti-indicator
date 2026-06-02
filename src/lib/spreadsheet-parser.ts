import { generateMockIkuData, generateMockIku001Data, generateMockIku002Data } from "@/lib/data-helpers";
import { useDashboardStore } from "@/store/dashboard-store";
import type { RawRow } from "@/types/data";

type ParsedSpreadsheet = {
  rows: RawRow[];
  columns: string[];
};

async function loadXlsx() {
  return import("xlsx");
}

function toGoogleSheetExportUrl(url: string): string {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return url;
  const sheetId = match[1];
  const gidMatch = url.match(/[?&]gid=(\d+)/);
  const gid = gidMatch?.[1] ?? "0";
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx&gid=${gid}`;
}

async function parseSpreadsheetBuffer(buffer: ArrayBuffer): Promise<ParsedSpreadsheet> {
  const XLSX = await loadXlsx();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<RawRow>(firstSheet, { defval: "" });
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return { rows, columns };
}

export async function parseSpreadsheetFile(file: File): Promise<ParsedSpreadsheet> {
  const buffer = await file.arrayBuffer();
  return parseSpreadsheetBuffer(buffer);
}

function generateMockDataForTab(faculty: string, tab: string) {
  if (tab === "IKU 001") {
    return generateMockIku001Data(faculty);
  }
  if (tab === "IKU 002") {
    return generateMockIku002Data(faculty);
  }
  return generateMockIkuData(faculty, "2026"); // Default to IKU 003
}

export async function parseSpreadsheetUrl(url: string): Promise<ParsedSpreadsheet> {
  const trimmed = url.trim().toLowerCase();
  const activeTab = useDashboardStore.getState().activeDashboardTab;

  if (trimmed === "drive-folder-demo-teknik" || trimmed.includes("teknik")) {
    return generateMockDataForTab("Teknik", activeTab);
  }
  if (trimmed === "drive-folder-demo-mipa" || trimmed.includes("mipa")) {
    return generateMockDataForTab("MIPA", activeTab);
  }
  if (trimmed === "drive-folder-demo-ekonomi" || trimmed.includes("ekonomi")) {
    return generateMockDataForTab("Ekonomi", activeTab);
  }

  const finalUrl = toGoogleSheetExportUrl(trimmed);
  const response = await fetch(finalUrl);
  if (!response.ok) {
    throw new Error("Gagal mengambil data dari URL spreadsheet");
  }

  const buffer = await response.arrayBuffer();
  return parseSpreadsheetBuffer(buffer);
}
