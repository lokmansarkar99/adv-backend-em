import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { authApi } from "./api/authApi";
import { ACCESS_KEY, REFRESH_KEY, http } from "../../shared/api/http";
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
  handleGoogleAuth: () => void;
  initializeAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<AuthUser | null>(getStoredUser);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_KEY)
  );
  const [initialized, setInitialized] = useState(false);

  // 🚀 useCallback for stable function reference
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_KEY);
    if (!token) return;
    try {
      const res = await http.get("/user/profile");
      const userData = res.data.data as AuthUser;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      setAccessToken(token);
    } catch {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    initializeAuth().finally(() => setInitialized(true));
  }, [initializeAuth]);

  const value = useMemo<AuthCtx>(() => ({
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),

    login: async (payload) => {
      const res = await authApi.login(payload);
      const { accessToken: token, refreshToken, user: u } = res.data.data;
      localStorage.setItem(ACCESS_KEY, token);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setAccessToken(token);
      setUser(u);
      return u;
    },

    register: async (payload) => {
      const res = await authApi.register(payload);
      return { message: res.data.data?.message || res.data.message };
    },

    logout: async () => {
      try { await authApi.logout(); } catch {}
      finally {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setAccessToken(null);
        setUser(null);
      }
    },

    // 🚀 VITE_API_ORIGIN = "http://localhost:5002/api/v1"
    //    so append /auth/google only (NOT /api/v1/auth/google)
    handleGoogleAuth: () => {
      const base = (import.meta.env.VITE_API_ORIGIN as string) || "http://localhost:5002/api/v1";
      window.location.href = `${base}/auth/google`;
    },

    initializeAuth,
  }), [user, accessToken, initializeAuth]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
