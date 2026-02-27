import express from "express"

import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductRoutes } from "../modules/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import { StripeRoutes } from "../modules/stripe/stripe.route";
const router = express.Router()

// Auth Routes
router.use("/auth", AuthRoutes)

router.use("/user", UserRoutes)
router.use("/products", ProductRoutes)
router.use("/orders", OrderRoutes)
router.use("/stripe", StripeRoutes)
export default router;