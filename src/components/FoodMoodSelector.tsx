import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_MOODS, RESTAURANTS_DATA } from '../data/mockData';
import { Sparkles, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

export const FoodMoodSelector: React.FC = () => {
  const { 
    setSelectedRestaurant, 
    setCurrentView, 
    addToCart, 
    favorites, 
    toggleFavoriteDish 
  } = useApp();

  const [activeMoodId, setActiveMoodId] = useState<string>('spicy');

  const selectedMood = FOOD_MOODS.find((m) => m.id === activeMoodId) || FOOD_MOODS[0];

  // Filter recommended dishes matching this mood
  const matchedDishes = React.useMemo(() => {
    const allDishes = RESTAURANTS_DATA.flatMap((r) =>
      r.menuItems.map((item) => ({ ...item, restaurant: r }))
    );

    if (activeMoodId === 'spicy') {
      return allDishes.filter((d) => (d.spiceLevel || 0) >= 2).slice(0, 4);
    } else if (activeMoodId === 'sweet') {
      return allDishes.filter((d) => d.category.toLowerCase().includes('dessert') || d.category.toLowerCase().includes('shake') || d.category.toLowerCase().includes('gelato')).slice(0, 4);
    } else if (activeMoodId === 'savory') {
      return allDishes.filter((d) => d.category.toLowerCase().includes('smash') || d.category.toLowerCase().includes('chicken')).slice(0, 4);
    } else if (activeMoodId === 'healthy') {
      return allDishes.filter((d) => d.category.toLowerCase().includes('bowl') || d.diet === 'vegan').slice(0, 4);
    } else if (activeMoodId === 'crunchy') {
      return allDishes.filter((d) => d.category.toLowerCase().includes('fries') || d.category.toLowerCase().includes('chaat') || d.category.toLowerCase().includes('kothey')).slice(0, 4);
    } else if (activeMoodId === 'comfort') {
      return allDishes.filter((d) => d.category.toLowerCase().includes('biryani') || d.category.toLowerCase().includes('ramen')).slice(0, 4);
    } else {
      return allDishes.slice(0, 4);
    }
  }, [activeMoodId]);

  return (
    <section className="py-12 bg-stone-950 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIGNATURE CRAVING ENGINE</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              What Are You Craving Right Now?
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Select your flavor frequency and let our algorithmic culinary palate match your mood.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold">
            <span>Current Mood:</span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-white border border-stone-700">
              {selectedMood.emoji} {selectedMood.label}
            </span>
          </div>
        </div>

        {/* Interactive Mood Pill Selector */}
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar pb-3">
          {FOOD_MOODS.map((mood) => {
            const isSelected = activeMoodId === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMoodId(mood.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                <span className="text-base">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Matched Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {matchedDishes.map((dish) => {
            const isFav = favorites.dishes.includes(dish.id);
            return (
              <div
                key={dish.id}
                className="group rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 p-3.5 flex flex-col justify-between transition-all duration-300 shadow-lg relative"
              >
                {/* Image */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-stone-800">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/90 text-[10px] font-bold text-amber-300 border border-stone-700">
                    ★ {dish.rating}
                  </div>

                  <button
                    onClick={() => toggleFavoriteDish(dish.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-stone-300 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${dish.diet === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-900/90 text-stone-300">
                      {dish.diet.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div 
                    onClick={() => {
                      setSelectedRestaurant(dish.restaurant);
                      setCurrentView('restaurant-detail');
                    }}
                    className="text-[11px] text-amber-400 font-semibold cursor-pointer hover:underline truncate"
                  >
                    {dish.restaurant.name}
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 group-hover:text-amber-300 transition">
                    {dish.name}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Footer Price & Add Button */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-mono font-extrabold text-base text-white">
                      ₹{dish.price}
                    </span>
                    {dish.originalPrice && (
                      <span className="font-mono text-xs text-stone-500 line-through">
                        ₹{dish.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(dish)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1 shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
