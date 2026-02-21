import express from "express"

import { AuthRoutes } from "../modules/auth/auth.route";
const router = express.Router()

// Auth Routes
router.use("/auth", AuthRoutes)

export default router;