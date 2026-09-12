import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

interface CategoryCard {
  id: string;
  name: string;
  emoji: string;
  image: string;
  count: string;
  cuisineFilter: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'cat-burgers',
    name: 'Gourmet Burgers',
    emoji: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    count: '24 Spots',
    cuisineFilter: 'Burgers'
  },
  {
    id: 'cat-pizza',
    name: 'Woodfired Pizza',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    count: '32 Spots',
    cuisineFilter: 'Pizza'
  },
  {
    id: 'cat-momos',
    name: 'Tibetan Momos',
    emoji: '🥟',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=400&q=80',
    count: '19 Spots',
    cuisineFilter: 'Momos'
  },
  {
    id: 'cat-biryani',
    name: 'Dum Biryani',
    emoji: '🍛',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    count: '28 Spots',
    cuisineFilter: 'Biryani'
  },
  {
    id: 'cat-asian',
    name: 'Asian & Ramen',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    count: '16 Spots',
    cuisineFilter: 'Asian & Ramen'
  },
  {
    id: 'cat-healthy',
    name: 'Bowls & Greens',
    emoji: '🥗',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    count: '21 Spots',
    cuisineFilter: 'Healthy & Bowls'
  },
  {
    id: 'cat-desserts',
    name: 'Desserts & Gelato',
    emoji: '🍰',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    count: '30 Spots',
    cuisineFilter: 'Desserts & Gelato'
  },
  {
    id: 'cat-street',
    name: 'Street Chaat & Snacks',
    emoji: '🍟',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    count: '27 Spots',
    cuisineFilter: 'Street Food'
  }
];

export const CategoryUniverse: React.FC = () => {
  const { selectedCuisine, setSelectedCuisine, setCurrentView } = useApp();

  const handleSelectCategory = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setCurrentView('restaurants');
  };

  return (
    <section className="py-12 bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs uppercase font-bold tracking-widest text-amber-400 mb-1">
              <span>EXPLORE BY CUISINE</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              The Food Category Universe
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCuisine('All'); setCurrentView('restaurants'); }}
            className="mt-2 sm:mt-0 inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCuisine === cat.cuisineFilter;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.cuisineFilter)}
                className={`group text-left p-2.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-stone-950/70 border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/60'
                }`}
              >
                {/* Circular Food Image with Zoom on hover */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 relative bg-stone-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-115 transition duration-500"
                  />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-stone-900/90 text-[10px] font-bold text-amber-300">
                    {cat.emoji}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-white group-hover:text-amber-400 transition leading-tight truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
