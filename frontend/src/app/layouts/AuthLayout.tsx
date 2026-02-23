import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">Home</Link>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main style={{ marginTop: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
