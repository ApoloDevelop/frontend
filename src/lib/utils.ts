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
