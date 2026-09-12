import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_STORIES, RESTAURANTS_DATA } from '../data/mockData';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';

export const FoodStoriesModal: React.FC = () => {
  const { activeStoryIndex, setActiveStoryIndex, addToCart, setSelectedRestaurant, setCurrentView } = useApp();
  const [progress, setProgress] = useState(0);

  const currentStory = activeStoryIndex !== null ? FOOD_STORIES[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < FOOD_STORIES.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
          } else {
            setActiveStoryIndex(null);
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, setActiveStoryIndex]);

  if (activeStoryIndex === null || !currentStory) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeStoryIndex < FOOD_STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handleOrderStoryDish = (e: React.MouseEvent) => {
    e.stopPropagation();
    const parentRest = RESTAURANTS_DATA.find((r) => r.id === currentStory.restaurantId);
    if (parentRest && currentStory.dishMention) {
      const dish = parentRest.menuItems.find((d) => d.id === currentStory.dishMention?.id);
      if (dish) {
        addToCart(dish);
        setActiveStoryIndex(null);
      } else {
        setSelectedRestaurant(parentRest);
        setCurrentView('restaurant-detail');
        setActiveStoryIndex(null);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={() => setActiveStoryIndex(null)}
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-[80vh] max-h-[720px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Progress Bar */}
        <div className="absolute top-3 inset-x-3 z-30 flex space-x-1.5">
          {FOOD_STORIES.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-stone-700/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-100 ease-linear"
                style={{
                  width: idx === activeStoryIndex ? `${progress}%` : idx < activeStoryIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img 
              src={currentStory.restaurantLogo} 
              alt={currentStory.restaurantName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <span className="font-bold text-white text-sm block leading-tight">
                {currentStory.restaurantName}
              </span>
              <span className="text-[11px] text-amber-300 font-medium">Chef's Live Reel</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveStoryIndex(null)}
            className="p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <img 
            src={currentStory.mediaUrl} 
            alt={currentStory.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/50" />
        </div>

        {/* Navigation tap areas */}
        <button 
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Story Content & Quick Order */}
        <div className="absolute bottom-4 inset-x-4 z-30 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {currentStory.tags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-stone-900/80 border border-stone-700 text-amber-300 text-[10px] font-semibold">
                #{t}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-white leading-snug">
            {currentStory.title}
          </h3>

          {currentStory.dishMention && (
            <div className="p-3 rounded-2xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-md flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Featured Dish
                </span>
                <h4 className="font-bold text-white text-sm">
                  {currentStory.dishMention.name}
                </h4>
                <span className="text-amber-400 font-mono font-bold text-xs">
                  ₹{currentStory.dishMention.price}
                </span>
              </div>

              <button
                onClick={handleOrderStoryDish}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
