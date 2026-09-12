import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types';
import { 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  Share2, 
  Info, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Flame, 
  Tag, 
  ArrowLeft,
  Search
} from 'lucide-react';

export const RestaurantDetailView: React.FC = () => {
  const { 
    selectedRestaurant, 
    setCurrentView, 
    cart, 
    addToCart, 
    updateQuantity, 
    setSelectedFoodItem, 
    favorites, 
    toggleFavoriteRestaurant,
    showToast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  if (!selectedRestaurant) {
    return (
      <div className="py-20 text-center text-white">
        <p>No restaurant selected.</p>
        <button 
          onClick={() => setCurrentView('restaurants')}
          className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const restaurantReviews = (selectedRestaurant.reviews && selectedRestaurant.reviews.length > 0)
    ? selectedRestaurant.reviews
    : [
        {
          id: `rev-${selectedRestaurant.id}-1`,
          userName: 'Arjun V.',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          date: 'Yesterday',
          rating: 5,
          comment: 'Sensational flavor and temperature was piping fresh! Packaging was pristine and prompt. Truly five-star quality.'
        },
        {
          id: `rev-${selectedRestaurant.id}-2`,
          userName: 'Priya S.',
          userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
          date: '3 days ago',
          rating: 4.9,
          comment: 'One of the best dining discoveries in the city. The artisanal texture, rich ingredients, and consistency are unbeatable.'
        },
        {
          id: `rev-${selectedRestaurant.id}-3`,
          userName: 'Rohan M.',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          date: 'Last week',
          rating: 5,
          comment: 'Outstanding culinary craft. Every bite was packed with depth. Ordered multiple times already!'
        }
      ];

  const isFav = favorites.restaurants.includes(selectedRestaurant.id);

  // Extract menu categories
  const categories = ['All', ...Array.from(new Set(selectedRestaurant.menuItems.map((m) => m.category)))];

  // Filtered menu items
  const filteredMenuItems = selectedRestaurant.menuItems.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (menuSearch.trim() && !item.name.toLowerCase().includes(menuSearch.toLowerCase()) && !item.description.toLowerCase().includes(menuSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Restaurant link copied to clipboard! 📋', 'success');
  };

  const handleItemAdd = (item: FoodItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setSelectedFoodItem(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 pb-20">
      {/* Back Button Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => setCurrentView('restaurants')}
          className="inline-flex items-center space-x-2 text-stone-400 hover:text-white text-xs font-semibold cursor-pointer transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </button>
      </div>

      {/* Hero Cover */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
        <img
          src={selectedRestaurant.coverImage}
          alt={selectedRestaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Top Floating Actions */}
        <div className="absolute top-4 right-4 sm:right-8 flex items-center space-x-2">
          <button
            onClick={() => toggleFavoriteRestaurant(selectedRestaurant.id)}
            className="p-2.5 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 hover:text-rose-500 transition cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 hover:text-white transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Restaurant Info Card */}
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-3 sm:-mt-16 sm:px-5 md:-mt-20 lg:px-8">
  <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/95 shadow-2xl shadow-black/30 backdrop-blur-xl">

    {/* =========================================================
        RESTAURANT HEADER
    ========================================================== */}
    <div className="p-4 sm:p-6 md:p-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

        {/* =====================================================
            RESTAURANT IDENTITY
        ====================================================== */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-5">

          {/* LOGO */}
          <div className="shrink-0">
            <img
              src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScIIWnp1L2tCxxp64ww7YztrdTv-QdVX-FbmhMwsTVLtDr4tjVZRHxUivw&s=10"}
              alt={selectedRestaurant.name}
              referrerPolicy="no-referrer"
              className="
                h-16 w-16
                rounded-2xl
                border-2 border-amber-500/60
                object-cover
                shadow-lg shadow-amber-500/10
                sm:h-20 sm:w-20
                md:h-24 md:w-24
              "
            />
          </div>

          {/* RESTAURANT INFO */}
          <div className="min-w-0 flex-1">

            {/* BADGE + STATUS */}
            <div className="mb-1.5 flex flex-wrap items-center gap-2 sm:mb-2">

              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  rounded-md
                  border border-amber-500/30
                  bg-amber-500/20
                  px-2 py-1
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-amber-300
                  sm:px-2.5
                  sm:text-[10px]
                "
              >
                Artisanal Kitchen
              </span>

              {selectedRestaurant.isOpen ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 sm:text-xs">
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
                  <span>Open Now</span>
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-rose-400 sm:text-xs">
                  Closed
                </span>
              )}

            </div>

            {/* RESTAURANT NAME */}
            <h1
              className="
                break-words
                font-display
                text-xl
                font-black
                leading-tight
                text-white
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
              "
            >
              {selectedRestaurant.name}
            </h1>

            {/* TAGLINE */}
            <p
              className="
                mt-1
                line-clamp-2
                text-[11px]
                leading-relaxed
                text-stone-400
                sm:text-xs
                md:text-sm
              "
            >
              {selectedRestaurant.tagline}
            </p>

            {/* CUISINES */}
            <p
              className="
                mt-1.5
                line-clamp-2
                text-[10px]
                font-medium
                leading-relaxed
                text-amber-400
                sm:text-xs
              "
            >
              {selectedRestaurant.cuisines.join(' • ')}
            </p>

          </div>
        </div>

        {/* =====================================================
            QUICK METRICS
        ====================================================== */}
        <div
          className="
            grid
            w-full
            grid-cols-3
            gap-2
            border-t
            border-stone-800
            pt-4
            sm:gap-3
            md:gap-4
            lg:flex
            lg:w-auto
            lg:min-w-[390px]
            lg:grid-cols-none
            lg:justify-end
            lg:border-l
            lg:border-t-0
            lg:pl-6
            lg:pt-0
            xl:min-w-[430px]
            xl:pl-8
          "
        >

          {/* RATING */}
          <div className="flex min-w-0 flex-col items-center justify-center lg:items-start">

            <div
              className="
                flex
                w-full
                items-center
                justify-center
                gap-1
                rounded-xl
                border
                border-emerald-500/40
                bg-emerald-950
                px-2
                py-2
                text-emerald-300
                sm:px-3
                lg:w-auto
              "
            >
              <Star className="h-3.5 w-3.5 shrink-0 fill-emerald-400 text-emerald-400 sm:h-4 sm:w-4" />

              <span className="text-xs font-bold sm:text-sm">
                {selectedRestaurant.rating}
              </span>
            </div>

            <div className="mt-1 w-full truncate text-center text-[8px] text-stone-500 sm:text-[10px] lg:text-left">
              {selectedRestaurant.reviewCount}+ ratings
            </div>

          </div>

          {/* DELIVERY TIME */}
          <div className="flex min-w-0 flex-col items-center justify-center lg:items-start">

            <div className="flex items-center gap-1 text-xs font-bold text-stone-200 sm:text-sm">

              <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400 sm:h-4 sm:w-4" />

              <span className="whitespace-nowrap">
                {selectedRestaurant.deliveryTimeMin}–
                {selectedRestaurant.deliveryTimeMax}m
              </span>

            </div>

            <div className="mt-1 truncate text-[8px] text-stone-500 sm:text-[10px]">
              {selectedRestaurant.distanceKm} km away
            </div>

          </div>

          {/* PRICE */}
          <div className="flex min-w-0 flex-col items-center justify-center lg:items-start">

            <div className="truncate text-xs font-bold text-stone-200 sm:text-sm">
              {selectedRestaurant.priceRange}
            </div>

            <div className="mt-1 truncate text-[8px] text-stone-500 sm:text-[10px]">
              Cost for two
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          ACTIVE PROMO BANNERS
      ========================================================== */}
      {(selectedRestaurant.offers || []).length > 0 && (
        <div
          className="
            mt-5
            border-t
            border-stone-800
            pt-5
            sm:mt-6
            sm:pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:flex-wrap
              sm:items-center
            "
          >

            {/* DEAL TITLE */}
            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                text-[10px]
                font-bold
                text-stone-400
                sm:text-xs
              "
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-amber-400" />

              <span>
                Available Deals
              </span>

              <span className="text-stone-600">
                •
              </span>

              <span className="text-stone-500">
                {(selectedRestaurant.offers || []).length}
              </span>
            </div>

            {/* DEAL LIST */}
            <div
              className="
                flex
                min-w-0
                flex-1
                flex-wrap
                gap-2
              "
            >
              {selectedRestaurant.offers.map((deal, idx) => (
                <span
                  key={idx}
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    rounded-xl
                    border
                    border-amber-500/30
                    bg-stone-800
                    px-2.5
                    py-1.5
                    text-[9px]
                    font-semibold
                    leading-tight
                    text-amber-300
                    transition
                    hover:border-amber-400/50
                    hover:bg-stone-700
                    sm:px-3
                    sm:py-1.5
                    sm:text-xs
                  "
                >
                  <span className="break-words">
                    {deal}
                  </span>
                </span>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  </div>
</div>

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between border-b border-stone-800">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-3 text-sm font-bold transition cursor-pointer relative ${
                activeTab === 'menu' ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Menu ({(selectedRestaurant.menuItems || []).length})
              {activeTab === 'menu' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition cursor-pointer relative ${
                activeTab === 'reviews' ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Reviews & Photos ({restaurantReviews.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 text-sm font-bold transition cursor-pointer relative ${
                activeTab === 'about' ? 'text-amber-400' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Kitchen & Hygiene
              {activeTab === 'about' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />
              )}
            </button>
          </div>

          {/* Menu Search Bar */}
          {activeTab === 'menu' && (
            <div className="relative mb-2 hidden sm:block">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes in menu..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="bg-stone-900 border border-stone-800 text-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 w-52"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tab Content: MENU */}
      {activeTab === 'menu' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Sticky Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3 mb-6">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredMenuItems.map((item) => {
              // Cart quantity check
              const cartMatches = cart.filter((c) => c.foodItem.id === item.id);
              const totalQuantityInCart = cartMatches.reduce((acc, c) => acc + c.quantity, 0);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 flex justify-between gap-4 transition shadow-lg relative group"
                >
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-2">
                    {/* Badges */}
                    <div className="flex items-center space-x-2">
                      {/* Veg / Non-veg dot */}
                      <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-stone-900 ${
                        item.diet === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />

                      {item.isBestseller && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wide border border-amber-500/30">
                          Bestseller
                        </span>
                      )}

                      {item.spiceLevel && item.spiceLevel > 1 && (
                        <span className="flex items-center space-x-0.5 text-[10px] text-rose-400 font-bold">
                          <Flame className="w-3 h-3 fill-rose-500" />
                          <span>Spicy</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition leading-snug">
                      {item.name}
                    </h3>

                    <div className="flex items-baseline space-x-2">
                      <span className="font-mono font-extrabold text-base text-white">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="font-mono text-xs text-stone-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.calories && (
                      <span className="inline-block text-[10px] text-stone-500">
                        {item.calories} kcal
                      </span>
                    )}
                  </div>

                  {/* Right Column: Dish Photo & Add / Counter */}
                  <div className="relative w-28 sm:w-32 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-stone-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Add to Cart button or Quantity Counter */}
                    <div className="absolute bottom-2 inset-x-2">
                      {totalQuantityInCart === 0 ? (
                        <button
                          onClick={() => handleItemAdd(item)}
                          className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wide shadow-lg shadow-stone-950/60 transition active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-stone-950 text-white border border-amber-500/50 shadow-lg text-xs font-bold">
                          <button
                            onClick={() => {
                              if (cartMatches[0]) {
                                updateQuantity(cartMatches[0].cartItemId, -1);
                              }
                            }}
                            className="p-1 hover:text-amber-400 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-amber-400">
                            {totalQuantityInCart}
                          </span>
                          <button
                            onClick={() => {
                              if (item.customizations && item.customizations.length > 0) {
                                setSelectedFoodItem(item);
                              } else if (cartMatches[0]) {
                                updateQuantity(cartMatches[0].cartItemId, 1);
                              }
                            }}
                            className="p-1 hover:text-amber-400 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {item.customizations && item.customizations.length > 0 && totalQuantityInCart === 0 && (
                        <span className="block text-[9px] font-semibold text-center text-amber-200 mt-1 drop-shadow">
                          Customizable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-extrabold font-display text-white">
                {selectedRestaurant.rating}
              </div>
              <div>
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <div className="text-xs text-stone-400">Based on {selectedRestaurant.reviewCount} customer reviews</div>
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              98% of diners recommend this kitchen
            </div>
          </div>

          <div className="space-y-4">
            {restaurantReviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      src={rev.userAvatar} 
                      alt={rev.userName} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">{rev.userName}</span>
                      <span className="text-[10px] text-stone-500">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: ABOUT */}
      {activeTab === 'about' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Kitchen Hygiene & Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block mb-1">FSSAI License</span>
                <span className="font-mono text-white font-semibold">11223344000982 (Verified)</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block mb-1">Daily Safety Audit</span>
                <span className="text-emerald-400 font-semibold">Passed Grade A+ (100% Sanitized)</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block mb-1">Kitchen Address</span>
                <span className="text-stone-200 font-medium">{selectedRestaurant.address}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block mb-1">Operating Hours</span>
                <span className="text-stone-200 font-medium">{selectedRestaurant.openingHours}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
