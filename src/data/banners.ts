export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const initialBanners: Banner[] = [
  {
    id: "b1",
    title: "Cita Rasa Autentik Nusantara",
    subtitle: "Nikmati masakan khas Indonesia yang dimasak dengan rempah-rempah segar dan resep tradisional warisan leluhur.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "b2",
    title: "Pesan dari Meja Tanpa Antre",
    subtitle: "Cukup scan QR code di meja Anda, pesan makanan favorit lewat ponsel, bayar instan, dan pesanan akan langsung diantar.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "b3",
    title: "Diskon Melimpah Setiap Hari",
    subtitle: "Temukan berbagai promo menarik mulai dari gratis menu pembuka hingga diskon spesial pembayaran QRIS & VA.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80"
  }
];
