import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { X, MapPin, Navigation, Search, Check, Loader2, Compass, Building2 } from 'lucide-react';

const POPULAR_METROS = [
  { city: 'Bengaluru', area: 'Indiranagar' },
  { city: 'Bengaluru', area: 'Koramangala 4th Block' },
  { city: 'Mumbai', area: 'Bandra West, Linking Rd' },
  { city: 'Mumbai', area: 'Juhu Tara Road' },
  { city: 'Delhi NCR', area: 'Cyber Hub, Gurugram' },
  { city: 'Delhi NCR', area: 'Connaught Place' },
  { city: 'Hyderabad', area: 'Jubilee Hills, Road 36' },
  { city: 'Pune', area: 'Koregaon Park' }
];

export const LocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    currentLocation, 
    setCurrentLocation, 
    detectCurrentLocation,
    isDetectingLocation,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (loc: { city: string; area: string }) => {
    setCurrentLocation(loc);
    setIsLocationModalOpen(false);
    showToast(`Delivery location set to ${loc.area}, ${loc.city}`, 'success');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const parts = searchQuery.split(',').map((p) => p.trim());
    const area = parts[0] || searchQuery;
    const city = parts[1] || currentLocation.city;
    handleSelect({ area, city });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsLocationModalOpen(false)}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-5 sm:p-6 space-y-4 text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Choose Delivery Location
              </h3>
              <p className="text-[11px] text-stone-400">
                Live delivery ETA & restaurant menus adapt to your area
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-detect Button */}
        <button
          onClick={detectCurrentLocation}
          disabled={isDetectingLocation}
          className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2.5 transition cursor-pointer disabled:opacity-60"
        >
          {isDetectingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Detecting Live GPS & Network Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>Use Current Location (GPS Auto-Detect)</span>
            </>
          )}
        </button>

        {/* Search / Custom location input */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type your street, area or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition cursor-pointer"
            >
              Set Location
            </button>
          )}
        </form>

        {/* Quick Metro Chips */}
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-400" />
            Top Dining Hubs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_METROS.map((metro, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(metro)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                  currentLocation.area === metro.area
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-stone-950/70 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'
                }`}
              >
                {metro.area.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhoods List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-52">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            {filteredLocations.length > 0 ? 'All Neighborhoods' : 'No exact match, tap "Set Location" above'}
          </span>

          {filteredLocations.map((loc, idx) => {
            const isCurrent = currentLocation.area === loc.area && currentLocation.city === loc.city;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(loc)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition text-xs ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{loc.area}</span>
                    <span className="text-[10px] text-stone-400">{loc.city}</span>
                  </div>
                </div>

                {isCurrent && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
