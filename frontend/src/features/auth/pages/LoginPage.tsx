import { useState, useEffect } from "react";  // ✅ Add useEffect
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail } from "lucide-react";
import { loginSchema, type LoginFormValues } from "../auth.validators";
import { useAuth } from "../auth.store";
import FormInput from "../../../shared/components/FormInput";
import Button from "../../../shared/components/Button";

export default function LoginPage() {
  const { login, handleGoogleAuth } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation() as any;
  const [searchParams]          = useSearchParams();
  const [loading,   setLoading] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  // ✅ Fix Bug 4: useEffect instead of useState for side-effects
  const error = searchParams.get("error");
  useEffect(() => {
    if (error === "google_auth_failed") {
      setServerErr("Google login failed. Please try again.");
    } else if (error === "invalid_token") {
      setServerErr("Session expired. Please login again.");
    }
  }, [error]);

  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setServerErr(null);
      const user = await login(values);
      const from = location.state?.from;
      navigate(
        from ?? (user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"),
        { replace: true }
      );
    } catch (err: any) {
      setServerErr(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to your ShopLux account</p>
      </div>

      {serverErr && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {serverErr}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <div>
          <FormInput
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <div className="text-right mt-1.5">
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      </form>

      {/* Google OAuth */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <span className="relative px-4 bg-white text-xs text-slate-400 uppercase tracking-wide">
          Or continue with
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        className="flex items-center justify-center gap-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 text-sm h-12 transition-colors"
        onClick={handleGoogleAuth}
      >
        {/* Google SVG icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="mt-5 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
