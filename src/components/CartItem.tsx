import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "../context/AppContext";

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  id?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  id
}) => {
  const { food, quantity } = item;

  return (
    <div
      id={id || `cart-item-${food.id}`}
      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm gap-3"
    >
      {/* Food Thumb */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={food.image}
          alt={food.title}
          className="w-16 h-16 rounded-2xl object-cover bg-slate-50 flex-shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <h4 className="font-bold text-slate-800 text-sm truncate mb-0.5">{food.title}</h4>
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1">
            {food.category}
          </span>
          <p className="font-extrabold text-slate-950 text-xs">
            Rp {food.price.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Control Quantity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
          <button
            onClick={onDecrease}
            className="p-1.5 hover:bg-white rounded-xl text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
            id={`cart-item-dec-${food.id}`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-extrabold text-sm text-gray-800" id={`cart-item-qty-${food.id}`}>
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="p-1.5 hover:bg-white rounded-xl text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
            id={`cart-item-inc-${food.id}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete button */}
        <button
          onClick={onRemove}
          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          title="Hapus item"
          id={`cart-item-del-${food.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
