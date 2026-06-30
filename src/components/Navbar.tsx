import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ShoppingBag, ClipboardList, Shield, TableProperties } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Navbar: React.FC = () => {
  const { customerName, tableNumber, logoutCustomer, isAdmin, logoutAdmin, cart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (isAdmin) {
      logoutAdmin();
      navigate("/login");
    } else {
      logoutCustomer();
      navigate("/");
    }
  };

  const isCustomerRoute = location.pathname.includes("/customer");
  const isLoginPage = location.pathname === "/login";
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 w-full shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center">
            <Link to={isAdmin ? "/admin/dashboard" : (customerName ? "/customer/home" : "/")} className="flex items-center gap-2 group">
              <span className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100 transition-transform group-hover:rotate-6">
                JR
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
                JejakRasa
              </span>
            </Link>
          </div>

          {/* User Info / Right Actions */}
          <div className="flex items-center gap-4">
            {isAdmin ? (
              // Admin Logged In
              <div className="flex items-center gap-3">
                <span className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
                  <Shield className="w-3.5 h-3.5" />
                  Staff Admin
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  id="admin-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : customerName ? (
              // Customer Logged In
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Meja Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>Meja {tableNumber}</span>
                </div>

                {/* Profile / Name Indicator */}
                <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  {customerName}
                </span>

                {/* Cart link */}
                <Link
                  to="/customer/cart"
                  className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Keranjang Belanja"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Order tracking link */}
                <Link
                  to="/customer/orders"
                  className={`p-2 rounded-xl transition-all ${
                    location.pathname === "/customer/orders"
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                  title="Pesanan Saya"
                >
                  <ClipboardList className="w-5 h-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Keluar Meja"
                  id="customer-logout-btn"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Guest (Not Logged In)
              !isLoginPage && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                    id="nav-login-btn"
                  >
                    Pilih Meja / Masuk
                  </Link>

                  <Link
                    to="/login"
                    state={{ tab: "admin" }}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold border border-slate-100 transition-all hidden sm:inline-block cursor-pointer"
                  >
                    Portal Admin
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
