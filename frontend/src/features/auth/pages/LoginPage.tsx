import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { loginSchema, type LoginFormValues } from "../auth.validators";
import { useAuth } from "../auth.store";
import FormInput from "../../../shared/components/FormInput";
import Button from "../../../shared/components/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation() as any;
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

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
        <FormInput label="Email address" type="email" placeholder="you@example.com" {...form.register("email")} error={form.formState.errors.email?.message} />

        <div>
          <FormInput label="Password" type="password" placeholder="Min 8 characters" {...form.register("password")} error={form.formState.errors.password?.message} />
          <div className="text-right mt-1.5">
            <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
      </div>
    </div>
  );
}
