export interface Promotion {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  minTransaction: number;
  description: string;
  image: string;
}

export const initialPromotions: Promotion[] = [
  {
    id: "p1",
    title: "Diskon Ceria Pengguna Baru",
    code: "JEJAKRASA10",
    discountPercent: 10,
    minTransaction: 20000,
    description: "Nikmati potongan harga sebesar 10% untuk pemesanan pertama Anda tanpa batas menu.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    title: "Makan Hemat Akhir Bulan",
    code: "KENYANG20",
    discountPercent: 20,
    minTransaction: 75000,
    description: "Dapatkan diskon 20% khusus transaksi di atas Rp 75.000. Makan nikmat tetap hemat!",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    title: "Gila Kuliner Weekend",
    code: "WEEKEND30",
    discountPercent: 30,
    minTransaction: 100000,
    description: "Pesta rasa akhir pekan dengan diskon 30% hingga maksimal Rp 40.000 di setiap hari Sabtu & Minggu.",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80"
  }
];
