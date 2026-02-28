import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Package, CreditCard } from "lucide-react";
import type { Product } from "../product.types";
import { directStripeCheckoutForProduct } from "../../orders/utils/directCheckout";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const [buying, setBuying] = useState(false);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) *
          100
      )
    : 0;

  const handleStripeBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0 || buying) return;
    try {
      setBuying(true);
      await directStripeCheckoutForProduct({
        productId: product._id,
        quantity: 1,
      });
    } catch (err) {
      console.error(err);
      setBuying(false);
      // optionally show toast
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {product.thumbnail ? (
          <img
            src={`${import.meta.env.VITE_API_ORIGIN}/uploads${product.thumbnail}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-200" />
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-400">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-600 font-medium capitalize mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1 leading-snug mb-2">
          {product.name}
        </h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 fill-amber-400 text-amber-400"
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">(4.9)</span>
        </div>

        {/* Price + actions */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-slate-800">
                    ${product.discountPrice!.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-bold text-slate-800">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                // cart logic
              }}
              className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleStripeBuy}
            disabled={product.stock === 0 || buying}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {buying ? (
              "Redirecting..."
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                Buy now with Stripe
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
