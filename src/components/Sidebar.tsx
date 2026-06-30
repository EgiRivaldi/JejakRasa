import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Tags,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useApp();

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/admin/menu",
      name: "Kelola Menu",
      icon: Utensils
    },
    {
      path: "/admin/categories",
      name: "Kategori",
      icon: Tags
    },
    {
      path: "/admin/orders",
      name: "Pesanan Masuk",
      icon: ShoppingBag
    },
    {
      path: "/admin/reports",
      name: "Laporan Keuangan",
      icon: BarChart3
    },
    {
      path: "/admin/settings",
      name: "Pengaturan",
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white text-slate-800 min-h-screen flex flex-col border-r border-slate-200 z-30 shadow-xs">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <span className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md shadow-indigo-100">
          JR
        </span>
        <div>
          <h2 className="font-bold text-lg tracking-tight text-indigo-900 leading-none mb-1">JejakRasa</h2>
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 tracking-wider uppercase">
            <ShieldCheck className="w-3 h-3" /> Staff Portal
          </span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4 space-y-1 mt-4 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">MENU UTAMA</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              id={`sidebar-link-${item.path.split("/")[2]}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Operations */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          to="/customer/home"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          id="sidebar-customer-home-btn"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          Lihat Tampilan Kasir
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left"
          id="sidebar-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Sesi
        </button>
      </div>
    </aside>
  );
};
