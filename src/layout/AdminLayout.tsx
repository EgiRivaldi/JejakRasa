import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useApp } from "../context/AppContext";
import { Bell, ShieldAlert, User, Menu } from "lucide-react";

export const AdminLayout: React.FC = () => {
  const { isAdmin } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Guard: Admin protection
  if (!isAdmin) {
    return <Navigate to="/login" state={{ tab: "admin" }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col w-64 max-w-xs bg-white border-r border-slate-200 animate-slide-in-left">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content viewport */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 sm:px-8 z-10 shadow-sm">
          {/* Left panel: Burger + Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 lg:hidden cursor-pointer"
              id="mobile-sidebar-toggle"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-950 leading-tight">Halo, Staff JejakRasa</h2>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Senin, 29 Juni 2026</p>
            </div>
          </div>

          {/* Right panel: Alerts & Quick Profile */}
          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>LIVE FEED</span>
            </div>

            <button
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all relative cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-100"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-100">
                A
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Admin Kasir</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Outlet with safe scrolling */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
