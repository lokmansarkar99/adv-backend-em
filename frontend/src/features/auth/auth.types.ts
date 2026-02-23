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

export type LoginResult = {
  accessToken: string;
  refeshToken: string;
  user: AuthUser;
};
