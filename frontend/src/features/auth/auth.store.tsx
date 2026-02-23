import React, { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "./api/authApi";
import type { AuthUser, LoginPayload, RegisterPayload } from "./auth.types";

type AuthCtx = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const ACCESS_TOKEN_KEY = "accessToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const isAuthenticated = Boolean(accessToken);

  const value = useMemo<AuthCtx>(() => {
    return {
      user,
      accessToken,
      isAuthenticated,

      login: async (payload) => {
        const res = await authApi.login(payload);
        const { accessToken, user } = res.data.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        setAccessToken(accessToken);
        setUser(user);
      },

      register: async (payload) => {
        const res = await authApi.register(payload);
        // backend sends OTP and expects verification before login [file:3]
        return { message: res.data.data.message || res.data.message };
      },

      logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
        setUser(null);
      },
    };
  }, [user, accessToken, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
