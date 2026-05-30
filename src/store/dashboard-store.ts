"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { calculateKpis, filterRows, generateProfile, getInsights, getRanking, normalizeRows, toProgramChart, generateMockIkuData } from "@/lib/data-helpers";
import type { DashboardFilters, DataProfile, NormalizedRow, RawRow } from "@/types/data";

type DashboardState = {
  rows: RawRow[];
  columns: string[];
  normalizedRows: NormalizedRow[];
  profile: DataProfile | null;
  parseStatus: "idle" | "success" | "error";
  errorMessage: string | null;
  filters: DashboardFilters;
  kpiThreshold: number;
  activeFileName: string;
  activeDashboardTab: string;
  setData: (rows: RawRow[], columns: string[]) => void;
  setError: (message: string) => void;
  setFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  setKpiThreshold: (threshold: number) => void;
  setActiveFileName: (name: string) => void;
  setActiveDashboardTab: (tab: string) => void;
  resetFilters: () => void;
};

const initialFilters: DashboardFilters = {
  year: "",
  faculty: "",
  degree: "",
  search: "",
};

export const useDashboardStore = create<DashboardState>((set) => ({
  rows: [],
  columns: [],
  normalizedRows: [],
  profile: null,
  parseStatus: "idle",
  errorMessage: null,
  filters: initialFilters,
  kpiThreshold: 80,
  activeFileName: "",
  activeDashboardTab: "Overview",
  setData: (rows, columns) =>
    set({
      rows,
      columns,
      normalizedRows: normalizeRows(rows),
      profile: generateProfile(rows, columns),
      parseStatus: "success",
      errorMessage: null,
    }),
  setError: (message) => set({ parseStatus: "error", errorMessage: message }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  setKpiThreshold: (threshold) => set({ kpiThreshold: threshold }),
  setActiveFileName: (name) => set({ activeFileName: name }),
  setActiveDashboardTab: (tab) => set({ activeDashboardTab: tab }),
  resetFilters: () => set({ filters: initialFilters }),
}));

export const useFilteredRows = () =>
  {
    const normalizedRows = useDashboardStore((state) => state.normalizedRows);
    const filters = useDashboardStore((state) => state.filters);
    return useMemo(() => filterRows(normalizedRows, filters), [normalizedRows, filters]);
  };

export const useDashboardMetrics = () => {
  const rows = useFilteredRows();
  const kpiThreshold = useDashboardStore((state) => state.kpiThreshold);
  return useMemo(
    () => ({
      kpis: calculateKpis(rows),
      chartData: toProgramChart(rows),
      rankingTop: getRanking(rows, "desc"),
      rankingBottom: getRanking(rows, "asc"),
      insights: getInsights(rows, kpiThreshold),
    }),
    [rows, kpiThreshold],
  );
};
