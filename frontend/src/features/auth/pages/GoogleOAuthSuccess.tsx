import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { ACCESS_KEY, REFRESH_KEY } from "../../../shared/api/http";
import { http } from "../../../shared/api/http";
import type { AuthUser } from "../auth.types";

const USER_KEY = "auth_user";

export default function GoogleOAuthSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing Google login...");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      setStatus("error");
      setMessage("No access token received.");
      setTimeout(() => {
        window.location.replace("/login?error=google_auth_failed");
      }, 2000);
      return;
    }

    const handleAuth = async () => {
      try {
        // 1️⃣ Save token to localStorage immediately
        localStorage.setItem(ACCESS_KEY, accessToken);

        // 2️⃣ Verify token + get user data
        const res = await http.get("/user/profile");
        const userData: AuthUser = res.data.data;

        // 3️⃣ Save user to localStorage (same key AuthProvider reads)
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        setStatus("success");
        setMessage("Redirecting to your dashboard...");

        // 4️⃣ 🚀 window.location.replace() forces full page reload
        //    → AuthProvider re-mounts → reads localStorage → isAuthenticated = true
        //    → ProtectedRoute lets through ✅
        const targetPath = userData.role === "ADMIN"
          ? "/admin/dashboard"
          : "/user/dashboard";

        setTimeout(() => {
          window.location.replace(targetPath);
        }, 1000);

      } catch (err: any) {
        console.error("❌ Google auth failed:", err?.response?.data || err);
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setStatus("error");
        setMessage("Google login failed. Please try again.");
        setTimeout(() => {
          window.location.replace("/login?error=google_auth_failed");
        }, 2000);
      }
    };

    handleAuth();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Signing you in...
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-11 h-11 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Login Successful!
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-11 h-11 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Login Failed
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
            <p className="text-xs text-slate-400 mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
