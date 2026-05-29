import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.replace(/\./g, "").replace(/,/g, ".").replace(/%/g, "").trim();
  if (!normalized) return undefined;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

export function toString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const text = String(value).trim();
  return text ? text : undefined;
}
