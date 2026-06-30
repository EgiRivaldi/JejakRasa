import React, { useState } from "react";
import { Settings as SettingsIcon, Store, Wifi, HelpCircle, Save, Database, ShieldAlert, Clock } from "lucide-react";
import Swal from "sweetalert2";

export const Settings: React.FC = () => {
  // Config state
  const [restName, setRestName] = useState("JejakRasa Restoran & Cafe");
  const [restAddress, setRestAddress] = useState("Jl. Jenderal Sudirman No. 45, Jakarta Selatan");
  const [wifiName, setWifiName] = useState("JejakRasa_Sakti");
  const [wifiPass, setWifiPass] = useState("enakdanhalal");
  const [taxPercent, setTaxPercent] = useState(10);
  const [startHour, setStartHour] = useState("10:00");
  const [endHour, setEndHour] = useState("22:00");

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Konfigurasi Disimpan!",
      text: "Seluruh perubahan sistem operasional JejakRasa berhasil di-update.",
      confirmButtonColor: "#4f46e5"
    });
  };

  const handleResetSystemDB = () => {
    Swal.fire({
      title: "Reset Factory Data?",
      text: "Seluruh data transaksi kustom, menu CRUD, kategori kustom, dan cart akan dihapus bersih dan dikembalikan ke silsilah database pabrik (Initial Mock)!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Reset Bersih!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: "success",
          title: "Sistem Ter-reset!",
          text: "Halaman akan direfresh untuk mengembalikan data awal bawaan.",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

  return (
    <div className="space-y-6" id="admin-settings-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
          Pengaturan Sistem Operasional
        </h1>
        <p className="text-xs text-slate-500 font-medium">Atur data profil outlet, kustomisasi struk, kata sandi wifi pelanggan, dan konfigurasi database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Configurations form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <form onSubmit={handleSaveConfigs} className="space-y-6">
            {/* SECTION 1: Profil Restoran */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Store className="w-4.5 h-4.5 text-indigo-600" />
                Identitas Outlet Restoran
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Restoran *</label>
                  <input
                    type="text"
                    value={restName}
                    onChange={(e) => setRestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pajak Struk PB1 (%)</label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alamat Lengkap (Tampil di Struk) *</label>
                <input
                  type="text"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            {/* SECTION 2: WiFi Informasi */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Wifi className="w-4.5 h-4.5 text-indigo-600" />
                WiFi Gratis Pelanggan Meja
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">SSID / Nama WiFi</label>
                  <input
                    type="text"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kata Sandi (WiFi Password)</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Jam Operasional */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Clock className="w-4.5 h-4.5 text-indigo-600" />
                Jam Buka / Tutup Restoran
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jam Mulai Layanan</label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jam Tutup Layanan</label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
                id="save-configs-btn"
              >
                <Save className="w-4 h-4" />
                Simpan Seluruh Pengaturan
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 col: Database Reset utilities */}
        <div className="space-y-6">
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-rose-800 flex items-center gap-2 border-b border-rose-100/60 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Zona Bahaya Operasional
            </h3>

            <p className="text-xs text-rose-700/90 leading-relaxed">
              Tindakan di bawah ini bersifat merusak & tidak dapat dibatalkan. Seluruh transaksi penjualan, kustomisasi CRUD menu koki, dan keranjang yang tersimpan akan dikosongkan total kembali ke bawaan pabrik.
            </p>

            <button
              onClick={handleResetSystemDB}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              id="reset-db-btn"
            >
              <Database className="w-4 h-4" />
              Reset Database Ke Awal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
