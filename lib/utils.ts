import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseRevenue(revenue: string | null | undefined): number {
  if (!revenue) return 0;
  
  const revLower = revenue.toLowerCase();
  
  // Specifically looking for k, m, b as units, not just part of a word
  // This avoids "monthly" or "mrr" being caught as "m"
  const match = revenue.match(/([\d,.]+)\s*([kmb])?\b/i);
  if (!match) return 0;
  
  let num = parseFloat(match[1].replace(/,/g, ""));
  const unit = (match[2] || "").toLowerCase();

  if (unit === "k") num *= 1000;
  else if (unit === "m") num *= 1000000;
  else if (unit === "b") num *= 1000000000;

  // Handle yearly/annual/per year - divide by 12
  if (/\b(yr|year|annual|annum)\b/i.test(revLower)) {
    num /= 12;
  }
  
  return num;
}
