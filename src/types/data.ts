export type RawRow = Record<string, string | number | null | undefined>;

export type CanonicalKey =
  | "year"
  | "faculty"
  | "study_program"
  | "degree"
  | "total_lecturers"
  | "iku_017"
  | "iku_018"
  | "coaching_achievement"
  | "iku_total"
  | "iku_percentage"
  | "partners"
  | "evidence";

export type NormalizedRow = {
  year?: string;
  faculty?: string;
  study_program?: string;
  degree?: string;
  total_lecturers?: number;
  iku_017?: number;
  iku_018?: number;
  coaching_achievement?: number;
  iku_total?: number;
  iku_percentage?: number;
  partners?: string;
  evidence?: string;
  __raw: RawRow;
};

export type DataProfile = {
  totalRows: number;
  totalColumns: number;
  numericColumns: string[];
  categoricalColumns: string[];
  missingByColumn: Array<{ column: string; missing: number; percentage: number }>;
  duplicateRows: number;
};

export type DashboardFilters = {
  year: string;
  faculty: string;
  degree: string;
  search: string;
};
