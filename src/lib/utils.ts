import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//PROFILE FUNCTIONS
export function splitPhone(phone: string): { prefix: string; number: string } {
  if (!phone) return { prefix: "", number: "" };
  const match = phone.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) {
    return { prefix: match[1], number: match[2] };
  }
  return { prefix: "", number: phone };
}

export function normalize(v: any) {
  v === undefined || v === null || v === "" ? null : v;
  return v;
}

export function formatDate(date: string) {
  return date ? date.slice(0, 10) : "";
}

export function getFullPhone(number: string, prefix: string) {
  return prefix && number ? `${prefix} ${number}`.trim() : "";
}
