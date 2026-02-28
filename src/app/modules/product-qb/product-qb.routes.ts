// src/app/modules/product/product.route.ts
import { Router } from "express";
import { getAllProductsQB } from "./product-qb.controller";

const router = Router();

// Existing routes...

// 🔥 NEW: QueryBuilder Demo Route
router.get("/qb-demo", getAllProductsQB);  // ← এই route test করো

export const ProductQBRoutes = router;
