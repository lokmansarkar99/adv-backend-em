import { useState } from "react";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Loader2, PackageSearch, Search, AlertTriangle,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { productApi } from "../api/productApi";
import ProductFormModal from "../components/ProductFormModal";
import ProductStatusBadge from "../components/ProductStatusBadge";
import Button from "../../../shared/components/Button";
import type { Product } from "../product.types";

export default function AdminProductsPage() {
  const { products, meta, loading, error, filters, updateFilters, goToPage, refresh } =
    useProducts({ limit: 10 });

  const [modalOpen,     setModalOpen]     = useState(false);
  const [editProduct,   setEditProduct]   = useState<Product | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<Product | null>(null);
  const [deleting,      setDeleting]      = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // product _id

  // ── Open create modal
  const openCreate = () => { setEditProduct(null); setModalOpen(true); };

  // ── Open edit modal
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };

  // ── Toggle status (active ↔ inactive)
  const toggleStatus = async (p: Product) => {
    const next = p.status === "active" ? "inactive" : "active";
    try {
      setActionLoading(p._id);
      await productApi.updateStatus(p._id, next);
      refresh();
    } catch { /* silent */ }
    finally { setActionLoading(null); }
  };

  // ── Delete confirmed
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await productApi.delete(deleteTarget._id);
      setDeleteTarget(null);
      refresh();
    } catch { /* silent */ }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {meta ? `${meta.total} total products` : "Manage your catalogue"}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ""}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <PackageSearch className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No products yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {p.thumbnail ? (
                            <img
                              src={`${import.meta.env.VITE_API_ORIGIN}/${p.thumbnail}`}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PackageSearch className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">{p._id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="capitalize text-slate-600">{p.category}</span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {p.discountPrice && p.discountPrice < p.price ? (
                        <div>
                          <span className="font-semibold text-slate-800">${p.discountPrice.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 line-through ml-1">${p.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-800">${p.price.toFixed(2)}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : "text-slate-700"}`}>
                        {p.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <ProductStatusBadge status={p.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {/* Toggle active/inactive */}
                        <button
                          onClick={() => toggleStatus(p)}
                          disabled={actionLoading === p._id}
                          title={p.status === "active" ? "Set inactive" : "Set active"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.status === "active"
                              ? "text-green-500 hover:bg-green-50"
                              : "text-slate-400 hover:bg-slate-100"
                          } disabled:opacity-40`}
                        >
                          {actionLoading === p._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : p.status === "active"
                              ? <ToggleRight className="w-4 h-4" />
                              : <ToggleLeft className="w-4 h-4" />
                          }
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refresh}
        editProduct={editProduct}
      />

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-500 mb-6">
              "<span className="font-semibold text-slate-700">{deleteTarget.name}</span>" will be permanently deleted and all its images removed from disk.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth loading={deleting} onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
