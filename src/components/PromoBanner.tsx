import React from "react";
import { Ticket, ArrowRight, Check } from "lucide-react";
import { Promotion } from "../data/promotions";

interface PromoBannerProps {
  promotions: Promotion[];
  activePromoCode?: string;
  onApplyPromo: (code: string) => void;
  id?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promotions,
  activePromoCode,
  onApplyPromo,
  id = "promo-banners"
}) => {
  return (
    <div id={id} className="flex gap-4 overflow-x-auto no-scrollbar py-2">
      {promotions.map((promo) => {
        const isApplied = activePromoCode?.toUpperCase() === promo.code.toUpperCase();

        return (
          <div
            key={promo.id}
            id={`promo-card-${promo.id}`}
            className="flex-shrink-0 w-80 bg-gradient-to-br from-indigo-600 to-indigo-850 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background design accents */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 translate-y-12 blur-xl"></div>
            <div className="absolute left-0 top-0 w-16 h-16 bg-black/10 rounded-full -translate-x-6 -translate-y-6"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-5 h-5 text-indigo-200" />
                <span className="text-xs font-bold tracking-widest text-indigo-100 uppercase">
                  PROMO SPESIAL
                </span>
              </div>
              <h3 className="font-extrabold text-lg leading-tight mb-1">{promo.title}</h3>
              <p className="text-xs text-indigo-50/90 leading-relaxed mb-4">{promo.description}</p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-2 pt-3 border-t border-white/10">
              <div>
                <span className="text-[10px] text-indigo-100 block font-medium">KODE PROMO</span>
                <span className="font-mono font-extrabold text-sm tracking-wider text-indigo-200">
                  {promo.code}
                </span>
              </div>

              {isApplied ? (
                <span className="flex items-center gap-1 px-3.5 py-1.5 bg-white text-indigo-700 rounded-xl text-xs font-extrabold shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  Terpasang
                </span>
              ) : (
                <button
                  onClick={() => onApplyPromo(promo.code)}
                  className="flex items-center gap-1 px-4 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  Gunakan
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
