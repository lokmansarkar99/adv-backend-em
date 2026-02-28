import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CreditCard, Truck, Loader2 } from "lucide-react";
import { z } from "zod";
import { orderApi, stripeApi } from "../order.api";
import type { CreateOrderPayload, PaymentMethod } from "../order.types";
import FormInput from "../../../shared/src/shared/components/FormInput";
import Button from "../../../shared/components/Button";
// import { useCart } from "../../cart/useCart"; // your cart hook

const shippingSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(8, "Phone is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(2, "ZIP is required"),
  country: z.string().min(2, "Country is required"),
});

const checkoutSchema = z.object({
  shippingAddress: shippingSchema,
  paymentMethod: z.enum(["COD", "STRIPE"]),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  // const { items: cartItems, total, clearCart } = useCart();
  const cartItems: { productId: string; name: string; price: number; quantity: number }[] = []; // replace

  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
      shippingAddress: {
        country: "Bangladesh",
      } as any,
    },
  });

  const paymentMethodWatch = form.watch("paymentMethod");

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      setServerErr("Your cart is empty.");
      return;
    }

    const payload: CreateOrderPayload = {
      items: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: values.shippingAddress,
      paymentMethod: values.paymentMethod as PaymentMethod,
      note: values.note,
    };

    try {
      setSubmitting(true);
      setServerErr(null);

      // 1) Create order
      const orderRes = await orderApi.create(payload);
      const order = orderRes.data.data;

      if (!order) {
        throw new Error("Order creation failed");
      }

      // 2) If COD, go to success page directly
      if (order.paymentMethod === "COD") {
        // clearCart();
        navigate(`/orders/${order._id}?mode=cod-success`);
        return;
      }

      // 3) If STRIPE, create checkout session and redirect
      const stripeRes = await stripeApi.createCheckoutSession(order._id);
      const sessionUrl = stripeRes.data.data.sessionUrl;

      if (!sessionUrl) {
        throw new Error("Failed to create Stripe session");
      }

      window.location.href = sessionUrl; // full redirect to Stripe-hosted page
    } catch (err: any) {
      console.error(err);
      setServerErr(err?.response?.data?.message || err.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>
        <h1 className="text-2xl font-black text-slate-800">Checkout</h1>
      </div>

      {serverErr && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {serverErr}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-500" />
            Shipping address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full name"
              {...form.register("shippingAddress.fullName")}
              error={form.formState.errors.shippingAddress?.fullName?.message}
            />
            <FormInput
              label="Phone"
              {...form.register("shippingAddress.phone")}
              error={form.formState.errors.shippingAddress?.phone?.message}
            />
            <FormInput
              label="Address"
              className="sm:col-span-2"
              {...form.register("shippingAddress.address")}
              error={form.formState.errors.shippingAddress?.address?.message}
            />
            <FormInput
              label="City"
              {...form.register("shippingAddress.city")}
              error={form.formState.errors.shippingAddress?.city?.message}
            />
            <FormInput
              label="ZIP / Postal code"
              {...form.register("shippingAddress.zip")}
              error={form.formState.errors.shippingAddress?.zip?.message}
            />
            <FormInput
              label="Country"
              {...form.register("shippingAddress.country")}
              error={form.formState.errors.shippingAddress?.country?.message}
            />
          </div>

          <div className="border-t border-slate-100 my-2" />

          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Payment method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethodWatch === "COD"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                value="COD"
                {...form.register("paymentMethod")}
                className="hidden"
              />
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                ৳
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Cash on Delivery
                </p>
                <p className="text-xs text-slate-500">
                  Pay when you receive the order.
                </p>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethodWatch === "STRIPE"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                value="STRIPE"
                {...form.register("paymentMethod")}
                className="hidden"
              />
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-indigo-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Pay with Card (Stripe)
                </p>
                <p className="text-xs text-slate-500">
                  Secure card payment powered by Stripe.
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Order note (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Any additional instructions for delivery..."
              {...form.register("note")}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none bg-white"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={cartItems.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing order...
                </>
              ) : paymentMethodWatch === "STRIPE" ? (
                "Pay with Stripe"
              ) : (
                "Place order"
              )}
            </Button>
          </div>
        </form>

        {/* Right: summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Order summary
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-sm text-slate-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 mb-4">
                {cartItems.map((item) => (
                  <li
                    key={item.productId}
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
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-slate-800">
                  {totalAmount >= 1000 ? "Free" : "$60.00"}
                </span>
              </div>
              <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Total
                </span>
                <span className="text-lg font-black text-slate-900">
                  $
                  {(
                    totalAmount + (totalAmount >= 1000 ? 0 : 60)
                  ).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
