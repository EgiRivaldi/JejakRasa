import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { SearchBar } from "../../components/SearchBar";
import { CategoryTabs } from "../../components/CategoryTabs";
import { FoodCard } from "../../components/FoodCard";
import { PromoBanner } from "../../components/PromoBanner";
import { CartButton } from "../../components/CartButton";
import { EmptyState } from "../../components/EmptyState";
import { initialBanners } from "../../data/banners";
import { FoodItem } from "../../data/foods";
import { Star, X, ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

export const Home: React.FC = () => {
  const { foods, categories, promotions, addToCart, cart, activePromo, applyPromo, customerName, tableNumber } = useApp();
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");

  // Hero Banner Slider State
  const [activeSlide, setActiveSlide] = useState(0);

  // Detail Modal State
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  // Filter food list based on search query and category tab selection
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchQuery, selectedCategory]);

  const handleAddToCart = (food: FoodItem) => {
    addToCart(food, 1);
    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    toast.fire({
      icon: "success",
      title: `${food.title} masuk keranjang`
    });
  };

  const handleViewDetails = (food: FoodItem) => {
    setSelectedFood(food);
    setDetailQty(1);
  };

  const handleAddFromModal = () => {
    if (selectedFood) {
      addToCart(selectedFood, detailQty);
      setSelectedFood(null);
      Swal.fire({
        icon: "success",
        title: "Ditambahkan!",
        text: `${detailQty}x ${selectedFood.title} berhasil dimasukkan ke keranjang.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleApplyPromo = (code: string) => {
    const res = applyPromo(code);
    if (res.success) {
      Swal.fire({
        icon: "success",
        title: "Promo Aktif",
        text: res.message,
        confirmButtonColor: "#4f46e5"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Promo Gagal",
        text: res.message,
        confirmButtonColor: "#4f46e5"
      });
    }
  };

  return (
    <div className="pb-24 space-y-8" id="customer-home-page">
      {/* 1. Header & Welcome Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-1.5 leading-tight">
            Selamat Datang, <span className="text-indigo-600">{customerName}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Silakan pilih menu masakan nusantara favorit Anda. Pesanan akan langsung kami sajikan.
          </p>
        </div>
        <div className="bg-indigo-50 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-indigo-100 self-start md:self-auto">
          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
          <span className="text-xs font-extrabold text-indigo-700">Meja Nomor {tableNumber}</span>
        </div>
      </div>

      {/* 2. Hero Banner Carousel / Slider */}
      <div className="relative rounded-3xl overflow-hidden aspect-video max-h-[250px] md:max-h-[350px] w-full bg-gray-100 shadow-xs group">
        <img
          src={initialBanners[activeSlide].image}
          alt={initialBanners[activeSlide].title}
          className="w-full h-full object-cover transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-md inline-block mb-2">
              Highlight JejakRasa
            </span>
            <h2 className="text-lg md:text-2xl font-black text-white leading-tight mb-1 md:mb-2">
              {initialBanners[activeSlide].title}
            </h2>
            <p className="text-xs text-gray-200/90 leading-relaxed line-clamp-2">
              {initialBanners[activeSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Indicators */}
        <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
          {initialBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === activeSlide ? "bg-indigo-600 w-6" : "bg-white/50 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* 3. Promo Banner Slider Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">Kupon Promo Hari Ini</h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            DISKON S/D 30%
          </span>
        </div>
        <PromoBanner
          promotions={promotions}
          activePromoCode={activePromo?.code}
          onApplyPromo={handleApplyPromo}
        />
      </div>

      {/* 4. Search and Filter Menu */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <CategoryTabs
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* 5. Food Menu Grid list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg text-gray-900 tracking-tight">
            Daftar Menu {selectedCategory !== "semua" ? categories.find((c) => c.id === selectedCategory)?.name : "Terfavorit"}
          </h2>
          <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2.5 py-1 rounded-full">
            {filteredFoods.length} menu ditemukan
          </span>
        </div>

        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Inbox"
            title="Menu Tidak Ditemukan"
            description="Maaf, menu dengan kata kunci tersebut sedang tidak tersedia. Silakan gunakan kata kunci atau filter kategori lainnya."
            actionText="Reset Pencarian"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("semua");
            }}
          />
        )}
      </div>

      {/* 6. Food Detail Modal / Custom Bottom Drawer (Food Detail feature) */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-slide-in-up">
            {/* Image header */}
            <div className="relative aspect-video bg-gray-100">
              <img
                src={selectedFood.image}
                alt={selectedFood.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-xs hover:bg-black/80 text-white rounded-full transition-all cursor-pointer shadow-md"
                id="close-detail-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-4 left-4 bg-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-gray-800">{selectedFood.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
                  Kategori: {selectedFood.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">{selectedFood.title}</h3>
                <p className="text-lg font-black text-indigo-600 mt-1">
                  Rp {selectedFood.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Deskripsi Menu</h4>
                <p className="text-sm text-slate-600 leading-relaxed mt-1">{selectedFood.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1 border border-slate-200/50">
                  <button
                    onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition-all cursor-pointer"
                    id="modal-dec-qty"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-slate-800">{detailQty}</span>
                  <button
                    onClick={() => setDetailQty((prev) => prev + 1)}
                    className="p-1.5 hover:bg-white rounded-xl text-slate-600 transition-all cursor-pointer"
                    id="modal-inc-qty"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddFromModal}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-100 transition-all cursor-pointer active:scale-95"
                  id="modal-add-to-cart"
                >
                  Masukkan Keranjang (Rp {(selectedFood.price * detailQty).toLocaleString("id-ID")})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Floating Shopping Cart Summary button */}
      <CartButton onClick={() => navigate("/customer/cart")} />
    </div>
  );
};
export default Home;
