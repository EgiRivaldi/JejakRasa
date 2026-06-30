import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CartButtonProps {
  onClick: () => void;
  id?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick, id = "floating-cart-button" }) => {
  const { cart } = useApp();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <button
      id={id}
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl p-4 shadow-xl shadow-indigo-600/20 flex items-center justify-between transition-all duration-300 hover:scale-102 active:scale-98 z-50 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="relative p-2 bg-indigo-500 rounded-2xl">
          <ShoppingBag className="w-5 h-5 text-white" />
          <span className="absolute -top-1.5 -right-1.5 bg-white text-indigo-600 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
            {totalItems}
          </span>
        </div>
        <div className="text-left">
          <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider leading-none mb-1">
            Keranjang Belanja
          </p>
          <p className="font-extrabold text-base leading-none">
            Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 font-bold text-sm">
        Lihat Keranjang
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
};
