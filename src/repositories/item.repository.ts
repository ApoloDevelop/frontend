export class ItemRepository {
  static async findItemByTypeAndName(
    type: string,
    name: string
  ): Promise<{ itemId: number } | null> {
    if (!type || !name) {
      throw new Error('Los parámetros "type" y "name" son obligatorios');
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/item/find?type=${encodeURIComponent(type)}&name=${encodeURIComponent(
        name
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Si el estado es 404, devolvemos null en lugar de lanzar un error
        return null;
      }
      const error = await response.json();
      throw new Error(error.message || "Error al buscar el ítem");
    }

    return response.json();
  }
}
