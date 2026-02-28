// src/features/orders/utils/directCheckout.ts
import { PAYMENT_METHOD } from "../../../../../src/enums/oder";
import { orderApi, stripeApi } from "../order.api";
import type { CreateOrderPayload } from "../order.types";

export async function directStripeCheckoutForProduct(opts: {
  productId: string;
  quantity?: number;
}) {
  const { productId, quantity = 1 } = opts;

  // basic guard: productId must look like a Mongo ObjectId (24 hex chars)
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    throw new Error("Invalid product ID for direct checkout");
  }

  const payload: CreateOrderPayload = {
    items: [
      {
        product: productId,        // string ObjectId – Zod checkValidID will validate this
        quantity: Number(quantity) // z.coerce.number().int().min(1)
      },
    ],
    shippingAddress: {
      fullName: "Guest User",     // valid string, >= 3 chars
      phone: "0123456789",        // >= 7 chars
      address: "Dhaka",           // >= 5 chars
      city: "Dhaka",              // >= 2 chars
      zip: "1200",                // >= 4 chars
      country: "Bangladesh",      // matches default
    },
    paymentMethod: PAYMENT_METHOD.STRIPE,
    note: "Direct checkout from product page",
  };

  try {
    const orderRes = await orderApi.create(payload);
    const order = orderRes.data.data;
    if (!order?._id) {
      throw new Error("Order creation failed");
    }

    const stripeRes = await stripeApi.createCheckoutSession(order._id);
    const { sessionUrl } = stripeRes.data.data;
    if (!sessionUrl) {
      throw new Error("Failed to create Stripe checkout session");
    }

    window.location.href = sessionUrl;
  } catch (err: any) {
    // log full backend error so you can see field-level messages if exposed later
    console.error(
      "Direct checkout error:",
      err?.response?.data || err
    );
    throw err;
  }
}
