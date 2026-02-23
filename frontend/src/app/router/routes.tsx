import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../../pages/HomePage";
import DashboardPage from "../../pages/DashboardPage";
import NotFoundPage from "../../pages/NotFoundPage";

import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
