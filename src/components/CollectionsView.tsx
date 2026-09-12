import React from 'react';
import { useApp } from '../context/AppContext';
import { COLLECTIONS_DATA } from '../data/mockData';
import { Bookmark, Sparkles, ArrowRight, Flame } from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const { setSelectedCuisine, setCurrentView } = useApp();

  const handleOpenCollection = (title: string) => {
    if (title.toLowerCase().includes('burger')) setSelectedCuisine('Burgers');
    else if (title.toLowerCase().includes('pizza')) setSelectedCuisine('Pizza');
    else if (title.toLowerCase().includes('biryani')) setSelectedCuisine('Biryani');
    else if (title.toLowerCase().includes('sweet') || title.toLowerCase().includes('gelato')) setSelectedCuisine('Desserts & Gelato');
    else setSelectedCuisine('All');

    setCurrentView('restaurants');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>EDITORIAL CURATION</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Curated Food Collections
          </h1>
          <p className="text-stone-400 text-sm">
            Hand-tested, chef-reviewed collections designed for your exact culinary mood and celebration.
          </p>
        </div>

        {/* Collections Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS_DATA.map((col) => (
            <div
              key={col.id}
              onClick={() => handleOpenCollection(col.title)}
              className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer h-80"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={col.image}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20" />
              </div>

              {/* Top Tag */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-amber-400 text-xs font-bold">
                  {col.badge || `${col.restaurantCount} Spots`}
                </span>
                <div className="w-8 h-8 rounded-full bg-stone-950/80 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-stone-950 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-5 space-y-1.5">
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-amber-300 transition leading-snug">
                  {col.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {col.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
