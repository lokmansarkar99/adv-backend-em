import express from "express"

import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductRoutes } from "../modules/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import { StripeRoutes } from "../modules/stripe/stripe.route";
import { ProductQBRoutes } from "../modules/product-qb/product-qb.routes";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";
const router = express.Router()

// Auth Routes
router.use("/auth", AuthRoutes)

router.use("/user", UserRoutes)
router.use("/products", ProductRoutes)
router.use("/orders", OrderRoutes)
router.use("/stripe", StripeRoutes)
router.use("/product-qb", ProductQBRoutes)
router.use("/analytics", AnalyticsRoutes)
export default router;