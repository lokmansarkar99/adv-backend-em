import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.store";

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <div style={{ maxWidth: 980, margin: "32px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <button onClick={logout}>Logout</button>
      </header>

      <main style={{ marginTop: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
