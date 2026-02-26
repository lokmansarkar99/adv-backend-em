import express from "express";

const router = express.Router();

import { checkAuth } from "../../middlewares/checkAuth";
import { USER_ROLES } from "../../../enums/user";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { AuthController } from "../auth/auth.controller";

router.get(
  "/profile",
  checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
  userController.getMe,
);

router
  .route("/my-profile")
  .get(
    checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
    userController.getMyProfile,
  )
  .patch(
    checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
    fileUploadHandler(),
    validateRequest(UserValidation.updateMyProfileSchema),
    userController.updateProfile,
  );


  router.route("/users").get(checkAuth(USER_ROLES.ADMIN), userController.allUsers)

export const UserRoutes = router;
