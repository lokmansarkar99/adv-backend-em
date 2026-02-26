import { z } from "zod";
import { checkValidID } from "../../../shared/chackValid";
import { ORDER_STATUS, PAYMENT_METHOD } from "../../../enums/oder";

// ── Order Item (nested) ────────────────────────────
const orderItemSchema = z.object({
  product:  checkValidID("Invalid product ID"),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

// ── Shipping Address (nested) ──────────────────────
const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  phone:    z.string().trim().min(7, "Phone must be at least 7 characters"),
  address:  z.string().trim().min(5, "Address must be at least 5 characters"),
  city:     z.string().trim().min(2, "City must be at least 2 characters"),
  zip:      z.string().trim().min(4, "ZIP must be at least 4 characters"),
  country:  z.string().trim().default("Bangladesh"),
});

// ── Create Order ───────────────────────────────────
const createOrderZodSchema = z.object({
  body: z.object({
    items: z
      .array(orderItemSchema)
      .min(1, "Order must have at least one item"),

    shippingAddress: shippingAddressSchema,

    paymentMethod: z
      .enum([PAYMENT_METHOD.STRIPE, PAYMENT_METHOD.COD])
      .default(PAYMENT_METHOD.COD),

    note: z.string().trim().optional(),
  }),
});

// ── Update Order Status (admin) 
// ── Update Order Status (admin) ────────────────────
const updateOrderStatusZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid order ID"),
  }),
  body: z.object({
    status: z.enum(
      [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PAID,
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.REFUNDED,
      ] as [string, ...string[]],
      { message: "Invalid status value" }
    ),
  }),
});


// ── Cancel Order (user) ────────────────────────────
const cancelOrderZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid order ID"),
  }),
});

// ── Get By ID ──────────────────────────────────────
const getOrderByIdZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid order ID"),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderStatusZodSchema,
  cancelOrderZodSchema,
  getOrderByIdZodSchema,
};

// ── Payload Types ──────────────────────────────────
export type CreateOrderPayload       = z.infer<typeof createOrderZodSchema>["body"];
export type UpdateOrderStatusPayload = z.infer<typeof updateOrderStatusZodSchema>["body"];
