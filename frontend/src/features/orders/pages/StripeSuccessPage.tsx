import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import { stripeApi } from "../order.api";
import type { Order } from "../order.types";
import Button from "../../../shared/components/Button";

export default function StripeSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing Stripe session ID");
      setLoading(false);
      return;
    }

    stripeApi
      .verifySession(sessionId)
      .then((res) => {
        const data = res.data.data;
        setOrder(data.order);
        setPaymentStatus(data.session.paymentStatus);
        setAmount(data.session.amountTotal);
        setCurrency(data.session.currency);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || "Failed to verify payment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-height-[60vh] py-24">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-sm text-red-500 mb-2">{error || "Order not found."}</p>
        {orderId && (
          <p className="text-xs text-slate-400 mb-4">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
        >
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">
          Payment successful
        </h1>
        <p className="text-sm text-slate-500">
          Your order has been placed and payment confirmed.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-slate-500">Amount paid</p>
            <p className="text-lg font-black text-slate-900">
              {currency?.toUpperCase()} {amount?.toFixed(2)}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-500">Payment status</p>
            <p className="font-semibold text-green-600 capitalize">
              {paymentStatus}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Order items
          </p>
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li
                key={item.product}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  ${(item.subtotal).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-3 text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold text-slate-800">
              ${order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500">Shipping</span>
            <span className="font-semibold text-slate-800">
              ${order.shippingCharge.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500">Discount</span>
            <span className="font-semibold text-slate-800">
              -${order.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-sm font-semibold text-slate-600">
              Total
            </span>
            <span className="text-lg font-black text-slate-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to="/products"
          className="text-sm text-slate-500 hover:text-indigo-600"
        >
          Continue shopping
        </Link>
        <Button asChild>
          <Link to="/orders">View my orders</Link>
        </Button>
      </div>
    </div>
  );
}
