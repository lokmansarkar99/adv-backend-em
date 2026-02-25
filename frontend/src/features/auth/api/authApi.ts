import { http } from "../../../shared/api/http";
import type {
  ApiResponse,
  RegisterPayload,
  RegisterResult,
  LoginPayload,
  LoginResult,
  SendOtpPayload,
  VerifyUserPayload,
  ResetPasswordPayload,
} from "../auth.types";

export const authApi = {
  // POST /auth/register
  register(payload: RegisterPayload) {
    return http.post<ApiResponse<RegisterResult>>("/auth/register", payload);
  },

  // POST /auth/login
  // → sets httpOnly refreshToken cookie + returns accessToken in body
  login(payload: LoginPayload) {
    return http.post<ApiResponse<LoginResult>>("/auth/login", payload);
  },

  // POST /auth/logout
  // → requires Authorization: Bearer (handled by http interceptor)
  // → backend calls res.clearCookie("refreshToken")
  logout() {
    return http.post<ApiResponse<null>>("/auth/logout");
  },

  // POST /auth/refresh-token
  refreshToken(refreshToken: string) {
    return http.post<ApiResponse<{ accessToken: string }>>("/auth/refresh-token", {
      refreshToken,
    });
  },

  // POST /auth/send-otp
  sendOtp(payload: SendOtpPayload) {
    return http.post<ApiResponse<{ message: string }>>("/auth/send-otp", payload);
  },

  // POST /auth/verify-user
  verifyUser(payload: VerifyUserPayload) {
    return http.post<ApiResponse<{ message: string }>>("/auth/verify-user", payload);
  },

  // POST /auth/reset-password
  resetPassword(payload: ResetPasswordPayload) {
    return http.post<ApiResponse<{ message: string }>>("/auth/reset-password", payload);
  },
};
