import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ListParams,
  ListResponse,
} from "@/types/article";
import { ArticlesRepository } from "@/repositories/articles.repository";

export class ArticlesService {
  static list(params?: ListParams): Promise<ListResponse<Article>> {
    return ArticlesRepository.list(params);
  }

  static getById(id: number): Promise<Article> {
    return ArticlesRepository.getById(id);
  }

  static create(payload: CreateArticleInput): Promise<Article> {
    console.log("Creating article with payload:", payload);
    return ArticlesRepository.create(payload);
  }

  static update(id: number, payload: UpdateArticleInput): Promise<Article> {
    return ArticlesRepository.update(id, payload);
  }

  static remove(id: number): Promise<{ ok: boolean }> {
    return ArticlesRepository.remove(id);
  }

  static async getRelated(id: number, limit = 3) {
    return ArticlesRepository.getRelated(id, limit);
  }
}
