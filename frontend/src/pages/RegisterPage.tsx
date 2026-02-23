import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormValues } from "../src/features/auth/auth.validators";
import { useAuth } from "../features/auth/auth.store";
import FormInput from "../shared/components/FormInput";
import Button from "../shared/components/Button";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setServerErr(null);
      const res = await registerUser(values);
      setServerMsg(res.message);
      form.reset({ name: "", email: "", password: "", role: "USER", profileImage: "" });
    } catch (err: any) {
      setServerMsg(null);
      setServerErr(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create account</h2>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <FormInput label="Email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <FormInput label="Password" type="password" {...form.register("password")} error={form.formState.errors.password?.message} />
        <FormInput label="Profile image (optional url)" {...form.register("profileImage")} />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </Button>
      </form>

      {serverMsg ? <p style={{ marginTop: 12, color: "green" }}>{serverMsg}</p> : null}
      {serverErr ? <p style={{ marginTop: 12, color: "crimson" }}>{serverErr}</p> : null}
    </div>
  );
}
