import { useEffect, useState } from "react";
import type { Product } from "../model/Product";
import { productService } from "../services/productServices";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getAll();
        setProducts(data);
      } catch (e: any) {
        setError(e.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}
