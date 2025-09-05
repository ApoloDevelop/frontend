import { getToken } from "@/lib/auth";

export function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  return headers;
}
