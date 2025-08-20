// src/repositories/articles.repository.ts
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ListParams,
  ListResponse,
} from "@/types/article";

const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ArticlesRepository {
  static async list(params?: ListParams) {
    const q = new URLSearchParams();
    if (typeof params?.offset === "number")
      q.set("offset", String(params.offset));
    if (typeof params?.limit === "number") q.set("limit", String(params.limit));

    const url = `${B}/articles${q.toString() ? `?${q.toString()}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al listar artículos");
    return (await res.json()) as ListResponse<Article>;
  }

  static async getById(id: number) {
    const res = await fetch(`${B}/articles/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) throw new Error("Artículo no encontrado");
      throw new Error("Error al obtener el artículo");
    }
    return (await res.json()) as Article;
  }

  static async create(payload: CreateArticleInput) {
    const res = await fetch(`${B}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear el artículo");
    return (await res.json()) as Article;
  }

  static async update(id: number, payload: UpdateArticleInput) {
    const res = await fetch(`${B}/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      if (res.status === 404) throw new Error("Artículo no encontrado");
      throw new Error("Error al actualizar el artículo");
    }
    return (await res.json()) as Article;
  }

  static async remove(id: number) {
    const res = await fetch(`${B}/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 404) throw new Error("Artículo no encontrado");
      throw new Error("Error al borrar el artículo");
    }
    // backend devuelve { ok: true }
    return (await res.json()) as { ok: boolean };
  }
}
