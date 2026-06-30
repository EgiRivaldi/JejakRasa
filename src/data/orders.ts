export interface OrderItem {
  id: string; // matches FoodItem id
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: "Tunai" | "QRIS" | "Virtual Account";
  paymentStatus: "Belum Bayar" | "Sudah Bayar";
  orderStatus: "Menunggu Konfirmasi" | "Diproses" | "Selesai" | "Dibatalkan";
  createdAt: string;
}

export const initialOrders: Order[] = [
  {
    id: "TRX-20260629-01",
    tableNumber: "05",
    customerName: "Ahmad Sobari",
    items: [
      { id: "1", title: "Nasi Goreng Spesial JejakRasa", price: 28000, quantity: 2 },
      { id: "5", title: "Es Teh Manis Jumbo", price: 6000, quantity: 2 }
    ],
    subtotal: 68000,
    discount: 6800,
    total: 61200,
    promoCode: "JEJAKRASA10",
    paymentMethod: "QRIS",
    paymentStatus: "Sudah Bayar",
    orderStatus: "Selesai",
    createdAt: "2026-06-29T11:45:00Z"
  },
  {
    id: "TRX-20260629-02",
    tableNumber: "12",
    customerName: "Rani Rahmawati",
    items: [
      { id: "2", title: "Sate Ayam Madura Premium", price: 32000, quantity: 1 },
      { id: "7", title: "Kopi Susu Gula Aren", price: 15000, quantity: 1 },
      { id: "9", title: "Pisang Goreng Keju Coklat", price: 16000, quantity: 1 }
    ],
    subtotal: 63000,
    discount: 0,
    total: 63000,
    paymentMethod: "Virtual Account",
    paymentStatus: "Sudah Bayar",
    orderStatus: "Diproses",
    createdAt: "2026-06-29T15:20:00Z"
  },
  {
    id: "TRX-20260629-03",
    tableNumber: "03",
    customerName: "Budi Santoso",
    items: [
      { id: "3", title: "Rendang Padang Daging Sapi", price: 38000, quantity: 1 },
      { id: "6", title: "Es Campur JejakRasa Segar", price: 18000, quantity: 1 }
    ],
    subtotal: 56000,
    discount: 0,
    total: 56000,
    paymentMethod: "Tunai",
    paymentStatus: "Belum Bayar",
    orderStatus: "Menunggu Konfirmasi",
    createdAt: "2026-06-29T16:30:00Z"
  }
];
