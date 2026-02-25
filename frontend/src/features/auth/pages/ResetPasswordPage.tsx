import { useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../auth.validators";
import OtpInput from "../../../shared/components/OtpInput";
import OtpTimer from "../../../shared/components/OtpTimer";
import Button from "../../../shared/components/Button";
import { authApi } from "../api/authApi";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const email: string = location.state?.email || "";

  const [otp,        setOtp]        = useState("");
  const [loading,    setLoading]    = useState(false);
  const [resending,  setResending]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);
  const [expired,    setExpired]    = useState(false);
  const [timerReset, setTimerReset] = useState(0);
  const [showPw,     setShowPw]     = useState(false);
  const [showCf,     setShowCf]     = useState(false);

  // ✅ useForm BEFORE any conditional return (Rules of Hooks)
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    // ✅ no email/otp here — schema doesn't include them
  });

  const handleExpire = useCallback(() => setExpired(true), []);

  // ── Guard: no email in state ─────────────────────────
  if (!email) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm mb-4">Session expired. Please start over.</p>
        <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline text-sm">
          Forgot Password
        </Link>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────
  if (success) {
    return (
      <div className="py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Password Reset!</h3>
        <p className="text-sm text-slate-500 mb-6">
          Your password has been updated. Sign in with your new password.
        </p>
        <Button onClick={() => navigate("/login")} fullWidth size="lg">
          Go to Login
        </Button>
      </div>
    );
  }

  // ── Submit: form only owns password + confirmPassword ─
  // email comes from location.state, otp from useState
  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await authApi.resetPassword({
        email,
        otp: Number(otp),          // backend expects number
        password: values.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      setOtp("");
      setExpired(false);
      await authApi.sendOtp({ email, isResetPassword: true });
      setTimerReset((n) => n + 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Reset password</h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Enter the code sent to{" "}
          <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* OTP section — NOT registered with react-hook-form */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700 text-center">Enter 6-digit code</p>
          <OtpInput
            value={otp}
            onChange={(val) => { setOtp(val); setError(null); }}
            disabled={loading || expired}
            error={Boolean(error && otp.length < 6)}
          />

          {/* Timer / Resend */}
          <div className="flex items-center justify-center gap-2">
            {expired ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend Code"}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Code expires in{" "}
                <OtpTimer seconds={120} onExpire={handleExpire} onReset={timerReset} />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* New password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">New password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Min 8 characters"
              {...form.register("password")}
              className={`w-full px-4 py-2.5 pr-11 text-sm rounded-xl border outline-none transition-all bg-white
                ${form.formState.errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Confirm password</label>
          <div className="relative">
            <input
              type={showCf ? "text" : "password"}
              placeholder="Repeat password"
              {...form.register("confirmPassword")}
              className={`w-full px-4 py-2.5 pr-11 text-sm rounded-xl border outline-none transition-all bg-white
                ${form.formState.errors.confirmPassword
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowCf((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          disabled={otp.length < 6 || expired}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
