import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.store";

type Props = { allowedRole?: "ADMIN" | "USER" };

export default function ProtectedRoute({ allowedRole }: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // wrong role — redirect to their actual dashboard
    const fallback = user?.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
