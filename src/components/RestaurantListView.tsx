import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from './RestaurantCard';
import { CUISINES_LIST } from '../data/mockData';
import { Filter, SlidersHorizontal, Sparkles, Check } from 'lucide-react';

export const RestaurantListView: React.FC = () => {
  const { 
    restaurantList, 
    selectedCuisine, 
    setSelectedCuisine, 
    vegOnly, 
    setVegOnly,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'cost'>('rating');
  const [under30Min, setUnder30Min] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);

  // Filter logic
  const filteredRestaurants = React.useMemo(() => {
    return restaurantList.filter((rest) => {
      // Cuisine filter
      if (selectedCuisine !== 'All' && !rest.cuisines.some((c) => c.toLowerCase().includes(selectedCuisine.toLowerCase()))) {
        return false;
      }
      // Veg only: check if restaurant has at least one veg item or all veg
      if (vegOnly && !rest.menuItems.some((m) => m.diet === 'veg' || m.diet === 'vegan')) {
        return false;
      }
      // Fast delivery filter
      if (under30Min && rest.deliveryTimeMin > 30) {
        return false;
      }
      // Free delivery
      if (freeDeliveryOnly && rest.deliveryFee > 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(q);
        const matchesCuisine = rest.cuisines.some((c) => c.toLowerCase().includes(q));
        const matchesDish = rest.menuItems.some((m) => m.name.toLowerCase().includes(q));
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (sortBy === 'cost') return a.priceRange.length - b.priceRange.length;
      return 0;
    });
  }, [restaurantList, selectedCuisine, vegOnly, under30Min, freeDeliveryOnly, searchQuery, sortBy]);

  return (
    <div className="py-8 bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Curated Kitchens & Food Hubs
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Showing {filteredRestaurants.length} exceptional restaurants delivering to your neighborhood
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-900 text-stone-200 border border-stone-700 rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="rating">Top Rated (4.7+)</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="cost">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 mb-8 space-y-3">
          {/* Cuisines horizontal scroller */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {CUISINES_LIST.map((cuisine) => {
              const isSelected = selectedCuisine === cuisine;
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {cuisine}
                </button>
              );
            })}
          </div>

          {/* Secondary Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/80 text-xs">
            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-emerald-400' : 'bg-stone-500'}`} />
              <span>Pure Veg Only</span>
            </button>

            {/* Under 30 mins */}
            <button
              onClick={() => setUnder30Min(!under30Min)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                under30Min
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>⚡ Under 30 mins</span>
            </button>

            {/* Free Delivery */}
            <button
              onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                freeDeliveryOnly
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>🛵 Free Delivery</span>
            </button>

            {/* Reset Filter if active */}
            {(selectedCuisine !== 'All' || vegOnly || under30Min || freeDeliveryOnly || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCuisine('All');
                  setVegOnly(false);
                  setUnder30Min(false);
                  setFreeDeliveryOnly(false);
                  setSearchQuery('');
                }}
                className="text-xs text-rose-400 hover:underline font-semibold ml-auto cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-stone-900 border border-stone-800 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-display font-bold text-xl text-white">No Restaurants Found</h3>
            <p className="text-stone-400 text-xs mt-1">
              Try changing your cuisine selection, removing the veg filter, or searching for other dishes.
            </p>
            <button
              onClick={() => {
                setSelectedCuisine('All');
                setVegOnly(false);
                setUnder30Min(false);
                setFreeDeliveryOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
