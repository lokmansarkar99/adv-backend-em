import { Outlet, NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  BarChart3, Settings, LogOut, Menu, X,
  ShoppingBag, Bell, Shield,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../features/auth/auth.store";

const navItems = [
  { label: "Dashboard",  to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users",      to: "/admin/users",      icon: Users },
  { label: "Products",   to: "/admin/products",   icon: Package },
  { label: "Orders",     to: "/admin/orders",     icon: ShoppingCart },
  { label: "Analytics",  to: "/admin/analytics",  icon: BarChart3 },
  { label: "Settings",   to: "/admin/settings",   icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          ShopLux
          <span className="text-xs font-semibold px-1.5 py-0.5 bg-amber-400 text-amber-900 rounded-md ml-1">
            Admin
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin user card */}
      <div className="mx-4 my-4 p-3 bg-slate-800 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-400/20 text-amber-400 text-xs font-medium rounded-full">
          <Shield className="w-3 h-3" />
          Administrator
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700/60">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/" className="hidden sm:flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700">
                <ShoppingBag className="w-4 h-4" />
                View Store
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
