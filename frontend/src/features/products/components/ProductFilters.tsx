import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ProductFilters } from "../product.types";

type Props = {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
};

const CATEGORIES = ["electronics", "fashion", "home", "sports", "books", "toys", "beauty", "food"];
const SORT_OPTIONS = [
  { label: "Newest",        sortBy: "createdAt", sortOrder: "desc" as const },
  { label: "Oldest",        sortBy: "createdAt", sortOrder: "asc"  as const },
  { label: "Price: Low",    sortBy: "price",     sortOrder: "asc"  as const },
  { label: "Price: High",   sortBy: "price",     sortOrder: "desc" as const },
];

export default function ProductFilters({ filters, onChange }: Props) {
  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  const clearAll = () =>
    onChange({ search: "", category: "", minPrice: "", maxPrice: "", sortBy: "createdAt", sortOrder: "desc" });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ""}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        {filters.search && (
          <button onClick={() => onChange({ search: "" })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Category */}
        <select
          value={filters.category || ""}
          onChange={(e) => onChange({ category: e.target.value })}
          className="col-span-2 px-3 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 bg-white text-slate-700 transition-all"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        {/* Price range */}
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice || ""}
          onChange={(e) => onChange({ minPrice: e.target.value })}
          className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 transition-all"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice || ""}
          onChange={(e) => onChange({ maxPrice: e.target.value })}
          className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 transition-all"
        />

        {/* Sort */}
        <select
          value={`${filters.sortBy || "createdAt"}_${filters.sortOrder || "desc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("_") as [string, "asc" | "desc"];
            onChange({ sortBy, sortOrder });
          }}
          className="col-span-2 sm:col-span-1 px-3 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 bg-white text-slate-700 transition-all"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={`${o.sortBy}_${o.sortOrder}`} value={`${o.sortBy}_${o.sortOrder}`}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
