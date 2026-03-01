import { createBrowserRouter } from "react-router-dom";

import AuthLayout    from "../layouts/AuthLayout";
import PublicLayout  from "../layouts/PublicLayout";
import UserLayout    from "../layouts/UserLayout";
import AdminLayout   from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage           from "../../pages/HomePage";
import NotFoundPage       from "../../pages/NotFoundPage";
import LoginPage          from "../../features/auth/pages/LoginPage";
import RegisterPage       from "../../features/auth/pages/RegisterPage";
import VerifyUserPage     from "../../features/auth/pages/VerifyUserPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage  from "../../features/auth/pages/ResetPasswordPage";
import UserDashboard      from "../../pages/user/DashboardPage";
import UserProfile        from "../../pages/user/ProfilePage";
import AdminDashboard     from "../../pages/admin/DashboardPage";
import ProductsPage       from "../../features/products/pages/ProductsPage";
import ProductDetailPage  from "../../features/products/pages/ProductDetailPage";
import AdminProductsPage  from "../../features/products/admin/AdminProductsPage";
import CheckoutPage       from "../../features/orders/pages/CheckoutPage";
import MyOrdersPage from "../../src/features/orders/pages/MyOrdersPage";
import StripeSuccessPage  from "../../features/orders/pages/StripeSuccessPage";
import GoogleOAuthSuccess from "../../features/auth/pages/GoogleOAuthSuccess";

export const router = createBrowserRouter([

  /* ── Public ──────────────────────────────── */
  {
    element: <PublicLayout />,
    children: [
      { path: "/",              element: <HomePage /> },
      { path: "/products",      element: <ProductsPage /> },
      { path: "/products/:id",  element: <ProductDetailPage /> },
      { path: "/checkout",      element: <CheckoutPage /> },
      { path: "/orders",        element: <MyOrdersPage /> },
      { path: "/payment-success", element: <StripeSuccessPage /> },
    ],
  },

  /* ── Auth (centered card) ────────────────── */
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",           element: <LoginPage /> },
      { path: "/register",        element: <RegisterPage /> },
      { path: "/verify-email",    element: <VerifyUserPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password",  element: <ResetPasswordPage /> },
    ],
  },

  /* ── 🚀 Google OAuth Success — STANDALONE (no layout wrapper) ── */
  {
    path: "/auth/google/success",
    element: <GoogleOAuthSuccess />,
  },

  /* ── User dashboard ──────────────────────── */
  {
    element: <ProtectedRoute allowedRole="USER" />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "/user/dashboard", element: <UserDashboard /> },
          { path: "/user/orders",    element: <MyOrdersPage /> },
          { path: "/user/profile",   element: <UserProfile /> },
          { path: "/user/settings",  element: <div className="p-4 text-slate-400">Settings coming soon</div> },
        ],
      },
    ],
  },

  /* ── Admin dashboard ─────────────────────── */
  {
    element: <ProtectedRoute allowedRole="ADMIN" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/users",     element: <div className="p-4 text-slate-400">Users coming soon</div> },
          { path: "/admin/products",  element: <AdminProductsPage /> },
          { path: "/admin/orders",    element: <div className="p-4 text-slate-400">Orders coming soon</div> },
          { path: "/admin/analytics", element: <div className="p-4 text-slate-400">Analytics coming soon</div> },
          { path: "/admin/settings",  element: <div className="p-4 text-slate-400">Settings coming soon</div> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
