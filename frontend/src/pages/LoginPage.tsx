import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../src/features/auth/auth.validators";
import { useAuth } from "../features/auth/auth.store";
import FormInput from "../shared/components/FormInput";
import Button from "../shared/components/Button";
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const from = location.state?.from || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setServerErr(null);
      await login(values);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerErr(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput label="Email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <FormInput label="Password" type="password" {...form.register("password")} error={form.formState.errors.password?.message} />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {serverErr ? <p style={{ marginTop: 12, color: "crimson" }}>{serverErr}</p> : null}
    </div>
  );
}
