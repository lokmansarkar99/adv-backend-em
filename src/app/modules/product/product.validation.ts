import { z } from "zod";
import { checkValidID } from "../../../shared/chackValid";

import { PRODUCT_STATUS } from "../../../enums/product";

// ── Helpers ────────────────────────────────────────
// multer always delivers form-data fields as strings.
// These helpers coerce & trim so Zod never sees undefined/null
// for fields the client did send.

const requiredString = (min: number, label: string) =>
  z.string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`);

const optionalString = (min: number) =>
  z.string().trim().min(min).optional();

// ── Create Product ─────────────────────────────────
const createProductZodSchema = z.object({
  body: z.object({
    name: requiredString(3, "Name"),

    description: requiredString(10, "Description"),

    price: z.coerce
      .number()
      .min(0, "Price cannot be negative"),

    discountPrice: z.coerce
      .number()
      .min(0, "Discount price cannot be negative")
      .optional(),

    stock: z.coerce
      .number()
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .default(0),

    category: requiredString(2, "Category"),

    tags: z
      .union([
        z.array(z.string()),
        z.string().transform((val) => val.split(",")),
        // form-data: "apple,phone" → ["apple", "phone"]
      ])
      .optional()
      .default([]),

    status: z
      .enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE, PRODUCT_STATUS.DRAFT])
      .default(PRODUCT_STATUS.ACTIVE)
      .optional(),
  }),
});

// ── Update Product ─────────────────────────────────
const updateProductZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid product ID"),
  }),
  body: z.object({
    name: optionalString(3),

    description: optionalString(10),

    price: z.coerce
      .number()
      .min(0, "Price cannot be negative")
      .optional(),

    discountPrice: z.coerce
      .number()
      .min(0)
      .nullable()
      .optional(),

    stock: z.coerce
      .number()
      .int()
      .min(0)
      .optional(),

    category: optionalString(2),

    tags: z
      .union([
        z.array(z.string()),
        z.string().transform((val) => val.split(",")),
      ])
      .optional(),

    removeImages: z
      .union([
        z.array(z.string()),
        z.string().transform((val) => [val]),
        // single string → array
      ])
      .optional(),
  }),
});

// ── Update Status ──────────────────────────────────
const updateProductStatusZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid product ID"),
  }),
  body: z.object({
    status: z.enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.INACTIVE, PRODUCT_STATUS.DRAFT]),
  }),
});

// ── Get By ID ──────────────────────────────────────
const getProductByIdZodSchema = z.object({
  params: z.object({
    id: checkValidID("Invalid product ID"),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
  updateProductStatusZodSchema,
  getProductByIdZodSchema,
};

// ── Payload Types ──────────────────────────────────
export type CreateProductPayload = z.infer<
  typeof createProductZodSchema
>["body"];

export type UpdateProductPayload = z.infer<
  typeof updateProductZodSchema
>["body"];

export type UpdateProductStatusPayload = z.infer<
  typeof updateProductStatusZodSchema
>["body"];