"use client";

import { useId } from "react";
import { Dropdown, TextInput, Button } from "@carbon/react";
import { useDashboardStore } from "@/store/dashboard-store";

export function FilterBar() {
  const { normalizedRows, filters, setFilter, resetFilters } = useDashboardStore();
  const years = [...new Set(normalizedRows.map((r) => r.year).filter(Boolean))] as string[];
  const faculties = [...new Set(normalizedRows.map((r) => r.faculty).filter(Boolean))] as string[];
  const degrees = [...new Set(normalizedRows.map((r) => r.degree).filter(Boolean))] as string[];
  const uid = useId();

  return (
    <div className="dashboard-filter-control">
      <Dropdown
        id={`${uid}-year`}
        titleText="Tahun"
        label="Semua Tahun"
        size="sm"
        items={["Semua Tahun", ...years]}
        selectedItem={filters.year || "Semua Tahun"}
        onChange={({ selectedItem }) => setFilter("year", selectedItem === "Semua Tahun" ? "" : (selectedItem || ""))}
      />

      <Dropdown
        id={`${uid}-faculty`}
        titleText="Fakultas"
        label="Semua Fakultas"
        size="sm"
        items={["Semua Fakultas", ...faculties]}
        selectedItem={filters.faculty || "Semua Fakultas"}
        onChange={({ selectedItem }) => setFilter("faculty", selectedItem === "Semua Fakultas" ? "" : (selectedItem || ""))}
      />

      <Dropdown
        id={`${uid}-degree`}
        titleText="Jenjang"
        label="Semua Jenjang"
        size="sm"
        items={["Semua Jenjang", ...degrees]}
        selectedItem={filters.degree || "Semua Jenjang"}
        onChange={({ selectedItem }) => setFilter("degree", selectedItem === "Semua Jenjang" ? "" : (selectedItem || ""))}
      />

      <TextInput
        id={`${uid}-search`}
        labelText="Pencarian"
        size="sm"
        placeholder="Cari Program Studi"
        value={filters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter("search", e.target.value)}
      />

      <Button kind="tertiary" size="sm" onClick={resetFilters} className="dashboard-filter-control__reset">
        Reset Filter
      </Button>
    </div>
  );
}
