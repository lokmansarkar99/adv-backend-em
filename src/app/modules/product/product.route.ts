import express           from "express";
import { checkAuth }     from "../../middlewares/checkAuth";
import validateRequest   from "../../middlewares/validateRequest";

import fileUploadHandler from "../../middlewares/fileUploadHandler";

import { USER_ROLES }    from "../../../enums/user";
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";

const router = express.Router();

// ── PUBLIC ─────────────────────────────────────────

// GET /api/v1/products
// ?page=1&limit=10&search=iphone&category=electronics
// &minPrice=100&maxPrice=999&sortBy=price&sortOrder=asc
router.get(
  "/",
  ProductController.getAllProducts
);

// GET /api/v1/products/:id
router.get(
  "/:id",
  validateRequest(ProductValidation.getProductByIdZodSchema),
  ProductController.getProductById
);

// ── ADMIN ──────────────────────────────────────────

// POST /api/v1/products
// IMPORTANT: middleware order matters for multipart/form-data
// 1. checkAuth  — validates JWT (does NOT touch body)
// 2. fileUploadHandler — multer parses multipart body into req.body + req.files
// 3. validateRequest — Zod runs AFTER body is populated
router.post(
  "/",
  checkAuth(USER_ROLES.ADMIN),
  fileUploadHandler(),                                          // ← must be before validateRequest
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);

// PATCH /api/v1/products/:id
router.patch(
  "/:id",
  checkAuth(USER_ROLES.ADMIN),
  fileUploadHandler(),                                          // ← must be before validateRequest
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);

// PATCH /api/v1/products/:id/status  (JSON body — no file upload needed)
router.patch(
  "/:id/status",
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(ProductValidation.updateProductStatusZodSchema),
  ProductController.updateProductStatus
);

// DELETE /api/v1/products/:id
router.delete(
  "/:id",
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(ProductValidation.getProductByIdZodSchema),
  ProductController.deleteProduct
);

export const ProductRoutes = router;