import { http } from "../../../shared/api/http";
import type {
  ApiResponse,
  RegisterPayload,
  RegisterResult,
  LoginPayload,
  LoginResult,
} from "../auth.types";

export const authApi = {
  register(payload: RegisterPayload) {
    return http.post<ApiResponse<RegisterResult>>("/auth/register", payload);
  },
  login(payload: LoginPayload) {
    return http.post<ApiResponse<LoginResult>>("/auth/login", payload);
  },
};
