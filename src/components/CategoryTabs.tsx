import React from "react";
import * as Icons from "lucide-react";
import { Category } from "../data/categories";

interface CategoryTabsProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  id?: string;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedId,
  onSelect,
  id = "category-tabs"
}) => {
  return (
    <div id={id} className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
      {categories.map((cat) => {
        const IconComponent = (Icons as any)[cat.icon] || Icons.HelpCircle;
        const isActive = cat.id === selectedId;

        return (
          <button
            key={cat.id}
            id={`category-tab-${cat.id}`}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-102"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
