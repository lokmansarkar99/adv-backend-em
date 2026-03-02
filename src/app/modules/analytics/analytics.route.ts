import express          from "express";

import { AnalyticsController } from "./analytics.controller";
const router = express.Router();
import { checkAuth } from "../../middlewares/checkAuth";
import { USER_ROLES } from "../../../enums/user";

router.get("/active-users", checkAuth(USER_ROLES.ADMIN), AnalyticsController.activeUsers)


export const AnalyticsRoutes = router;
