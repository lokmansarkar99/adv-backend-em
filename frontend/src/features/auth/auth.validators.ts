import { z } from "zod";

// ── Login ──────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ── Register ───────────────────────────────────────────
export const registerSchema = z.object({
  name:         z.string().min(3, "Name must be at least 3 characters"),
  email:        z.string().email("Invalid email address"),
  password:     z.string().min(8, "Password must be at least 8 characters"),
  role:         z.enum(["ADMIN", "USER"]).optional(),
  profileImage: z.string().optional(),
});

// ── Verify user (account activation) ──────────────────
// Backend expects otp as NUMBER [file:19]
export const verifyUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be digits only"),
});

// ── Send OTP (both flows share this) ──────────────────
export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues         = z.infer<typeof loginSchema>;
export type RegisterFormValues      = z.infer<typeof registerSchema>;
export type VerifyUserFormValues    = z.infer<typeof verifyUserSchema>;
export type SendOtpFormValues       = z.infer<typeof sendOtpSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
