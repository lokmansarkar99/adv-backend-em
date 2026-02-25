

import {
  Users, Package, ShoppingCart, DollarSign,
  TrendingUp, ArrowUpRight, Activity,
} from "lucide-react";
import { useAuth } from "../../features/auth/auth.store";

const stats = [
  { label: "Total Revenue",  value: "$48,295", change: "+12.5%", icon: DollarSign, color: "bg-green-50 text-green-600",   ring: "ring-green-100",  up: true },
  { label: "Total Users",    value: "1,284",   change: "+8.2%",  icon: Users,      color: "bg-indigo-50 text-indigo-600", ring: "ring-indigo-100", up: true },
  { label: "Total Products", value: "342",     change: "+4.1%",  icon: Package,    color: "bg-amber-50 text-amber-600",   ring: "ring-amber-100",  up: true },
  { label: "Total Orders",   value: "2,891",   change: "-1.3%",  icon: ShoppingCart, color: "bg-purple-50 text-purple-600", ring: "ring-purple-100", up: false },
];

const recentUsers = [
  { name: "Rahim Ahmed",    email: "rahim@example.com",  role: "USER",  status: "Active" },
  { name: "Karim Hassan",   email: "karim@example.com",  role: "USER",  status: "Active" },
  { name: "Fatima Begum",   email: "fatima@example.com", role: "ADMIN", status: "Active" },
  { name: "Jamal Uddin",    email: "jamal@example.com",  role: "USER",  status: "Inactive" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Administrator</p>
            <h2 className="text-2xl font-bold">Hello, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening in your store today.</p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-amber-500 items-center justify-center text-2xl font-black text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-xs font-semibold">All systems operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, ring, up }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm ring-1 ${ring} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
                <ArrowUpRight className={`w-3 h-3 ${up ? "" : "rotate-180"}`} />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Recent Users
          </h3>
          <span className="text-xs text-slate-400">{recentUsers.length} users</span>
        </div>
        <div className="divide-y divide-slate-100">
          {recentUsers.map((u) => (
            <div key={u.email} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  u.role === "ADMIN" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {u.role}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin info card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Admin Account Info</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Name",    value: user?.name },
            { label: "Email",   value: user?.email },
            { label: "Role",    value: user?.role },
            { label: "User ID", value: user?._id?.slice(0, 12) + "..." },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
