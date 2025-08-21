const B = process.env.NEXT_PUBLIC_BACKEND_URL;

export class UploadRepository {
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${B}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Error al subir la imagen");
    }
    const data = await res.json();
    return data.url as string;
  }
}
