import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { Loader2, PackageSearch } from "lucide-react";

export default function ProductsPage() {
  const { products, meta, loading, error, filters, updateFilters, goToPage } = useProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800">All Products</h1>
        <p className="text-slate-500 mt-1">
          {meta ? `${meta.total} products found` : "Browse our catalogue"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ProductFilters filters={filters} onChange={updateFilters} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-16 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center">
          <PackageSearch className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No products found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* ✅ Pagination — only render when meta is loaded AND has multiple pages */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page === 1}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* ✅ Safe page number generation */}
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter((p) =>
                  p === 1 ||
                  p === meta.totalPages ||
                  Math.abs(p - meta.page) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  // insert ellipsis for gaps
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
                  ) : (
                    <button
                      key={`page-${item}`}
                      onClick={() => goToPage(item as number)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                        meta.page === item
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
