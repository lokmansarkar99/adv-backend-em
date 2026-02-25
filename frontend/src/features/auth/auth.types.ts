export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  profileImage?: string;
};

export type RegisterResult = {
  message: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// Exact shape from your real API response
export type LoginResult = {
  accessToken: string;
  refreshToken: string;   // set as httpOnly cookie by backend, also in body
  user: AuthUser;
};


export type SendOtpPayload = {
  email: string;
  isResetPassword?: boolean;
};

export type VerifyUserPayload = {
  email: string;
  otp: number;
};

export type ResetPasswordPayload = {
  email: string;
  otp: number;
  password: string;
};