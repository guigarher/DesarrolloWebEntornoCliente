import type { Product } from "../model/Product";

const API_URL = "http://localhost:3000/productos";

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }

    return response.json();
  },
};
