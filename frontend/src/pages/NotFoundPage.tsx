import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-indigo-400" />
      </div>
      <h1 className="text-8xl font-black text-indigo-200 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
