import { ShoppingCart, Heart, Package, Star, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth } from "../../features/auth/auth.store";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Orders",   value: "12",  sub: "+2 this month",  icon: ShoppingCart, color: "bg-indigo-50 text-indigo-600",  ring: "ring-indigo-100" },
  { label: "Wishlist Items", value: "8",   sub: "3 on sale",       icon: Heart,        color: "bg-pink-50 text-pink-600",     ring: "ring-pink-100" },
  { label: "Delivered",      value: "9",   sub: "All on time",     icon: Package,      color: "bg-green-50 text-green-600",   ring: "ring-green-100" },
  { label: "Reviews Left",   value: "5",   sub: "Keep it up!",     icon: Star,         color: "bg-amber-50 text-amber-600",   ring: "ring-amber-100" },
];

const recentOrders = [
  { id: "#ORD-1001", item: "Wireless Headphones", date: "Feb 22, 2026", status: "Delivered",  amount: "$79.99" },
  { id: "#ORD-1002", item: "Running Shoes",        date: "Feb 20, 2026", status: "Shipped",    amount: "$129.00" },
  { id: "#ORD-1003", item: "Smart Watch",          date: "Feb 18, 2026", status: "Processing", amount: "$249.00" },
];

const statusColors: Record<string, string> = {
  Delivered:  "bg-green-100 text-green-700",
  Shipped:    "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Cancelled:  "bg-red-100 text-red-700",
};

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg shadow-indigo-200/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-indigo-200 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/20 items-center justify-center text-3xl font-black">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
            {user?.role} account
          </span>
          <TrendingUp className="w-4 h-4 text-indigo-200" />
          <span className="text-indigo-200 text-xs">Member since 2026</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, ring }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm ring-1 ${ring} hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Orders</h3>
          <Link
            to="/user/orders"
            className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-800">{order.item}</p>
                <p className="text-xs text-slate-400 mt-0.5">{order.id} · {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <span className="text-sm font-bold text-slate-700">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User info card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name",  value: user?.name },
            { label: "Email",      value: user?.email },
            { label: "Role",       value: user?.role },
            { label: "User ID",    value: user?._id?.slice(0, 16) + "..." },
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
