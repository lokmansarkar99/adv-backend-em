import { useAuth } from "../../features/auth/auth.store";
import { User } from "lucide-react";

export default function UserProfile() {
  const { user } = useAuth();
  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Name",  value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Role",  value: user?.role },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
