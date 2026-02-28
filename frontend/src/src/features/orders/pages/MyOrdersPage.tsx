import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../../../features/orders/order.api";
import type{ Order,OrderListMeta, OrderQuery } from "../../../../features/orders/order.types";
import { Loader2, PackageSearch } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrderListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderQuery>({ page: 1, limit: 10 });

  useEffect(() => {
    setLoading(true);
    orderApi
      .getMyOrders(filters)
      .then((res) => {
        setOrders(res.data.data ?? []);
        setMeta(res.data.meta ?? null);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || "Failed to load orders.");
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const goToPage = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-black text-slate-800 mb-4">
        My orders
      </h1>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="py-24 text-center">
          <PackageSearch className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-1">You have no orders yet.</p>
          <Link
            to="/products"
            className="text-sm text-indigo-600 hover:underline"
          >
            Start shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Order", "Date", "Total", "Payment", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">
                        #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.items.length} items
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {order.paymentMethod}
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
              <span>
                Page {meta.page} of {meta.totalPages} ({meta.total}{" "}
                orders)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => goToPage(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
