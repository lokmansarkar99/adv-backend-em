import type { ProductStatus } from "../product.types";

const map: Record<ProductStatus, string> = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-500",
  draft:    "bg-amber-100 text-amber-700",
};

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
