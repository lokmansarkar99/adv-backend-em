import { http } from "../../../shared/api/http";
import type { ApiResponse } from "../../auth/auth.types";
import type {
  Product,
  ProductListApiResponse,
  ProductSingleApiResponse,
  ProductFilters,
} from "../product.types";

const BASE = "/products";

export const productApi = {
  // ── PUBLIC ──────────────────────────────────────────
  // Response: { success, message, meta: {...}, data: Product[] }
  getAll(filters: ProductFilters = {}) {
    return http.get<ProductListApiResponse>(BASE, { params: filters });
  },

  // Response: { success, message, data: Product }
  getById(id: string) {
    return http.get<ProductSingleApiResponse>(`${BASE}/${id}`);
  },

  // ── ADMIN ────────────────────────────────────────────
  create(formData: FormData) {
    return http.post<ProductSingleApiResponse>(BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id: string, formData: FormData) {
    return http.patch<ProductSingleApiResponse>(`${BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateStatus(id: string, status: string) {
    return http.patch<ApiResponse<{ message: string }>>(`${BASE}/${id}/status`, { status });
  },

  delete(id: string) {
    return http.delete<ApiResponse<{ message: string }>>(`${BASE}/${id}`);
  },
};
