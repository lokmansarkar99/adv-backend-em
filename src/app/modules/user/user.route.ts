import express from "express";

const router = express.Router();

import { checkAuth } from "../../middlewares/checkAuth";
import { USER_ROLES } from "../../../enums/user";
import { userController } from "./user.controller";


router.get("/profile", checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),  userController.getMe);




export const UserRoutes = router;