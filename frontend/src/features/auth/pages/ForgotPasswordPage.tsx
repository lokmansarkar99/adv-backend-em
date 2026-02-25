import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ArrowLeft, Send } from "lucide-react";
import { sendOtpSchema, type SendOtpFormValues } from "../auth.validators";
import FormInput from "../../../shared/components/FormInput";
import Button from "../../../shared/components/Button";
import { authApi } from "../api/authApi";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const form = useForm<SendOtpFormValues>({
    resolver: zodResolver(sendOtpSchema),
  });

  const onSubmit = async ({ email }: SendOtpFormValues) => {
    try {
      setLoading(true);
      setServerErr(null);
      // isResetPassword: true → backend sends reset-password OTP [file:19]
      await authApi.sendOtp({ email, isResetPassword: true });
      // Pass email to next step via state
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      setServerErr(err?.response?.data?.message || "Failed to send OTP. Check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Forgot password?</h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Enter your email and we'll send you a reset code.
        </p>
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

        <Button type="submit" fullWidth size="lg" loading={loading}>
          <Send className="w-4 h-4" />
          Send Reset Code
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
