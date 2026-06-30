import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Utensils, Shield, TableProperties, User, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/client";

export const Login: React.FC = () => {
  const { loginCustomer, loginAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: "customer" | "admin"
  const defaultTab = (location.state as any)?.tab === "admin" ? "admin" : "customer";
  const [activeTab, setActiveTab] = useState<"customer" | "admin">(defaultTab);

  // Customer form state
  const [name, setName] = useState("");
  const [table, setTable] = useState("");

  // Admin credentials state (Mock credentials)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama Kosong",
        text: "Silakan masukkan nama Anda untuk memesan.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }
    if (!table.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nomor Meja Kosong",
        text: "Silakan pilih atau ketik nomor meja Anda.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    loginCustomer(name.trim(), table.trim());
    Swal.fire({
      icon: "success",
      title: "Selamat Datang!",
      text: `Masuk di Meja ${table} sebagai ${name}`,
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate("/customer/home");
    });
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Swal.showLoading();
      const res = await api.post<{ success: boolean; admin: { displayName: string } }>("/auth/admin-login", {
        username: username.trim(),
        password: password
      });
      
      loginAdmin(res.admin.displayName);
      Swal.fire({
        icon: "success",
        title: "Autentikasi Berhasil",
        text: `Selamat bekerja kembali, ${res.admin.displayName}!`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate("/admin/dashboard");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message || "Username atau password salah.",
        confirmButtonColor: "#4f46e5"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-100 mb-4 animate-bounce-slow">
            JR
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">JejakRasa</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xs text-center leading-relaxed font-medium">
            Pesan hidangan lezat langsung dari meja Anda dengan mudah & instan.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-100 rounded-2xl sm:px-10">
          {/* Custom Auth Tabs */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "customer"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <TableProperties className="w-4 h-4" />
              Pesan di Meja
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Shield className="w-4 h-4" />
              Portal Admin
            </button>
          </div>

          {/* Customer Login Form */}
          {activeTab === "customer" ? (
            <form onSubmit={handleCustomerLogin} className="space-y-5">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Nama Anda
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="customer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Contoh: Ahmad Sobari"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-2xl text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="table-number" className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Nomor Meja Anda
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <TableProperties className="w-5 h-5" />
                  </div>
                  <select
                    id="table-number"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-2xl text-sm outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Pilih Nomor Meja --</option>
                    {Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, "0")).map((num) => (
                      <option key={num} value={num}>
                        Meja Nomor {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-customer-login"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-indigo-100 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Mulai Pesan Kuliner
                </button>
              </div>
            </form>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-username" className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Username Staff
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="admin-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Masukkan username staff"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-2xl text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Sandi Keamanan (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-2xl text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-admin-login"
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-slate-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Dashboard
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400">
                Pintu masuk khusus untuk kasir, juru masak, dan manajer operasional.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
