import { useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, MailOpen, RefreshCw } from "lucide-react";
import OtpInput from "../../../shared/components/OtpInput";
import OtpTimer from "../../../shared/components/OtpTimer";
import Button from "../../../shared/components/Button";
import { authApi } from "../api/authApi";

export default function VerifyUserPage() {
  const navigate  = useNavigate();
  const location  = useLocation() as any;
  const email: string = location.state?.email || "";

  const [otp,         setOtp]         = useState("");
  const [loading,     setLoading]     = useState(false);
  const [resending,   setResending]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [success,     setSuccess]     = useState(false);
  const [expired,     setExpired]     = useState(false);
  const [timerReset,  setTimerReset]  = useState(0);

  // If no email in state, user navigated directly
  if (!email) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm mb-4">No email found. Please register first.</p>
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline text-sm">
          Go to Register
        </Link>
      </div>
    );
  }

  const handleVerify = async () => {
    if (otp.length !== 6) { setError("Please enter the full 6-digit OTP."); return; }
    try {
      setLoading(true);
      setError(null);
      // Backend expects otp as NUMBER [file:19]
      await authApi.verifyUser({ email, otp: Number(otp) });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Verification failed. Please try again.");
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
      // isResetPassword: false → account verify flow [file:19]
      await authApi.sendOtp({ email, isResetPassword: false });
      setTimerReset((n) => n + 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleExpire = useCallback(() => setExpired(true), []);

  if (success) {
    return (
      <div className="py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h3>
        <p className="text-sm text-slate-500 mb-6">Your account is active. You can now sign in.</p>
        <Button onClick={() => navigate("/login")} fullWidth size="lg">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
          <MailOpen className="w-7 h-7 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Verify your email</h2>
        <p className="text-sm text-slate-500 mt-1.5">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* OTP boxes */}
      <div className="mb-6">
        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={loading || expired}
          error={Boolean(error)}
        />
      </div>

      {/* Timer / Resend */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {expired ? (
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Code expires in{" "}
            <OtpTimer seconds={120} onExpire={handleExpire} onReset={timerReset} />
          </div>
        )}
      </div>

      {/* Verify button */}
      <Button
        onClick={handleVerify}
        fullWidth
        size="lg"
        loading={loading}
        disabled={otp.length < 6 || expired}
      >
        Verify Account
      </Button>

      <div className="mt-4 text-center text-sm text-slate-500">
        Wrong email?{" "}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Register again
        </Link>
      </div>
    </div>
  );
}
