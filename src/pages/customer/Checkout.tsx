import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PaymentCard } from "../../components/PaymentCard";
import { ArrowLeft, Wallet, ShieldCheck, FileText, ShoppingBag, Landmark } from "lucide-react";
import Swal from "sweetalert2";

export const Checkout: React.FC = () => {
  const { cart, activePromo, customerName, tableNumber, placeOrder } = useApp();
  const navigate = useNavigate();

  // Payment method selection state
  const [selectedMethod, setSelectedMethod] = useState<"Tunai" | "QRIS" | "Virtual Account">("QRIS");

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const discount = activePromo ? Math.round((subtotal * activePromo.discountPercent) / 100) : 0;
  const pb1Tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + pb1Tax;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Keranjang Kosong",
        text: "Anda tidak memiliki item di keranjang untuk dipesan.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi Pesanan",
      text: `Apakah Anda yakin ingin memesan dengan pembayaran via ${selectedMethod}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Kirim!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          const order = await placeOrder(selectedMethod);
          if (order) {
            Swal.fire({
              icon: "success",
              title: "Pesanan Dikirim!",
              text: `Pesanan ${order.id} berhasil terkirim ke dapur.`,
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              // Navigate to simulated payment screen
              navigate(`/customer/payment?orderId=${order.id}`);
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Pemesanan Gagal",
            text: "Terjadi kesalahan saat memproses pesanan ke server database Clever Cloud."
          });
        }
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="space-y-4">
        <Link to="/customer/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-500">Keranjang Anda kosong. Silakan tambahkan menu terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24" id="checkout-page">
      {/* Header Link */}
      <div>
        <Link to="/customer/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Keranjang
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Details & Payment Methods Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Metode Pembayaran</h2>

          {/* Payment Card List */}
          <div className="space-y-3">
            <PaymentCard
              method="QRIS"
              selected={selectedMethod === "QRIS"}
              onSelect={() => setSelectedMethod("QRIS")}
            />
            <PaymentCard
              method="Virtual Account"
              selected={selectedMethod === "Virtual Account"}
              onSelect={() => setSelectedMethod("Virtual Account")}
            />
            <PaymentCard
              method="Tunai"
              selected={selectedMethod === "Tunai"}
              onSelect={() => setSelectedMethod("Tunai")}
            />
          </div>

          {/* Info Banner based on payment selection */}
          <div className="bg-indigo-50/50 border border-indigo-100/60 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Catatan Pembayaran
            </h4>
            <p className="text-xs text-indigo-700/95 leading-relaxed">
              {selectedMethod === "QRIS" &&
                "Pembayaran menggunakan QRIS dinamis aman & terintegrasi otomatis. QR code akan langsung digenerasi setelah Anda mengonfirmasi pesanan."}
              {selectedMethod === "Virtual Account" &&
                "Kode pembayaran Virtual Account unik akan terbit untuk menyelesaikan pembayaran lewat Mobile Banking maupun ATM."}
              {selectedMethod === "Tunai" &&
                "Pesanan akan diproses ke dapur, dan Anda dapat melakukan pembayaran di meja atau langsung di kasir sebelum makan malam selesai."}
            </p>
          </div>
        </div>

        {/* Right Section: Summary Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Ringkasan Pelanggan</h3>
              <div className="grid grid-cols-2 gap-y-2 text-xs mt-3 text-slate-600">
                <span>Nama Pelanggan</span>
                <span className="font-bold text-slate-900 text-right">{customerName}</span>
                <span>Nomor Meja</span>
                <span className="font-extrabold text-indigo-600 text-right">Meja {tableNumber}</span>
              </div>
            </div>

            {/* Nested items view */}
            <div className="border-b border-slate-100 pb-4 max-h-[150px] overflow-y-auto space-y-3 pr-1">
              <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Daftar Menu</h4>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-600 gap-4">
                  <span className="truncate flex-1 font-medium">{item.food.title}</span>
                  <span className="font-bold text-slate-800">x{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              {activePromo && (
                <div className="flex justify-between text-indigo-600">
                  <span>Diskon Promo</span>
                  <span>- Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pajak PB1 (10%)</span>
                <span className="font-semibold text-slate-800">Rp {pb1Tax.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold text-slate-800">Total Akhir</span>
              <span className="text-xl font-black text-indigo-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-100 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              id="confirm-place-order-btn"
            >
              Bayar & Kirim Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
