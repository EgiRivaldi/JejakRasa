import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { StatusBadge } from "../../components/StatusBadge";
import { SearchBar } from "../../components/SearchBar";
import { Clock, TableProperties, ShieldCheck, Check, RotateCcw, X, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");

  const statusOptions = ["Semua", "Menunggu Konfirmasi", "Diproses", "Selesai", "Dibatalkan"];

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.includes(searchQuery);

      const matchesStatus = selectedStatus === "Semua" || order.orderStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const handleUpdateOrderStatus = async (id: string, status: any, title: string) => {
    try {
      Swal.showLoading();
      await updateOrderStatus(id, status);
      Swal.close();
      const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500
      });
      toast.fire({
        icon: "success",
        title: `Status '${title}' diubah menjadi: ${status}`
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui status",
        text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
      });
    }
  };

  const handleUpdatePaymentStatus = async (id: string, status: any, title: string) => {
    try {
      Swal.showLoading();
      await updatePaymentStatus(id, status);
      Swal.close();
      const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500
      });
      toast.fire({
        icon: "success",
        title: `Pembayaran '${title}' diubah menjadi: ${status}`
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui status",
        text: "Terjadi kesalahan koneksi ke server database Clever Cloud."
      });
    }
  };

  const handleDeleteOrder = (id: string) => {
    Swal.fire({
      title: "Hapus Transaksi?",
      text: `Apakah Anda yakin ingin menghapus kode transaksi ${id} dari arsip database?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await deleteOrder(id);
          Swal.fire({
            icon: "success",
            title: "Terhapus",
            text: `Transaksi ${id} telah dihapus permanen.`,
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

  return (
    <div className="space-y-6" id="admin-orders-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Antrean Pesanan Masuk</h1>
        <p className="text-xs text-slate-500 font-medium">Lacak seluruh pesanan aktif meja pelanggan, update kematangan masakan koki, dan verifikasi kasir.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Cari berdasarkan No. TRX, nama pelanggan, atau nomor meja..." />

        {/* Tab-styled Status Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedStatus(opt)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                selectedStatus === opt
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Queue */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={order.id}
                  id={`admin-order-queue-${order.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-500 leading-none">{order.id}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>Dibuat pukul {dateStr} WIB</span>
                      </div>
                    </div>

                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black flex items-center gap-1">
                      <TableProperties className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Meja {order.tableNumber}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-wider">Pelanggan</p>
                    <p className="font-extrabold text-slate-800 text-sm leading-none">{order.customerName}</p>
                  </div>

                  {/* Order items nested listing */}
                  <div className="space-y-2 border-t border-b border-slate-50 py-3">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Daftar Menu Hidangan:</p>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                        <span className="truncate max-w-[160px] font-medium text-slate-800">{it.title}</span>
                        <span className="font-semibold text-slate-500">
                          {it.quantity}x &bull; Rp {(it.price * it.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total summary info */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subtotal</p>
                      <p>Rp {order.subtotal.toLocaleString("id-ID")}</p>
                    </div>
                    {order.discount > 0 && (
                      <div className="space-y-1 text-indigo-600">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Diskon</p>
                        <p>- Rp {order.discount.toLocaleString("id-ID")}</p>
                      </div>
                    )}
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                      <p className="font-black text-sm text-slate-900">Rp {order.total.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  {/* Badge Row */}
                  <div className="flex gap-2 items-center flex-wrap">
                    <StatusBadge type="order" status={order.orderStatus} />
                    <StatusBadge type="payment" status={order.paymentStatus} />
                  </div>

                  {/* Operations Control Actions block */}
                  <div className="border-t border-slate-50 pt-4 flex flex-col gap-2">
                    {/* 1. Order Status Updates */}
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Update Pesanan</span>
                      <div className="flex gap-1">
                        {order.orderStatus === "Menunggu Konfirmasi" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "Diproses", order.customerName)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-extrabold cursor-pointer"
                          >
                            Proses Masak
                          </button>
                        )}
                        {order.orderStatus === "Diproses" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "Selesai", order.customerName)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-extrabold cursor-pointer"
                          >
                            Selesai & Saji
                          </button>
                        )}
                        {order.orderStatus !== "Selesai" && order.orderStatus !== "Dibatalkan" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "Dibatalkan", order.customerName)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-extrabold cursor-pointer"
                          >
                            Batalkan
                          </button>
                        )}
                        {order.orderStatus === "Selesai" && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-bold">
                            Tuntas Disajikan
                          </span>
                        )}
                        {order.orderStatus === "Dibatalkan" && (
                          <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-1 rounded-md font-bold">
                            Dibatalkan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. Payment Status Updates */}
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pembayaran</span>
                      <div className="flex gap-1">
                        {order.paymentStatus === "Belum Bayar" ? (
                          <button
                            onClick={() => handleUpdatePaymentStatus(order.id, "Sudah Bayar", order.customerName)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-extrabold cursor-pointer"
                          >
                            Set Sudah Bayar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdatePaymentStatus(order.id, "Belum Bayar", order.customerName)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[10px] font-extrabold cursor-pointer"
                          >
                            Set Belum Bayar
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                          title="Hapus Pesanan Dari DB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-bold">
            Tidak ada antrean pesanan masuk yang sesuai dengan filter pencarian saat ini.
          </div>
        )}
      </div>
    </div>
  );
};
export default Orders;
