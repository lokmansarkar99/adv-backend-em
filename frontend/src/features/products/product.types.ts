export type ProductStatus = "active" | "inactive" | "draft";

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  category: string;
  tags?: string[];
  images: string[];
  thumbnail: string;
  status: ProductStatus;
  isDeleted: boolean;
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

export type ProductMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ✅ Real response: meta is top-level, data is the array directly
export type ProductListApiResponse = {
  success: boolean;
  message: string;
  meta: ProductMeta;
  data: Product[];
};

// Single product response stays wrapped normally
export type ProductSingleApiResponse = {
  success: boolean;
  message: string;
  data: Product;
};

export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
};
