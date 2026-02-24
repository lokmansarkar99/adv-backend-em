import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "../user/user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

// ================= AUTH =================

// Register
router.post(
  "/register",
  validateRequest(AuthValidation.createRegisterZodSchema),
  AuthController.registerUser
);

// Login
router.post(
  "/login",
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);

// Refresh Token
router.post("/refresh-token", AuthController.refreshToken);

// Logout
router.post(
  "/logout",
  checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
  AuthController.logout
);

// ================= OTP =================

// Send OTP (verify or reset password)
router.post("/send-otp", AuthController.sendOtp);

// Verify Account
router.post("/verify-user", AuthController.userVerify);

// Forget Password
router.post("/forget-password", AuthController.forgetPassword);

export const AuthRoutes = router;