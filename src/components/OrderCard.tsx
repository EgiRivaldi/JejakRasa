import React from "react";
import { Clock, TableProperties, ArrowRight, Eye } from "lucide-react";
import { Order } from "../data/orders";
import { StatusBadge } from "./StatusBadge";

interface OrderCardProps {
  order: Order;
  onTrack: (order: Order) => void;
  id?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onTrack, id }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      id={id || `order-card-${order.id}`}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">
          <TableProperties className="w-3.5 h-3.5 text-indigo-400" />
          <span>Meja {order.tableNumber}</span>
        </div>
      </div>

      {/* Items Summary list */}
      <div className="space-y-1">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs text-gray-600">
            <span className="truncate max-w-[200px]">{item.title}</span>
            <span className="font-semibold text-gray-800">x{item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-[11px] text-gray-400 font-medium">
            + {order.items.length - 2} menu lainnya
          </p>
        )}
      </div>

      {/* Badges & Price Row */}
      <div className="flex flex-wrap gap-2 items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-2">
          <StatusBadge type="order" status={order.orderStatus} />
          <StatusBadge type="payment" status={order.paymentStatus} />
        </div>

        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Bayar</p>
          <p className="font-extrabold text-gray-900 text-sm">
            Rp {order.total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Track button */}
      <button
        onClick={() => onTrack(order)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
        id={`order-track-btn-${order.id}`}
      >
        <Eye className="w-4 h-4" />
        Lacak Pesanan / Detail
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  );
};
