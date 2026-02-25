import React, { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "./api/authApi";
import { ACCESS_KEY, REFRESH_KEY } from "../../shared/api/http";
import type { AuthUser, LoginPayload, RegisterPayload } from "./auth.types";

const USER_KEY = "auth_user";

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

type AuthCtx = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<{ message: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_KEY)
  );

  const value = useMemo<AuthCtx>(() => ({
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),

    // ── LOGIN ────────────────────────────────────────
    // Backend returns both tokens in body + sets refreshToken httpOnly cookie.
    // We store accessToken (for Bearer) + refreshToken (for /refresh-token body call).
    login: async (payload) => {
      const res = await authApi.login(payload);
      const { accessToken: token, refreshToken, user: u } = res.data.data;

      localStorage.setItem(ACCESS_KEY, token);
      localStorage.setItem(REFRESH_KEY, refreshToken); // needed by refresh interceptor
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setAccessToken(token);
      setUser(u);
      return u;
    },

    // ── REGISTER ─────────────────────────────────────
    register: async (payload) => {
      const res = await authApi.register(payload);
      return { message: res.data.data?.message || res.data.message };
    },

    // ── LOGOUT ───────────────────────────────────────
    // Flow:
    //   1. http interceptor adds Bearer token automatically
    //   2. If token expired → interceptor refreshes it → retries logout
    //   3. Backend receives valid token → checkAuth passes → clears httpOnly cookie
    //   4. finally block always clears localStorage + React state
    logout: async () => {
      try {
        await authApi.logout();
      } catch {
        // Even if the API fails, clean up locally
      } finally {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setAccessToken(null);
        setUser(null);
      }
    },
  }), [user, accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
