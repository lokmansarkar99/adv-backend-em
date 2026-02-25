import { Link } from "react-router-dom";
import { ShoppingBag, Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";

const features = [
  { icon: Truck,        title: "Free Shipping",    desc: "On all orders over $50" },
  { icon: ShieldCheck,  title: "Secure Payments",  desc: "256-bit SSL encryption" },
  { icon: RotateCcw,    title: "Easy Returns",     desc: "30-day return policy" },
  { icon: Star,         title: "Top Rated",        desc: "4.9/5 from 10k+ reviews" },
];

const categories = [
  { name: "Electronics",  emoji: "💻", bg: "bg-indigo-50",  text: "text-indigo-700" },
  { name: "Fashion",      emoji: "👗", bg: "bg-pink-50",    text: "text-pink-700" },
  { name: "Home & Garden",emoji: "🏡", bg: "bg-green-50",   text: "text-green-700" },
  { name: "Sports",       emoji: "⚽", bg: "bg-amber-50",   text: "text-amber-700" },
  { name: "Books",        emoji: "📚", bg: "bg-purple-50",  text: "text-purple-700" },
  { name: "Toys",         emoji: "🎮", bg: "bg-red-50",     text: "text-red-700" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              New arrivals every week
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Shop Smarter,<br />
              <span className="text-amber-400">Live Better</span>
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed mb-8">
              Discover thousands of curated products at unbeatable prices. Fast shipping, easy returns, and exceptional service — guaranteed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-800/30 text-sm"
              >
                Start Shopping
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 mb-2">Shop by Category</h2>
          <p className="text-slate-500">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, emoji, bg, text }) => (
            <div
              key={name}
              className={`${bg} rounded-2xl p-5 text-center cursor-pointer hover:scale-105 transition-transform border border-white`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <p className={`text-sm font-semibold ${text}`}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-3">Ready to start shopping?</h2>
          <p className="text-slate-400 mb-7">Join 50,000+ happy customers today</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-900/50 text-sm"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
