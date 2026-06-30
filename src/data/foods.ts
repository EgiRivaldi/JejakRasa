export interface FoodItem {
  id: string;
  title: string;
  category: string; // makanan, minuman, cemilan, dessert
  price: number;
  description: string;
  rating: number;
  status: "Tersedia" | "Habis";
  image: string;
}

export const initialFoods: FoodItem[] = [
  {
    id: "1",
    title: "Nasi Goreng Spesial JejakRasa",
    category: "makanan",
    price: 28000,
    description: "Nasi goreng bumbu khas JejakRasa dengan telur ceplok, sate ayam, acar segar, dan kerupuk renyah.",
    rating: 4.8,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1603133872878-685f5888a3f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    title: "Sate Ayam Madura Premium",
    category: "makanan",
    price: 32000,
    description: "10 tusuk sate ayam empuk disiram bumbu kacang gurih kental, kecap manis, dan taburan bawang goreng.",
    rating: 4.9,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    title: "Rendang Padang Daging Sapi",
    category: "makanan",
    price: 38000,
    description: "Daging sapi pilihan yang dimasak perlahan dengan santan dan rempah-rempah autentik Minang hingga meresap.",
    rating: 4.9,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "4",
    title: "Mie Goreng Aceh Kepiting",
    category: "makanan",
    price: 30000,
    description: "Mie tebal khas Aceh dengan bumbu kari pedas pekat, disajikan dengan sayuran segar dan acar bawang merah.",
    rating: 4.7,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "5",
    title: "Es Teh Manis Jumbo",
    category: "minuman",
    price: 6000,
    description: "Teh melati seduh tradisional disajikan dingin dalam gelas ukuran jumbo yang sangat menyegarkan.",
    rating: 4.6,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "6",
    title: "Es Campur JejakRasa Segar",
    category: "minuman",
    price: 18000,
    description: "Es serut dengan isian alpukat, nangka, kolang-kaling, kelapa muda, jeli, susu kental manis, dan sirup merah khas.",
    rating: 4.8,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "7",
    title: "Kopi Susu Gula Aren",
    category: "minuman",
    price: 15000,
    description: "Paduan espresso arabika, susu segar cair, dan pemanis alami sirup gula aren murni.",
    rating: 4.7,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "8",
    title: "Kentang Goreng Krispi",
    category: "cemilan",
    price: 14000,
    description: "Kentang goreng potongan tebal yang digoreng garing di luar, lembut di dalam dengan taburan garam laut halus.",
    rating: 4.5,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "9",
    title: "Pisang Goreng Keju Coklat",
    category: "cemilan",
    price: 16000,
    description: "Pisang kepok manis digoreng krispi dengan tepung roti, diberi limpahan keju parut gurih dan meses coklat.",
    rating: 4.8,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "10",
    title: "Roti Bakar Coklat Keju",
    category: "cemilan",
    price: 15000,
    description: "Roti tawar tebal dibakar dengan margarin gurih, diisi coklat lumer, diselimuti keju parut melimpah.",
    rating: 4.7,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "11",
    title: "Pancake Durian Medan",
    category: "dessert",
    price: 25000,
    description: "Kulit pancake tipis lembut berisi daging buah durian Medan murni tanpa campuran dan krim kocok manis.",
    rating: 4.9,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "12",
    title: "Affogato Matcha Delight",
    category: "dessert",
    price: 20000,
    description: "Satu skop es krim vanila lembut disiram dengan seduhan matcha Jepang kental berkualitas tinggi.",
    rating: 4.7,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80"
  }
];
