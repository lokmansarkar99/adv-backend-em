import axios from "axios";

export const ACCESS_KEY  = "access_token";
export const REFRESH_KEY = "refresh_token";
const USER_KEY           = "auth_user";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  withCredentials: true, // sends httpOnly cookie along too
});

// ── 1. REQUEST: attach Bearer on every call ──────────
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 2. RESPONSE: auto-refresh on 401 ─────────────────
let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  );
  pendingQueue = [];
}

function forceLogout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/login";
}

http.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    // Only handle 401, and only once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // While a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      });
    }

    original._retry   = true;
    isRefreshing       = true;

    const storedRefresh = localStorage.getItem(REFRESH_KEY);

    if (!storedRefresh) {
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      // Call refresh-token endpoint (backend reads from req.body)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/refresh-token`,
        { refreshToken: storedRefresh },
        { withCredentials: true }
      );

      const newToken: string = data.data.accessToken;
      localStorage.setItem(ACCESS_KEY, newToken);

      flushQueue(null, newToken);

      // Retry the original request (e.g. logout) with the fresh token
      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
