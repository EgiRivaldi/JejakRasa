import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { StatisticCard } from "../../components/StatisticCard";
import { StatusBadge } from "../../components/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { FileDown, Printer, BarChart3, TrendingUp, DollarSign, Receipt, Tag } from "lucide-react";
import Swal from "sweetalert2";

export const Reports: React.FC = () => {
  const { orders } = useApp();

  const paidOrders = useMemo(() => orders.filter((o) => o.paymentStatus === "Sudah Bayar"), [orders]);

  // Aggregate metrics
  const reportSummary = useMemo(() => {
    const totalRev = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const subtotalRev = paidOrders.reduce((sum, o) => sum + o.subtotal, 0);
    const totalDiscounts = paidOrders.reduce((sum, o) => sum + o.discount, 0);
    const totalTaxes = Math.round((subtotalRev - totalDiscounts) * 0.1);

    return {
      revenue: totalRev,
      subtotal: subtotalRev,
      discounts: totalDiscounts,
      taxes: totalTaxes,
      count: paidOrders.length
    };
  }, [paidOrders]);

  // Aggregate Payment methods chart data
  const paymentDistributionData = useMemo(() => {
    let qris = 0;
    let va = 0;
    let cash = 0;

    paidOrders.forEach((o) => {
      if (o.paymentMethod === "QRIS") qris += o.total;
      else if (o.paymentMethod === "Virtual Account") va += o.total;
      else if (o.paymentMethod === "Tunai") cash += o.total;
    });

    return [
      { name: "QRIS", value: qris, color: "#4f46e5" },
      { name: "Virtual Account", value: va, color: "#06b6d4" },
      { name: "Tunai", value: cash, color: "#64748b" }
    ];
  }, [paidOrders]);

  const handleDownloadCSV = () => {
    Swal.fire({
      icon: "success",
      title: "Ekspor Berhasil",
      text: "Laporan transaksi keuangan berhasil diekspor ke file CSV/Excel.",
      confirmButtonColor: "#4f46e5"
    });
  };

  const handlePrintReport = () => {
    Swal.fire({
      icon: "info",
      title: "Mempersiapkan Dokumen",
      text: "Mengirimkan lembaran laporan cetak ke mesin printer kasir operasional...",
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-6" id="admin-reports-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Laporan Keuangan & Penjualan
          </h1>
          <p className="text-xs text-slate-500 font-medium">Arsip pembukuan kas, total penerimaan pajak PB1 restoran, dan performa omset.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
            id="download-csv-btn"
          >
            <FileDown className="w-4 h-4" />
            Ekspor Excel/CSV
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            id="print-report-btn"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticCard
          title="Omset Pendapatan Bersih"
          value={`Rp ${reportSummary.revenue.toLocaleString("id-ID")}`}
          icon="CircleDollarSign"
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatisticCard
          title="Total Penjualan Kotor"
          value={`Rp ${reportSummary.subtotal.toLocaleString("id-ID")}`}
          icon="TrendingUp"
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatisticCard
          title="Penerimaan Pajak PB1"
          value={`Rp ${reportSummary.taxes.toLocaleString("id-ID")}`}
          icon="Receipt"
          colorClass="bg-purple-50 text-purple-600"
        />
        <StatisticCard
          title="Subsidi Potongan Promo"
          value={`Rp ${reportSummary.discounts.toLocaleString("id-ID")}`}
          icon="Tag"
          colorClass="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Channel share Pie Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Metode Pembayaran Terbanyak</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-1 rounded-md uppercase">
              Share Omset
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {reportSummary.revenue > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `Rp ${Number(val).toLocaleString("id-ID")}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 font-bold text-center">Belum ada data omset lunas.</p>
            )}
          </div>
        </div>

        {/* Financial Log Book List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Log Transaksi Selesai</h3>
            <p className="text-xs text-slate-400 font-medium">Rincian jurnal transaksi pembukuan kas lunas.</p>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[300px] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase sticky top-0">
                <tr>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Kode TRX</th>
                  <th className="px-6 py-3">Nama Pelanggan</th>
                  <th className="px-6 py-3">Metode</th>
                  <th className="px-6 py-3 text-right">Diskon</th>
                  <th className="px-6 py-3 text-right">Total Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                {paidOrders.map((order) => {
                  const dateForm = new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3">{dateForm}</td>
                      <td className="px-6 py-3 font-mono font-bold text-slate-800">{order.id}</td>
                      <td className="px-6 py-3 font-semibold text-slate-900">{order.customerName}</td>
                      <td className="px-6 py-3">{order.paymentMethod}</td>
                      <td className="px-6 py-3 text-right text-rose-500">
                        {order.discount > 0 ? `- Rp ${order.discount.toLocaleString("id-ID")}` : "-"}
                      </td>
                      <td className="px-6 py-3 text-right font-black text-slate-900">
                        Rp {order.total.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
                {paidOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-bold">
                      Belum ada laporan transaksi lunas saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;
