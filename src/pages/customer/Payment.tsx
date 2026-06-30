import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { QrCode, Copy, Check, Clock, ShieldCheck, CreditCard, Wallet, ArrowRight, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, updatePaymentStatus, updateOrderStatus, refreshData } = useApp();
  const orderId = searchParams.get("orderId");

  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(299); // 5 minutes countdown
  const [retryCount, setRetryCount] = useState(0);

  // Find active order
  const order = orders.find((o) => o.id === orderId);

  // If order not found yet (race condition with async placeOrder), retry by refreshing data
  useEffect(() => {
    if (!order && orderId && retryCount < 3) {
      const timeout = setTimeout(async () => {
        await refreshData();
        setRetryCount((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [order, orderId, retryCount]);

  useEffect(() => {
    // Timer countdown for QRIS & VA simulation
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText("8805081234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500
    });
    toast.fire({
      icon: "success",
      title: "Nomor VA disalin!"
    });
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!order) return;

    try {
      await updatePaymentStatus(order.id, "Sudah Bayar");
      // Also move order from "Menunggu Konfirmasi" to "Diproses" to show progression!
      await updateOrderStatus(order.id, "Diproses");

      Swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil!",
        text: `Tagihan pesanan ${order.id} telah lunas terbayar.`,
        confirmButtonColor: "#4f46e5"
      }).then(() => {
        navigate("/customer/orders");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui status pembayaran."
      });
    }
  };

  if (!order && retryCount < 3) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">Error: Pesanan tidak ditemukan!</p>
        <Link to="/customer/home" className="text-indigo-600 underline text-sm mt-4 inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24" id="payment-simulation-page">
      {/* Top Card: Bill Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No. Transaksi</span>
          <h2 className="font-mono text-sm font-extrabold text-slate-800 leading-none mt-1">{order.id}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tagihan</span>
          <p className="text-base font-black text-indigo-600 mt-1">
            Rp {order.total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Main Payment View */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 text-center">
        {order.paymentMethod === "QRIS" && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pindai Kode QRIS</span>
              <p className="text-xs text-indigo-600 font-bold flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Selesaikan pembayaran dalam <span className="font-mono text-sm font-extrabold">{formatTimer(timer)}</span>
              </p>
            </div>

            {/* Simulated QR Code Canvas with design lines */}
            <div className="relative p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center w-52 h-52 shadow-sm">
              {/* QR corners decoration */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-md"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-md"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-md"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-md"></div>

              {/* Grid block representation for QR */}
              <div className="w-40 h-40 bg-slate-900 rounded-xl p-2 flex flex-wrap gap-1 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10"></div>
                <QrCode className="w-full h-full text-white relative z-10 stroke-[1.2px]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-slate-800">QRIS GPN Dinamis JejakRasa</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Buka aplikasi dompet digital Anda (Gopay, OVO, ShopeePay, Dana, LinkAja) atau Mobile Banking, pindai QR di atas untuk membayar instan.
              </p>
            </div>
          </div>
        )}

        {order.paymentMethod === "Virtual Account" && (
          <div className="space-y-6 text-left">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transfer Bank</span>
              <p className="text-xs text-indigo-600 font-bold flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Selesaikan pembayaran dalam <span className="font-mono text-sm font-extrabold">{formatTimer(timer)}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAMA BANK</span>
                  <span className="font-extrabold text-sm text-slate-800">MANDIRI VIRTUAL ACCOUNT</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                  MANDIRI
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NOMOR REKENING VA</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-lg font-black text-slate-900 tracking-wider">
                    8805 0812 3456 7890
                  </span>
                  <button
                    onClick={handleCopyVA}
                    className="p-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-200/60 shadow-2xs transition-colors cursor-pointer"
                    title="Salin nomor"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200/50 pt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAMA TRANSAKSI</span>
                <span className="text-xs font-bold text-slate-700 mt-1 block">
                  JR MEJA {order.tableNumber} - {order.customerName}
                </span>
              </div>
            </div>

            {/* Transfer Guides */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Panduan Pembayaran:</h4>
              <ol className="list-decimal list-inside text-xs text-slate-500 space-y-1.5 leading-relaxed pl-1">
                <li>Buka aplikasi Mobile Banking pilihan Anda atau kunjungi ATM terdekat.</li>
                <li>Pilih menu <span className="font-semibold text-slate-800">Bayar/Beli</span> &gt; <span className="font-semibold text-slate-800">Multi Payment / Virtual Account</span>.</li>
                <li>Masukkan kode nomor rekening VA di atas.</li>
                <li>Periksa detail tagihan, masukkan PIN, dan simpan resi transaksi Anda.</li>
              </ol>
            </div>
          </div>
        )}

        {order.paymentMethod === "Tunai" && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
              <Wallet className="w-12 h-12 stroke-[1.8px]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800">Bayar Tunai di Kasir</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Silakan datangi meja kasir JejakRasa dan tunjukkan Kode Transaksi berikut:
              </p>
              <p className="font-mono font-black text-base text-indigo-600 tracking-wider py-1 px-4 bg-indigo-50 rounded-2xl inline-block mt-1">
                {order.id}
              </p>
            </div>

            <div className="text-xs text-left text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <p className="font-bold text-slate-700 mb-1">Informasi Operasional:</p>
              <p>• Staff kasir kami akan memverifikasi nomor meja Anda ({order.tableNumber}).</p>
              <p>• Pembayaran tunai dapat dilakukan sebelum hidangan datang atau setelah Anda selesai bersantap.</p>
              <p>• Konfirmasi pembayaran tunai akan langsung diupdate oleh kasir di dashboard sistem.</p>
            </div>
          </div>
        )}

        {/* Action simulators & flow */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          {order.paymentStatus === "Belum Bayar" && (
            <button
              onClick={handleSimulatePaymentSuccess}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-100 transition-all cursor-pointer hover:scale-102"
              id="simulate-payment-success-btn"
            >
              Simulasi Selesaikan Pembayaran (Lunas)
            </button>
          )}

          <Link
            to="/customer/orders"
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-2xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            id="go-to-order-tracking-btn"
          >
            Lacak Pesanan Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Payment;
