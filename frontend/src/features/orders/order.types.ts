// src/features/orders/order.types.ts
import { z } from "zod";
import { type CreateOrderPayload as BackendCreateOrderPayload } from '../../../../src/app/modules/order/order.validation' // or copy type manually

export type CreateOrderPayload = BackendCreateOrderPayload;
// i.e.:
export type CreateOrderPayload = {
  items: { product: string; quantity: number }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: "STRIPE" | "COD";
  note?: string;
};
