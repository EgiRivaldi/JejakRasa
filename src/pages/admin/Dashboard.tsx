import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { StatisticCard } from "../../components/StatisticCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CircleDollarSign,
  ArrowRight,
  Utensils,
  Eye,
  Settings,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";

export const Dashboard: React.FC = () => {
  const { orders, foods } = useApp();
  const navigate = useNavigate();

  // Metrics aggregation
  const metrics = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === "Sudah Bayar");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter(
      (o) => o.orderStatus === "Menunggu Konfirmasi" || o.orderStatus === "Diproses"
    ).length;

    const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    return {
      revenue: totalRevenue,
      orders: totalOrdersCount,
      active: activeOrdersCount,
      aov: averageOrderValue
    };
  }, [orders]);

  // Chart 1: Revenue trend over dates
  const revenueTrendData = useMemo(() => {
    // Group orders by date
    const dateMap: { [key: string]: number } = {};
    // Populate some default dummy values for past week
    const dates = ["23 Jun", "24 Jun", "25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun"];
    const baseRevenue = [240000, 310000, 180000, 450000, 520000, 680000, 0];

    dates.forEach((d, i) => {
      dateMap[d] = baseRevenue[i];
    });

    // Add current live orders data to "29 Jun"
    const todayRevenue = orders
      .filter((o) => o.paymentStatus === "Sudah Bayar")
      .reduce((sum, o) => sum + o.total, 0);

    dateMap["29 Jun"] = todayRevenue;

    return dates.map((date) => ({
      name: date,
      Pendapatan: dateMap[date]
    }));
  }, [orders]);

  // Chart 2: Top ordered items
  const topOrderedItemsData = useMemo(() => {
    const counts: { [title: string]: number } = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        counts[it.title] = (counts[it.title] || 0) + it.quantity;
      });
    });

    // Convert to array
    const sorted = Object.keys(counts)
      .map((title) => ({
        name: title,
        Kuantitas: counts[title]
      }))
      .sort((a, b) => b.Kuantitas - a.Kuantitas)
      .slice(0, 5);

    // Fallback if no items ordered
    if (sorted.length === 0) {
      return [
        { name: "Nasi Goreng", Kuantitas: 5 },
        { name: "Sate Ayam", Kuantitas: 4 },
        { name: "Es Campur", Kuantitas: 3 },
        { name: "Kopi Susu Aren", Kuantitas: 3 },
        { name: "Pancake Durian", Kuantitas: 2 }
      ];
    }
    return sorted;
  }, [orders]);

  // Status handler
  const handleUpdateStatus = (orderId: string, status: any) => {
    // Navigate to order queue page to manage
    navigate("/admin/orders");
  };

  return (
    <div className="space-y-6" id="admin-dashboard-page">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ringkasan Analitik</h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor pendapatan harian, performa menu, dan kepuasan antrean meja kasir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Kelola Antrean
          </Link>
          <Link
            to="/admin/menu"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4 text-slate-500" />
            Tambah Menu Baru
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticCard
          title="Pendapatan Lunas"
          value={`Rp ${metrics.revenue.toLocaleString("id-ID")}`}
          icon="CircleDollarSign"
          trend={{ type: "up", value: "+12.4%" }}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatisticCard
          title="Total Transaksi"
          value={metrics.orders}
          icon="ShoppingBag"
          trend={{ type: "up", value: "+8.2%" }}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatisticCard
          title="Antrean Masak"
          value={metrics.active}
          icon="Flame"
          trend={{ type: "neutral", value: "Stabil" }}
          colorClass="bg-orange-50 text-orange-600"
        />
        <StatisticCard
          title="Rata-rata Tagihan"
          value={`Rp ${metrics.aov.toLocaleString("id-ID")}`}
          icon="TrendingUp"
          trend={{ type: "down", value: "-1.5%" }}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Tren Penjualan Mingguan</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-2 py-1 rounded-md uppercase">
              Rupiah (IDR)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pendapatan"]}
                  contentStyle={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: "16px", fontSize: "12px", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="Pendapatan" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top items chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">5 Menu Terlaris</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-1 rounded-md uppercase">
              Unit Terjual
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topOrderedItemsData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: "16px", fontSize: "11px" }} />
                <Bar dataKey="Kuantitas" fill="#4f46e5" radius={[0, 8, 8, 0]}>
                  {topOrderedItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#312e81" : index === 1 ? "#4338ca" : index === 2 ? "#4f46e5" : "#818cf8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Transaksi Masuk Terbaru</h3>
            <p className="text-xs text-slate-400 font-medium">Daftar transaksi yang baru saja dikirim oleh pelanggan dari meja.</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            Lihat Semua Antrean
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Orders Table Container */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Kode TRX</th>
                <th className="px-6 py-4">Meja</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4">Status Pesanan</th>
                <th className="px-6 py-4">Status Bayar</th>
                <th className="px-6 py-4 text-right">Total Akhir</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{order.id}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg">
                      Meja {order.tableNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{order.customerName}</td>
                  <td className="px-6 py-4 font-semibold">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <StatusBadge type="order" status={order.orderStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type="payment" status={order.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">
                    Rp {order.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate("/admin/orders")}
                      className="p-1.5 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-2xs transition-all cursor-pointer"
                      title="Detail & Update Antrean"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400 font-bold">
                    Tidak ada transaksi masuk saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
