import React from "react";
import { Star, Plus, Eye, ShoppingBag } from "lucide-react";
import { FoodItem } from "../data/foods";

interface FoodCardProps {
  food: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  onViewDetails: (food: FoodItem) => void;
  id?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onAddToCart, onViewDetails, id }) => {
  const isAvailable = food.status === "Tersedia";

  return (
    <div
      id={id || `food-card-${food.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full group"
    >
      {/* Food Image & Badge */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={food.image}
          alt={food.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-gray-800">{Number(food.rating).toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg transform -rotate-3">
              Habis
            </span>
          </div>
        )}

        {/* Quick Hover Action Overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onViewDetails(food)}
              className="p-3 bg-white rounded-full shadow-md text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all cursor-pointer"
              title="Lihat Detail"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onAddToCart(food)}
              className="p-3 bg-indigo-600 rounded-full shadow-md text-white hover:bg-indigo-700 hover:scale-110 transition-all cursor-pointer"
              title="Tambah ke Keranjang"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Food Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
            {food.category}
          </span>
          <h3 className="font-bold text-slate-850 text-base leading-tight group-hover:text-indigo-600 transition-colors mb-1 line-clamp-1">
            {food.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
            {food.description}
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Harga</p>
            <p className="font-extrabold text-slate-950 text-base">
              Rp {food.price.toLocaleString("id-ID")}
            </p>
          </div>

          {isAvailable ? (
            <button
              onClick={() => onAddToCart(food)}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs shadow-indigo-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Pesan
            </button>
          ) : (
            <button
              disabled
              className="px-3 py-2 bg-gray-100 text-gray-400 rounded-2xl text-xs font-bold cursor-not-allowed"
            >
              Habis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
