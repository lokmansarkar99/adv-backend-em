import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "../auth.validators";
import { useAuth } from "../auth.store";
import FormInput from "../../../shared/components/FormInput";
import Button from "../../../shared/components/Button";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setServerErr(null);
      await registerUser(values);
      // Go straight to verify page with the email pre-filled
      navigate("/verify-email", { state: { email: values.email } });
    } catch (err: any) {
      setServerErr(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
        <p className="text-sm text-slate-500 mt-1">Start your shopping journey today</p>
      </div>

      {serverErr && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {serverErr}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Full name" placeholder="John Doe" {...form.register("name")} error={form.formState.errors.name?.message} />
        <FormInput label="Email address" type="email" placeholder="you@example.com" {...form.register("email")} error={form.formState.errors.email?.message} />
        <FormInput label="Password" type="password" placeholder="Min 8 characters" {...form.register("password")} error={form.formState.errors.password?.message} />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Account type</label>
          <select
            {...form.register("role")}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value="USER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          <UserPlus className="w-4 h-4" />
          Create account
        </Button>
      </form>

      <p className="mt-3 text-xs text-slate-400 text-center">
        By signing up, you agree to our{" "}
        <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{" "}
        <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
      </p>

      <div className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
