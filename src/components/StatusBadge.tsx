import React from "react";

interface StatusBadgeProps {
  type: "order" | "payment";
  status: string;
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status, id }) => {
  let bg = "bg-gray-100 text-gray-800";

  if (type === "order") {
    switch (status) {
      case "Menunggu Konfirmasi":
        bg = "bg-amber-100 text-amber-800 border border-amber-200";
        break;
      case "Diproses":
        bg = "bg-blue-100 text-blue-800 border border-blue-200";
        break;
      case "Selesai":
        bg = "bg-emerald-100 text-emerald-800 border border-emerald-200";
        break;
      case "Dibatalkan":
        bg = "bg-rose-100 text-rose-800 border border-rose-200";
        break;
    }
  } else {
    switch (status) {
      case "Belum Bayar":
        bg = "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse";
        break;
      case "Sudah Bayar":
        bg = "bg-emerald-100 text-emerald-800 border border-emerald-200";
        break;
    }
  }

  return (
    <span
      id={id || `status-${status.replace(/\s+/g, "-").toLowerCase()}`}
      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
