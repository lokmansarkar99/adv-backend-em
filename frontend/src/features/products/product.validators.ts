import { z } from "zod";

export const createProductSchema = z.object({
  name:          z.string().min(3,  "Name must be at least 3 characters"),
  description:   z.string().min(10, "Description must be at least 10 characters"),
  price:         z.coerce.number().min(0, "Price cannot be negative"),
  discountPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  stock:         z.coerce.number().int().min(0).default(0),
  category:      z.string().min(2, "Category is required"),
  tags:          z.string().optional(), // comma-separated → backend splits
  status:        z.enum(["active", "inactive", "draft"]).default("active"),
});

export const updateProductSchema = createProductSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["active", "inactive", "draft"]),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
