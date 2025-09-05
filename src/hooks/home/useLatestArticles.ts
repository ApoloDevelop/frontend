import { ArticlesService } from "@/services/articles.service";

export async function useLatestArticles(limit: number = 5) {
  try {
    // Para la página principal, usamos un enfoque que permite el cacheo
    const B = process.env.NEXT_PUBLIC_BACKEND_URL;
    const qsp = new URLSearchParams();
    qsp.set("offset", "0");
    qsp.set("limit", String(limit));

    const url = `${B}/articles?${qsp.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Revalidar cada 5 minutos
    });

    if (!res.ok) {
      console.error("Error fetching latest articles:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}
