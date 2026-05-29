import type { NormalizedRow } from "@/types/data";

export type ReturnTypeOfInsights = {
  topProgram?: NormalizedRow;
  bottomProgram?: NormalizedRow;
  topFaculty?: { faculty: string; avg: number };
  avgAll: number;
  belowThreshold: string[];
  threshold: number;
};
