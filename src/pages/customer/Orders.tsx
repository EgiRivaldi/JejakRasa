import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { OrderCard } from "../../components/OrderCard";
import { EmptyState } from "../../components/EmptyState";
import { StatusBadge } from "../../components/StatusBadge";
import { useNavigate, Link } from "react-router-dom";
import { ClipboardList, ArrowLeft, Clock, ChefHat, CheckCircle, Flame, MessageSquare, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export const Orders: React.FC = () => {
  const { orders, tableNumber, customerName } = useApp();
  const navigate = useNavigate();

  // Filter orders to only show current customer's table orders
  const customerOrders = orders.filter((o) => o.tableNumber === tableNumber);

  // Selected Order for active tracking visualization
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(
    customerOrders.length > 0 ? customerOrders[0].id : null
  );

  const selectedOrder = customerOrders.find((o) => o.id === selectedTrackOrderId);

  const handleTrackOrder = (order: any) => {
    setSelectedTrackOrderId(order.id);
    const element = document.getElementById("active-tracking-stepper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statuses = ["Menunggu Konfirmasi", "Diproses", "Selesai"];
    const currentIndex = statuses.indexOf(currentStatus);

    if (currentStatus === "Dibatalkan") {
      return "canceled";
    }

    if (currentIndex >= stepIndex) {
      return "completed";
    } else if (currentIndex + 1 === stepIndex) {
      return "active";
    }
    return "pending";
  };

  if (customerOrders.length === 0) {
    return (
      <div id="orders-empty-view">
        <div className="mb-4">
          <Link to="/customer/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
        <EmptyState
          icon="ClipboardList"
          title="Belum Ada Pesanan"
          description="Anda belum memesan hidangan apa pun hari ini. Silakan pilih menu di beranda terlebih dahulu."
          actionText="Pesan Sekarang"
          onAction={() => navigate("/customer/home")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24" id="orders-tracking-page">
      {/* Back button */}
      <div>
        <Link to="/customer/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: History queue list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              Riwayat Pesanan Anda
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {customerOrders.length} Pesanan
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className={`transition-all duration-300 rounded-2xl ${
                  order.id === selectedTrackOrderId
                    ? "ring-2 ring-indigo-500 ring-offset-2"
                    : ""
                }`}
              >
                <OrderCard order={order} onTrack={handleTrackOrder} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Interactive Tracker view */}
        <div className="lg:col-span-2 space-y-6" id="active-tracking-stepper">
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
              {/* Stepper Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-105 pb-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sedang Melacak Pesanan</span>
                  <h3 className="font-mono text-base font-black text-slate-900 mt-1">{selectedOrder.id}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Metode: <span className="font-bold text-slate-700">{selectedOrder.paymentMethod}</span> ({selectedOrder.paymentStatus})
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <StatusBadge type="order" status={selectedOrder.orderStatus} />
                </div>
              </div>

              {/* Stepper UI Progress Tracker */}
              {selectedOrder.orderStatus === "Dibatalkan" ? (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center gap-4 text-rose-800">
                  <AlertCircle className="w-10 h-10 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm mb-1">Pesanan Ini Dibatalkan</h4>
                    <p className="text-xs text-rose-600 leading-relaxed">
                      Mohon maaf, pesanan ini telah dibatalkan oleh pihak operasional atau kasir. Silakan hubungi staff pelayan kami di meja kasir.
                    </p>
                  </div>
                </div>
              ) : (
                /* Dynamic Stepper Progression */
                <div className="relative pl-8 space-y-8 py-2">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-3.5 top-5 bottom-5 w-1 bg-slate-100 rounded-full z-0">
                    <div
                      className="w-full bg-indigo-600 transition-all duration-700"
                      style={{
                        height:
                          selectedOrder.orderStatus === "Selesai"
                            ? "100%"
                            : selectedOrder.orderStatus === "Diproses"
                            ? "50%"
                            : "0%"
                      }}
                    ></div>
                  </div>

                  {/* Step 1: Menunggu Konfirmasi */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        getStepStatus(0, selectedOrder.orderStatus) === "completed"
                          ? "bg-emerald-500 text-white"
                          : getStepStatus(0, selectedOrder.orderStatus) === "active"
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Menunggu Konfirmasi Kasir</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Pesanan Anda telah kami terima dan masuk dalam antrean masak di dapur kami.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Diproses */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        getStepStatus(1, selectedOrder.orderStatus) === "completed"
                          ? "bg-emerald-500 text-white"
                          : getStepStatus(1, selectedOrder.orderStatus) === "active"
                          ? "bg-indigo-600 text-white animate-pulse"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Makanan Sedang Dimasak</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Koki handal JejakRasa sedang menyiapkan bumbu rahasia dan mengolah masakan segar Anda.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Selesai */}
                  <div className="relative flex items-start gap-4 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        getStepStatus(2, selectedOrder.orderStatus) === "completed"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Pesanan Telah Disajikan</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Selesai! Hidangan lezat hangat telah diantarkan ke Meja {selectedOrder.tableNumber}. Selamat menikmati hidangan spesial!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Detail Summary breakdown inside tracker */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Item Pesanan:</h4>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-600">
                      <span className="font-medium text-slate-800">{item.title}</span>
                      <span>
                        {item.quantity}x &bull; <span className="font-bold text-slate-700">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-slate-200/50 pt-2.5 mt-2.5 flex justify-between text-xs font-extrabold text-slate-800">
                    <span>Total Pembayaran</span>
                    <span className="text-indigo-600 font-black">
                      Rp {selectedOrder.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assistance support details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs gap-4">
                <p className="text-slate-500 leading-relaxed font-medium">
                  Butuh sendok tambahan, tisu, atau bantuan lainnya? Klik Hubungi Pelayan.
                </p>
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: "success",
                      title: "Pelayan Dipanggil!",
                      text: "Staff pelayan kami akan segera menghampiri meja Anda.",
                      confirmButtonColor: "#4f46e5"
                    });
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black shrink-0 cursor-pointer"
                >
                  Panggil Pelayan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
              <p className="text-sm">Silakan pilih pesanan di sebelah kiri untuk melacak status secara real-time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Orders;
