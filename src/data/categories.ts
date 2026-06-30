export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
}

export const initialCategories: Category[] = [
  { id: "semua", name: "Semua", icon: "Grid" },
  { id: "makanan", name: "Makanan", icon: "Utensils" },
  { id: "minuman", name: "Minuman", icon: "CupSoda" },
  { id: "cemilan", name: "Cemilan", icon: "Cookie" },
  { id: "dessert", name: "Dessert", icon: "CakeSlice" }
];
