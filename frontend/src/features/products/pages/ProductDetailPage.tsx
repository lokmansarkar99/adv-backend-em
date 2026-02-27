import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package, Tag, Boxes, CheckCircle2, XCircle } from "lucide-react";
import { productApi } from "../api/productApi";
import type { Product } from "../product.types";
import ProductStatusBadge from "../components/ProductStatusBadge";
import { Loader2 } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [active,  setActive]  = useState(0); // active image index

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productApi.getById(id)
      .then((res) => { setProduct(res.data.data); setActive(0); })
      .catch((err) => setError(err?.response?.data?.message || "Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  if (error || !product) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-500">{error || "Product not found."}</p>
      <Link to="/products" className="mt-4 inline-flex text-indigo-600 text-sm hover:underline">
        ← Back to products
      </Link>
    </div>
  );

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const imageBase   = import.meta.env.VITE_API_ORIGIN;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            {product.images[active] ? (
              <img
                src={`${imageBase}/uploads${product.images[active]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-slate-200" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    active === idx ? "border-indigo-500 shadow-sm" : "border-slate-200"
                  }`}
                >
                  <img src={`${imageBase}/uploads${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{product.category}</span>
              <ProductStatusBadge status={product.status} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="text-4xl font-black text-slate-800">${product.discountPrice!.toFixed(2)}</span>
                <span className="text-xl text-slate-400 line-through">${product.price.toFixed(2)}</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-sm font-bold rounded-lg">
                  -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-slate-800">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to cart */}
          <button
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
