import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { CartItem } from "../../components/CartItem";
import { EmptyState } from "../../components/EmptyState";
import { ShoppingBag, ArrowLeft, Ticket, Trash2, HelpCircle, FileText, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, activePromo, applyPromo, removePromo } = useApp();
  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState("");

  const handleIncrease = (foodId: string, item: any) => {
    addToCart(item.food, 1);
  };

  const handleDecrease = (foodId: string) => {
    removeFromCart(foodId);
  };

  const handleRemove = (foodId: string, title: string) => {
    Swal.fire({
      title: "Hapus Menu?",
      text: `Apakah Anda yakin ingin mengeluarkan ${title} dari keranjang?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        updateCartQuantity(foodId, 0);
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Kosongkan Keranjang?",
      text: "Seluruh menu di keranjang Anda akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Kosongkan",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          icon: "success",
          title: "Keranjang Kosong",
          text: "Seluruh menu berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const res = applyPromo(promoCodeInput.trim());
    if (res.success) {
      Swal.fire({
        icon: "success",
        title: "Promo Berhasil",
        text: res.message,
        confirmButtonColor: "#4f46e5"
      });
      setPromoCodeInput("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Promo Gagal",
        text: res.message,
        confirmButtonColor: "#4f46e5"
      });
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    Swal.fire({
      icon: "info",
      title: "Promo Dilepas",
      text: "Kupon promo berhasil dilepas dari keranjang.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Math calculations
  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const discount = activePromo ? Math.round((subtotal * activePromo.discountPercent) / 100) : 0;
  const pb1Tax = Math.round((subtotal - discount) * 0.1); // PB1 (pajak restoran 10% di Indonesia)
  const total = subtotal - discount + pb1Tax;

  if (cart.length === 0) {
    return (
      <div id="cart-empty-view">
        <div className="mb-4">
          <Link to="/customer/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
        <EmptyState
          icon="ShoppingBag"
          title="Keranjang Belanja Kosong"
          description="Anda belum menambahkan hidangan apa pun ke dalam keranjang belanja. Yuk, pilih makanan kesukaanmu sekarang!"
          actionText="Cari Makanan Enak"
          onAction={() => navigate("/customer/home")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24" id="cart-page">
      {/* Back to Home Link */}
      <div className="flex items-center justify-between">
        <Link to="/customer/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Menu
        </Link>

        <button
          onClick={handleClearCart}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          id="clear-cart-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            Daftar Pesanan Anda
          </h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.food.id}
                item={item}
                onIncrease={() => handleIncrease(item.food.id, item)}
                onDecrease={() => handleDecrease(item.food.id)}
                onRemove={() => handleRemove(item.food.id, item.food.title)}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Promo & Bill Breakdowns */}
        <div className="space-y-6">
          {/* Promo code card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-600" />
              Pakai Kode Promo
            </h3>

            {activePromo ? (
              <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Promo Aktif</p>
                  <p className="font-extrabold text-xs text-indigo-900 mt-0.5">{activePromo.code}</p>
                  <p className="text-[10px] text-indigo-600 font-medium">Potongan harga {activePromo.discountPercent}%</p>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  id="remove-promo-btn"
                >
                  Lepas
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: JEJAKRASA10"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold uppercase outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Pasang
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Gunakan kupon promo dari beranda untuk menikmati diskon menarik di JejakRasa.
            </p>
          </div>

          {/* Checkout billing card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Rincian Pembayaran
            </h3>

            <div className="space-y-2.5 text-xs text-slate-500 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} menu)</span>
                <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {activePromo && (
                <div className="flex justify-between text-indigo-600 font-medium">
                  <span>Diskon Promo ({activePromo.discountPercent}%)</span>
                  <span>- Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Pajak PB1 (10%)
                  <HelpCircle className="w-3 h-3 text-slate-400" title="Pajak restoran wajib pembangunan daerah" />
                </span>
                <span className="font-semibold text-slate-800">Rp {pb1Tax.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-extrabold text-slate-800">Total Pembayaran</span>
              <span className="text-lg font-black text-indigo-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Checkout CTAs */}
            <div className="pt-2">
              <button
                onClick={() => navigate("/customer/checkout")}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1 shadow-md shadow-indigo-100 transition-all cursor-pointer hover:scale-102 active:scale-98"
                id="cart-checkout-btn"
              >
                Lanjut ke Pembayaran
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
