import { UploadRepository } from "@/repositories/cloudinary.repository";

export class CloudinaryService {
  static async uploadImage(file: File): Promise<string> {
    return await UploadRepository.uploadImage(file);
  }
}
