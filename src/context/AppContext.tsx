import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem } from "../data/foods";
import { Category } from "../data/categories";
import { Order, OrderItem } from "../data/orders";
import { Promotion } from "../data/promotions";
import api from "../api/client";
import Swal from "sweetalert2";

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface Table {
  number: string;
  status: "Tersedia" | "Terisi";
}

interface AppContextType {
  foods: FoodItem[];
  categories: Category[];
  orders: Order[];
  promotions: Promotion[];
  tables: Table[];
  cart: CartItem[];
  tableNumber: string;
  customerName: string;
  isAdmin: boolean;
  activePromo: Promotion | null;
  isLoading: boolean;
  loginCustomer: (name: string, table: string) => void;
  logoutCustomer: () => void;
  loginAdmin: (displayName?: string) => void;
  logoutAdmin: () => void;
  addToCart: (food: FoodItem, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateCartQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  placeOrder: (paymentMethod: "Tunai" | "QRIS" | "Virtual Account") => Promise<Order | null>;
  addFood: (food: Omit<FoodItem, "id">) => Promise<void>;
  updateFood: (id: string, food: Partial<FoodItem>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: Order["paymentStatus"]) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  addTable: (number: string) => Promise<void>;
  deleteTable: (number: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart and user session remain client-side (localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("jr_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [tableNumber, setTableNumber] = useState<string>(() => {
    return localStorage.getItem("jr_tableNumber") || "";
  });

  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem("jr_customerName") || "";
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("jr_isAdmin") === "true";
  });

  const [activePromo, setActivePromo] = useState<Promotion | null>(() => {
    const saved = localStorage.getItem("jr_activePromo");
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch initial data from API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [fetchedFoods, fetchedCategories, fetchedOrders, fetchedPromotions, fetchedTables] = await Promise.all([
        api.get<FoodItem[]>("/foods"),
        api.get<Category[]>("/categories"),
        api.get<Order[]>("/orders"),
        api.get<Promotion[]>("/promotions"),
        api.get<Table[]>("/tables")
      ]);

      setFoods(fetchedFoods);
      setCategories(fetchedCategories);
      setOrders(fetchedOrders);
      setPromotions(fetchedPromotions);
      setTables(fetchedTables);
    } catch (error) {
      console.error("Failed to load initial data from API:", error);
      Swal.fire({
        icon: "error",
        title: "Koneksi Database Gagal",
        text: "Gagal memuat data dari server. Pastikan XAMPP MySQL dan server API berjalan."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync client-side session states to LocalStorage
  useEffect(() => {
    localStorage.setItem("jr_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("jr_tableNumber", tableNumber);
    localStorage.setItem("jr_customerName", customerName);
  }, [tableNumber, customerName]);

  useEffect(() => {
    localStorage.setItem("jr_isAdmin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  useEffect(() => {
    if (activePromo) {
      localStorage.setItem("jr_activePromo", JSON.stringify(activePromo));
    } else {
      localStorage.removeItem("jr_activePromo");
    }
  }, [activePromo]);

  // Actions
  const loginCustomer = (name: string, table: string) => {
    setCustomerName(name);
    setTableNumber(table);
    setIsAdmin(false);
  };

  const logoutCustomer = () => {
    setCustomerName("");
    setTableNumber("");
    setCart([]);
    setActivePromo(null);
  };

  const loginAdmin = (displayName?: string) => {
    setIsAdmin(true);
    setCustomerName(displayName || "Admin JejakRasa");
    setTableNumber("Admin");
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setCustomerName("");
    setTableNumber("");
  };

  const addToCart = (food: FoodItem, quantity = 1) => {
    if (food.status === "Habis") return;
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { food, quantity }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === foodId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.food.id !== foodId);
    });
  };

  const updateCartQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.food.id !== foodId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.food.id === foodId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
  };

  const applyPromo = (code: string) => {
    const promo = promotions.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return { success: false, message: "Kode promo tidak ditemukan!" };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    if (subtotal < promo.minTransaction) {
      return {
        success: false,
        message: `Minimal transaksi untuk promo ini adalah Rp ${promo.minTransaction.toLocaleString("id-ID")}`
      };
    }

    setActivePromo(promo);
    return { success: true, message: `Promo '${promo.title}' berhasil dipasang!` };
  };

  const removePromo = () => {
    setActivePromo(null);
  };

  const placeOrder = async (paymentMethod: "Tunai" | "QRIS" | "Virtual Account") => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    let discount = 0;
    if (activePromo) {
      discount = Math.round((subtotal * activePromo.discountPercent) / 100);
    }
    const total = subtotal - discount;

    const orderItems = cart.map((item) => ({
      id: item.food.id,
      title: item.food.title,
      price: item.food.price,
      quantity: item.quantity
    }));

    const newOrderData = {
      tableNumber,
      customerName,
      items: orderItems,
      subtotal,
      discount,
      total,
      promoCode: activePromo?.code,
      paymentMethod
    };

    try {
      const createdOrder = await api.post<Order>("/orders", newOrderData);
      setOrders((prev) => [createdOrder, ...prev]);
      clearCart();
      return createdOrder;
    } catch (error) {
      console.error("Failed to place order via API:", error);
      throw error;
    }
  };

  // Admin CRUD for Foods
  const addFood = async (foodData: Omit<FoodItem, "id">) => {
    try {
      const createdFood = await api.post<FoodItem>("/foods", foodData);
      setFoods((prev) => [...prev, createdFood]);
    } catch (error) {
      console.error("Failed to add food via API:", error);
      throw error;
    }
  };

  const updateFood = async (id: string, updatedFields: Partial<FoodItem>) => {
    try {
      // Find current food item to merge data
      const currentFood = foods.find(f => f.id === id);
      if (!currentFood) throw new Error("Menu tidak ditemukan!");

      const mergedFood = { ...currentFood, ...updatedFields };
      const updatedFood = await api.put<FoodItem>(`/foods/${id}`, mergedFood);

      setFoods((prev) =>
        prev.map((f) => (f.id === id ? updatedFood : f))
      );
    } catch (error) {
      console.error("Failed to update food via API:", error);
      throw error;
    }
  };

  const deleteFood = async (id: string) => {
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to delete food via API:", error);
      throw error;
    }
  };

  // Admin CRUD for Categories
  const addCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      const createdCategory = await api.post<Category>("/categories", categoryData);
      setCategories((prev) => [...prev, createdCategory]);
    } catch (error) {
      console.error("Failed to add category via API:", error);
      throw error;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const updatedCategory = await api.put<Category>(`/categories/${id}`, { name });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: updatedCategory.name } : c))
      );
    } catch (error) {
      console.error("Failed to update category via API:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category via API:", error);
      throw error;
    }
  };

  // Admin Order Status Update
  const updateOrderStatus = async (orderId: string, status: Order["orderStatus"]) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch (error) {
      console.error("Failed to update order status via API:", error);
      throw error;
    }
  };

  const updatePaymentStatus = async (orderId: string, status: Order["paymentStatus"]) => {
    try {
      await api.patch(`/orders/${orderId}/payment`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
      );
    } catch (error) {
      console.error("Failed to update payment status via API:", error);
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order via API:", error);
      throw error;
    }
  };

  // Admin CRUD for Tables
  const addTable = async (number: string) => {
    try {
      const createdTable = await api.post<Table>("/tables", { number });
      setTables((prev) => [...prev, createdTable].sort((a, b) => parseInt(a.number) - parseInt(b.number)));
    } catch (error) {
      console.error("Failed to add table via API:", error);
      throw error;
    }
  };

  const deleteTable = async (number: string) => {
    try {
      await api.delete(`/tables/${number}`);
      setTables((prev) => prev.filter((t) => t.number !== number));
    } catch (error) {
      console.error("Failed to delete table via API:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        foods,
        categories,
        orders,
        promotions,
        tables,
        cart,
        tableNumber,
        customerName,
        isAdmin,
        activePromo,
        isLoading,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyPromo,
        removePromo,
        placeOrder,
        addFood,
        updateFood,
        deleteFood,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        addTable,
        deleteTable,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
