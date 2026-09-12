import React from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant } from '../types';
import { Star, Clock, MapPin, Heart, Tag, ArrowUpRight } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { 
    setSelectedRestaurant, 
    setCurrentView, 
    favorites, 
    toggleFavoriteRestaurant 
  } = useApp();

  const isFavorite = favorites.restaurants.includes(restaurant.id);

  const handleClick = () => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-detail');
  };

  return (
    <div 
      onClick={handleClick}
      className="group rounded-3xl overflow-hidden bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-800">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-rose-500 transition cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Offers Pill */}
        {(restaurant.offers || []).length > 0 && (
          <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-black uppercase tracking-wide shadow-md">
            <Tag className="w-3 h-3" />
            <span>{restaurant.offers[0]}</span>
          </div>
        )}

        {/* ETA & Distance Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-stone-950/90 backdrop-blur-md text-white border border-stone-800">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="font-semibold">{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300">{restaurant.distanceKm} km</span>
          </div>

          <div className="px-2 py-1 rounded-xl bg-stone-950/90 backdrop-blur-md text-emerald-400 font-bold border border-stone-800 text-[11px]">
            {restaurant.deliveryFee === 0 ? 'FREE DELIVERY' : `₹${restaurant.deliveryFee} Delivery`}
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition leading-tight">
              {restaurant.name}
            </h3>
            <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
              {restaurant.cuisines.join(' • ')}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0">
            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            <span>{restaurant.rating}</span>
            <span className="text-emerald-500 text-[10px]">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* Area & Price Range */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-stone-500" />
            <span className="truncate max-w-[140px]">{restaurant.area}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-stone-300 font-semibold">{restaurant.priceRange} for two</span>
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};
