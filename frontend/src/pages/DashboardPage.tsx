import { useAuth } from "../features/auth/auth.store";

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
        {JSON.stringify({ user, accessToken }, null, 2)}
      </pre>
    </div>
  );
}
