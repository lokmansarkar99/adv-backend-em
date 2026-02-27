import { useState, useEffect, useCallback } from "react";
import { productApi } from "../api/productApi";
import type { Product, ProductFilters, ProductMeta } from "../product.types";

export function useProducts(initialFilters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta,     setMeta]     = useState<ProductMeta | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [filters,  setFilters]  = useState<ProductFilters>({
    page: 1, limit: 12, ...initialFilters,
  });

  const fetchProducts = useCallback(async (f: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await productApi.getAll(f);

      // ✅ Real shape: { success, meta, data: Product[] }
      setProducts(res.data.data   ?? []);
      setMeta(res.data.meta       ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products.");
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const updateFilters = (patch: Partial<ProductFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const goToPage = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  const refresh = () => fetchProducts(filters);

  return { products, meta, loading, error, filters, updateFilters, goToPage, refresh };
}
