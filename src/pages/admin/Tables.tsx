import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Table } from "../../context/AppContext";
import { Plus, Trash2, TableProperties, Search, Hash } from "lucide-react";
import Swal from "sweetalert2";

const Tables: React.FC = () => {
  const { tables, addTable, deleteTable } = useApp();
  const [newTableNumber, setNewTableNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredTables = tables.filter((t) =>
    t.number.includes(searchQuery.trim())
  );

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTableNumber.trim();

    if (!trimmed) {
      Swal.fire({
        icon: "warning",
        title: "Nomor Meja Kosong",
        text: "Silakan masukkan nomor meja yang ingin ditambahkan.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    // Validate: number only
    if (!/^\d+$/.test(trimmed)) {
      Swal.fire({
        icon: "warning",
        title: "Format Salah",
        text: "Nomor meja harus berupa angka (contoh: 21, 22, 23).",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    setIsAdding(true);
    try {
      Swal.fire({
        title: "Menambahkan Meja...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await addTable(trimmed);

      Swal.fire({
        icon: "success",
        title: "Meja Ditambahkan!",
        text: `Meja Nomor ${trimmed.padStart(2, "0")} berhasil ditambahkan.`,
        timer: 1500,
        showConfirmButton: false
      });
      setNewTableNumber("");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan",
        text: error.message || "Terjadi kesalahan saat menambahkan meja.",
        confirmButtonColor: "#4f46e5"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTable = async (tableNumber: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Hapus Meja ${tableNumber}?`,
      text: "Meja yang dihapus tidak akan muncul di daftar pilihan pelanggan.",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b"
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Menghapus Meja...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await deleteTable(tableNumber);

      Swal.fire({
        icon: "success",
        title: "Meja Dihapus!",
        text: `Meja Nomor ${tableNumber} berhasil dihapus dari sistem.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error.message || "Terjadi kesalahan saat menghapus meja.",
        confirmButtonColor: "#4f46e5"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Meja
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tambah atau hapus nomor meja yang tersedia untuk pelanggan.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <TableProperties className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-700">
              {tables.length} Meja
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-emerald-700">
              {tables.filter((t) => t.status === "Tersedia").length} Tersedia
            </span>
          </div>
        </div>
      </div>

      {/* Add Table Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-4">
          Tambah Meja Baru
        </h2>
        <form onSubmit={handleAddTable} className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="new-table-number" className="block text-xs font-bold text-slate-400 mb-1.5">
              Nomor Meja
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="new-table-number"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                placeholder="Contoh: 21"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors"
                disabled={isAdding}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nomor meja..."
          className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-100 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors shadow-sm"
        />
      </div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <TableProperties className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {searchQuery ? "Tidak ada meja yang ditemukan." : "Belum ada meja terdaftar."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredTables.map((table) => (
            <div
              key={table.number}
              className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-5 flex flex-col items-center justify-center gap-3"
            >
              {/* Table Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black ${
                table.status === "Tersedia"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}>
                {table.number}
              </div>

              {/* Table Label */}
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">Meja {table.number}</p>
                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  table.status === "Tersedia"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    table.status === "Tersedia" ? "bg-emerald-500" : "bg-amber-500"
                  }`}></span>
                  {table.status}
                </span>
              </div>

              {/* Delete Button (on hover) */}
              <button
                onClick={() => handleDeleteTable(table.number)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title={`Hapus Meja ${table.number}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tables;
