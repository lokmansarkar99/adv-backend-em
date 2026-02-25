import { Outlet, Link, NavLink } from "react-router-dom";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useAuth } from "../../features/auth/auth.store";

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const dashboardLink = user?.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Announcement bar */}
      <div className="bg-indigo-600 text-white text-xs text-center py-2 font-medium tracking-wide">
        🎉 Free shipping on orders over $50 · Use code <strong>SHOPNOW</strong>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              ShopLux
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "Deals", path: "/deals" },
              ].map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardLink}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-sm font-medium transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {user?.name?.split(" ")[0]}
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                ShopLux
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Your premier destination for curated products and seamless shopping.</p>
            </div>
            {["Shop", "Company", "Support"].map((group) => (
              <div key={group}>
                <h4 className="font-semibold text-slate-800 mb-3 text-sm">{group}</h4>
                <ul className="space-y-2">
                  {["All Products", "New Arrivals", "Contact Us"].map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © 2026 ShopLux Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
