"use client";

import { useMemo, useState } from "react";
import {
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
} from "@carbon/react";
import type { RawRow } from "@/types/data";

export function AppDataTable({
  data,
  columns,
}: {
  data: RawRow[];
  columns: string[];
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Filter rows across the full dataset
  const filteredRows = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const q = globalFilter.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, globalFilter]);

  // Display only a sample of 1-10 data rows
  const pagedRows = useMemo(() => filteredRows.slice(0, 10), [filteredRows]);
  const totalItems = data.length;

  // Build Carbon DataTable rows/headers format
  const headers = columns.map((col) => ({ key: col, header: col }));
  const rows = pagedRows.map((row, idx) => ({
    id: String(idx),
    ...Object.fromEntries(columns.map((col) => [col, String(row[col] ?? "")])),
  }));

  return (
    <DataTable rows={rows} headers={headers} size="sm" isSortable>
      {({
        rows: tableRows,
        headers: tableHeaders,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getTableContainerProps,
        getToolbarProps,
      }) => (
        <TableContainer
          title="Sampel Data Sumber"
          description={`Menampilkan sampel 1-10 baris data pertama dari total ${totalItems} baris`}
          {...getTableContainerProps()}
        >
          <TableToolbar {...getToolbarProps()}>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Cari dalam seluruh data..."
                value={globalFilter}
                onChange={(e: any) =>
                  setGlobalFilter(e.target.value)
                }
              />
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => {
                  const { key, ...headerProps } = getHeaderProps({ header });
                  return (
                    <TableHeader
                      key={header.key}
                      {...headerProps}
                    >
                      {header.header}
                    </TableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => {
                const { key, ...rowProps } = getRowProps({ row });
                return (
                  <TableRow key={row.id} {...rowProps}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{String(cell.value ?? "")}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: "center", padding: "2rem", color: "var(--cds-text-secondary)" }}>
                    Tidak ada data yang cocok dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}
