import React from "react";
import { Wallet, QrCode, CreditCard, CheckCircle2 } from "lucide-react";

interface PaymentCardProps {
  method: "Tunai" | "QRIS" | "Virtual Account";
  selected: boolean;
  onSelect: () => void;
  id?: string;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  method,
  selected,
  onSelect,
  id
}) => {
  let title = "Tunai";
  let description = "Bayar langsung di kasir";
  let Icon = Wallet;
  let color = "from-amber-500 to-yellow-500";
  let lightColor = "bg-amber-50 text-amber-600";

  if (method === "QRIS") {
    title = "QRIS Dinamis";
    description = "Pindai kode QR instan & lunas";
    Icon = QrCode;
    color = "from-indigo-500 to-purple-500";
    lightColor = "bg-indigo-50 text-indigo-600";
  } else if (method === "Virtual Account") {
    title = "Virtual Account";
    description = "Transfer via Bank Mandiri/BCA/BRI";
    Icon = CreditCard;
    color = "from-sky-500 to-blue-500";
    lightColor = "bg-sky-50 text-sky-600";
  }

  return (
    <button
      id={id || `payment-card-${method.toLowerCase().replace(/\s+/g, "-")}`}
      type="button"
      onClick={onSelect}
      className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
        selected
          ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm"
          : "border-slate-100 hover:border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3.5 rounded-2xl ${lightColor} flex-shrink-0`}>
          <Icon className="w-5 h-5 stroke-[2.2px]" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-800 leading-tight mb-1">{title}</h4>
          <p className="text-xs text-slate-400 leading-none">{description}</p>
        </div>
      </div>

      <div>
        {selected ? (
          <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
        ) : (
          <div className="w-5 h-5 rounded-full border border-slate-200"></div>
        )}
      </div>
    </button>
  );
};
