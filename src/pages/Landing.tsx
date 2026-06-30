import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { TableProperties, ShieldCheck, ArrowRight, Utensils, Star, Award, Heart } from "lucide-react";

export const Landing: React.FC = () => {
  const { customerName, tableNumber, isAdmin } = useApp();
  const navigate = useNavigate();

  // Proactively redirect if already logged in
  React.useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else if (customerName && tableNumber) {
      navigate("/customer/home");
    }
  }, [customerName, tableNumber, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Upper Navigation Header */}
      <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100">
            JR
          </span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
            JejakRasa
          </span>
        </div>
        <Link
          to="/login"
          state={{ tab: "admin" }}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 transition-all cursor-pointer"
          id="landing-portal-admin-btn"
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          Portal Admin Staff
        </Link>
      </header>

      {/* Hero Welcome Body Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row items-center gap-12 justify-center">
        {/* Left Side: Typography and CTA */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black border border-indigo-100">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>KULINER NUSANTARA MODERN</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Pesan Makanan Praktis, <br />
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-850 bg-clip-text text-transparent">
              Cukup dari Meja Anda!
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
            Selamat datang di JejakRasa. Nikmati berbagai kuliner Nusantara terbaik. Cukup scan nomor meja Anda, lakukan pemesanan secara instan, bayar nontunai, dan biarkan koki kami menyajikannya hangat ke meja Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link
              to="/login"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-indigo-100 transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              id="landing-order-now-btn"
            >
              <TableProperties className="w-4 h-4" />
              Mulai Pesan (Pilih Meja)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              state={{ tab: "admin" }}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
              id="landing-portal-admin-hero-btn"
            >
              Portal Admin
            </Link>
          </div>

          {/* Social Proof badges */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center text-xs text-slate-400 pt-6 border-t border-slate-200 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-slate-800">4.9/5.0</span> Rating Kuliner
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div>
              <span className="font-extrabold text-slate-800">100%</span> Bahan Pilihan Segar
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Illustration Image */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative aspect-square overflow-hidden rounded-3xl shadow-xl border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
            alt="Delicious Indonesian Food Plate Table"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Overlay card */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100/50 flex items-center gap-3 shadow-md">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Utensils className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Bumbu Autentik Warisan</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sate & Rendang Autentik</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1 font-medium">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> oleh Tim JejakRasa &copy; 2026. Semua Hak Dilindungi.
        </p>
      </footer>
    </div>
  );
};
export default Landing;
