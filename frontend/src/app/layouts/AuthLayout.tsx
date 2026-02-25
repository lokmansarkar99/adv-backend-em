import { Outlet, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-300/50">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            ShopLux
          </Link>
          <p className="mt-2 text-sm text-slate-500">Your premium shopping destination</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/60 border border-slate-100 p-8">
          <Outlet />
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">© 2026 ShopLux. All rights reserved.</p>
      </div>
    </div>
  );
}
