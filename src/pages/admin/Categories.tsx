import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, Edit, Trash2, X, Tags, HelpCircle } from "lucide-react";
import Swal from "sweetalert2";

export const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();

  // Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("Utensils");

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingId(null);
    setFormName("");
    setFormIcon("Utensils");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setModalMode("edit");
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      Swal.showLoading();
      if (modalMode === "add") {
        await addCategory({
          name: formName.trim(),
          icon: formIcon
        });
        Swal.fire({
          icon: "success",
          title: "Kategori Dibuat",
          text: `Kategori '${formName}' berhasil ditambahkan ke daftar.`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        if (editingId) {
          await updateCategory(editingId, formName.trim());
          Swal.fire({
            icon: "success",
            title: "Kategori Diperbarui",
            text: `Nama kategori berhasil diganti menjadi '${formName}'.`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan kategori",
        text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (id === "semua" || id === "makanan" || id === "minuman") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: `Kategori default '${name}' merupakan bagian inti aplikasi dan tidak boleh dihapus.`,
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    Swal.fire({
      title: "Hapus Kategori?",
      text: `Apakah Anda yakin ingin menghapus kategori '${name}'? Menu di dalamnya tidak akan terhapus namun klasifikasinya dilepas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await deleteCategory(id);
          Swal.fire({
            icon: "success",
            title: "Kategori Terhapus",
            text: "Klasifikasi menu dilepas.",
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus kategori",
            text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6" id="admin-categories-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tags className="w-6 h-6 text-indigo-600" />
            Kelola Kategori Hidangan
          </h1>
          <p className="text-xs text-slate-500 font-medium">Ubah klasifikasi tab menu kuliner yang tampil di halaman pemesanan pelanggan.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          id="add-new-category-btn"
        >
          <Plus className="w-4 h-4" />
          Kategori Baru
        </button>
      </div>

      {/* Categories Grid list */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  {cat.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-tight">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">ID: {cat.id}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-200/50 shadow-2xs transition-colors cursor-pointer"
                  title="Rename"
                  id={`edit-category-${cat.id}`}
                >
                  <Edit className="w-4 h-4 text-slate-500 hover:text-indigo-600" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl border border-gray-200/50 shadow-2xs transition-colors cursor-pointer"
                  title="Hapus"
                  id={`delete-category-${cat.id}`}
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRUD Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-slide-in-up">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">
                {modalMode === "add" ? "Kategori Baru" : "Edit Nama Kategori"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Nama Kategori *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none"
                  placeholder="Contoh: Paket Keluarga"
                  required
                />
              </div>

              {modalMode === "add" && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Simbol Icon</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none appearance-none"
                  >
                    <option value="Utensils">Pisau & Garpu (Utensils)</option>
                    <option value="CupSoda">Minuman Bergas (CupSoda)</option>
                    <option value="Cookie">Kue Kering (Cookie)</option>
                    <option value="CakeSlice">Potongan Kue (CakeSlice)</option>
                    <option value="ChefHat">Topi Koki (ChefHat)</option>
                    <option value="Coffee">Cangkir Kopi (Coffee)</option>
                    <option value="Flame">Api Pedas (Flame)</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  id="submit-category-btn"
                >
                  {modalMode === "add" ? "Tambah" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Categories;
