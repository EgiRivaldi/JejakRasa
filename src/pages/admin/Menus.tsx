import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { SearchBar } from "../../components/SearchBar";
import { CategoryTabs } from "../../components/CategoryTabs";
import { FoodItem } from "../../data/foods";
import { Plus, Edit, Trash2, Eye, HelpCircle, ToggleLeft, ToggleRight, X, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export const Menus: React.FC = () => {
  const { foods, categories, addFood, updateFood, deleteFood } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("makanan");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Tersedia" | "Habis">("Tersedia");

  // Filter food items
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchQuery, selectedCategory]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingFoodId(null);
    setFormTitle("");
    setFormCategory("makanan");
    setFormPrice(0);
    setFormImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"); // Nice fallback
    setFormDescription("");
    setFormStatus("Tersedia");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food: FoodItem) => {
    setModalMode("edit");
    setEditingFoodId(food.id);
    setFormTitle(food.title);
    setFormCategory(food.category);
    setFormPrice(food.price);
    setFormImage(food.image);
    setFormDescription(food.description);
    setFormStatus(food.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      Swal.fire({ icon: "warning", title: "Validasi Gagal", text: "Nama menu wajib diisi.", confirmButtonColor: "#4f46e5" });
      return;
    }
    if (formPrice <= 0) {
      Swal.fire({ icon: "warning", title: "Validasi Gagal", text: "Harga wajib lebih besar dari Rp 0.", confirmButtonColor: "#4f46e5" });
      return;
    }

    try {
      Swal.showLoading();
      if (modalMode === "add") {
        await addFood({
          title: formTitle.trim(),
          category: formCategory,
          price: formPrice,
          image: formImage.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          description: formDescription.trim(),
          status: formStatus,
          rating: 4.5 // Default initial rating
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan",
          text: `Menu '${formTitle}' siap dipesan oleh pelanggan.`,
          timer: 1500,
          showConfirmButton: false
        });
      } else if (modalMode === "edit" && editingFoodId) {
        await updateFood(editingFoodId, {
          title: formTitle.trim(),
          category: formCategory,
          price: formPrice,
          image: formImage.trim(),
          description: formDescription.trim(),
          status: formStatus
        });

        Swal.fire({
          icon: "success",
          title: "Perubahan Disimpan",
          text: `Detail menu '${formTitle}' berhasil diperbarui.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan menu",
        text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
      });
    }
  };

  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: "Hapus Menu?",
      text: `Apakah Anda yakin ingin menghapus '${title}' dari daftar menu selamanya?`,
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
          await deleteFood(id);
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: `Menu '${title}' berhasil dihapus.`,
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal menghapus",
            text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
          });
        }
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: "Tersedia" | "Habis", title: string) => {
    const nextStatus = currentStatus === "Tersedia" ? "Habis" : "Tersedia";
    try {
      Swal.showLoading();
      await updateFood(id, { status: nextStatus });
      Swal.close();
      const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500
      });
      toast.fire({
        icon: "info",
        title: `${title} diubah menjadi: ${nextStatus}`
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengubah status",
        text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
      });
    }
  };

  return (
    <div className="space-y-6" id="admin-menus-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Daftar Menu</h1>
          <p className="text-xs text-slate-500 font-medium">Tambah menu kuliner baru, ubah rincian deskripsi, harga, dan kontrol ketersediaan.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          id="add-new-menu-btn"
        >
          <Plus className="w-4 h-4" />
          Tambah Kuliner Baru
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Cari menu berdasarkan nama..." />
        <CategoryTabs categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Table List of Foods */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Menu</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Unit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aktifkan / Nonaktifkan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
              {filteredFoods.map((food) => (
                <tr key={food.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.title}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{food.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{food.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                      {food.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    Rp {food.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    {food.status === "Tersedia" ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        Tersedia
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                        Habis
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(food.id, food.status, food.title)}
                      className="p-1 hover:bg-slate-100 rounded-lg inline-block cursor-pointer text-slate-500"
                      title={food.status === "Tersedia" ? "Matikan Ketersediaan" : "Nyalakan Ketersediaan"}
                      id={`status-toggle-${food.id}`}
                    >
                      {food.status === "Tersedia" ? (
                        <ToggleRight className="w-8 h-8 text-indigo-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(food)}
                        className="p-1.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg border border-slate-100 shadow-2xs cursor-pointer transition-all"
                        title="Edit Menu"
                        id={`edit-menu-${food.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food.id, food.title)}
                        className="p-1.5 bg-slate-50 text-rose-500 hover:bg-rose-50 rounded-lg border border-slate-100 shadow-2xs cursor-pointer transition-all"
                        title="Hapus Menu"
                        id={`delete-menu-${food.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFoods.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-bold">
                    Tidak ada menu kuliner yang cocok dengan filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Add/Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-slide-in-up">
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {modalMode === "add" ? "Tambah Hidangan Kuliner Baru" : "Edit Rincian Hidangan"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Menu *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  placeholder="Contoh: Mie Ayam Jamur"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none appearance-none"
                  >
                    {categories.filter((c) => c.id !== "semua").map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Rupiah *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                    placeholder="Contoh: 18000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tautan URL Gambar</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                  placeholder="http://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ketersediaan</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none appearance-none"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis / Kosong</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi Singkat</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold outline-none resize-none"
                  placeholder="Ceritakan cita rasa hidangan..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  id="submit-crud-food-btn"
                >
                  {modalMode === "add" ? "Tambah Menu" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Menus;
