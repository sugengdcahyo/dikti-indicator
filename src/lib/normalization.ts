import type { CanonicalKey } from "@/types/data";

const aliases: Record<CanonicalKey, string[]> = {
  year: ["tahun", "year"],
  faculty: ["fakultas", "faculty"],
  study_program: ["program studi", "prodi", "study program", "program_studi"],
  degree: ["jenjang", "degree"],
  total_lecturers: ["total dosen tetap", "total_lecturers"],
  iku_017: ["ik-017", "iku 017", "dosen tridharma", "ik017"],
  iku_018: ["ik-018", "iku 018", "dosen praktisi industri", "ik018"],
  coaching_achievement: [
    "dosen membina prestasi mahasiswa nasional/internasional",
    "dosen membina prestasi",
    "coaching achievement",
  ],
  iku_total: ["total dosen memenuhi iku003", "iku_total", "total memenuhi iku003"],
  iku_percentage: ["persentase iku003", "iku percentage", "iku003", "persentase iku"],
  partners: ["mitra kampus/industri", "mitra", "partners"],
  evidence: ["evidence", "bukti"],
};

export function normalizeColumnName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function detectCanonicalKey(input: string): CanonicalKey | undefined {
  const normalized = normalizeColumnName(input);
  return (Object.keys(aliases) as CanonicalKey[]).find((key) =>
    aliases[key].some((alias) => normalized.includes(normalizeColumnName(alias))),
  );
}
