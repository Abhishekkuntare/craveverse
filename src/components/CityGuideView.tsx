import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, MapPin, Sparkles, ArrowRight, Flame } from 'lucide-react';

interface CityGuideItem {
  id: string;
  city: string;
  area: string;
  headline: string;
  description: string;
  famousEats: string[];
  image: string;
  vibe: string;
}

const CITY_TRAILS: CityGuideItem[] = [
  {
    id: 'trail-amr-1',
    city: 'Amravati',
    area: 'Parvati Nagar & Rajkamal Chowk',
    headline: 'Fiery Saoji Handi, Famous Amravati Goli Bhel & Tarri Pohe',
    description: 'The culinary heart of Vidarbha. Walk the bustling lanes of Parvati Nagar and Rajkamal to taste slow-simmered Saoji curries, crispy Goli Bhel, and piping hot jalebis dipped in rabdi.',
    famousEats: ['Saoji Chicken Handi', 'Amravati Goli Bhel', 'Tarri Pohe Bowl', 'Puran Poli with Ghee', 'Thick Cold Coffee'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    vibe: 'Spicy Saoji Heritage & Local Street Gems'
  },
  {
    id: 'trail-blr-1',
    city: 'Bengaluru',
    area: '100ft Road & 12th Main, Indiranagar',
    headline: 'Craft Smash Burgers, Artisanal Sourdough & Specialty Roasteries',
    description: 'The energetic dining capital of South India. Walk through leafy avenues lined with woodfired pizzerias, smash burger joints, and third-wave espresso bars.',
    famousEats: ['Double Truffle Smash Burgers', 'Neapolitan Burrata Pizza', 'Cold Brew Tonics', 'Avocado Toast'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    vibe: 'Hipster, Trendy & Late Night'
  },
  {
    id: 'trail-blr-2',
    city: 'Bengaluru',
    area: 'VV Puram Food Street (Thindi Beedi)',
    headline: 'Legendary Street Food Trail & Hot Crispy Dosas',
    description: 'Bangalore’s most celebrated street food strip. Pure vegetarian street heaven sizzling with butter floating over crisp dosas, paddus, and hot jalebis.',
    famousEats: ['Benne Dosa', 'Akki Roti with Chutney', 'Gulkand Ice Cream', 'Hot Ghee Paddus'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    vibe: 'Traditional, Heritage & Street Sizzles'
  },
  {
    id: 'trail-bom-1',
    city: 'Mumbai',
    area: 'Bandra West (Pali Hill & Carter Road)',
    headline: 'Global Cafes, Seaside Gelato & Bollywood Hangouts',
    description: 'Sea breeze meets bohemian food culture. From vintage Irani cafes to Japanese ramen joints and gluten-free bakeries.',
    famousEats: ['Mutton Berry Pulao', 'Smoked Salmon Bagels', 'Sea Salt Gelato', 'Khow Suey'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    vibe: 'Celebrity Vibe & Coastal Chic'
  },
  {
    id: 'trail-del-1',
    city: 'Delhi NCR',
    area: 'Old Delhi & Cyber Hub',
    headline: 'Centuries-Old Mughal Kebabs & Modern High-Energy Diners',
    description: 'Where charcoal-fired seekh kebabs meet modern progressive Indian gastronomy. Fragrant spices, slow-cooked nihari, and decadent rabri falooda.',
    famousEats: ['Galouti Kebabs', 'Dum Biryani', 'Daulat Ki Chaat', 'Butter Chicken Naan Bombs'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    vibe: 'Royal, Rich & Historic'
  }
];

export const CityGuideView: React.FC = () => {
  const { setCurrentLocation, setCurrentView, showToast } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const filteredTrails = CITY_TRAILS.filter((t) => {
    if (selectedCity === 'All') return true;
    return t.city.toLowerCase() === selectedCity.toLowerCase();
  });

  const handleExploreTrail = (trail: CityGuideItem) => {
    setCurrentLocation({ city: trail.city, area: trail.area });
    showToast(`Location set to ${trail.area}! Discovering nearby master kitchens.`, 'success');
    setCurrentView('restaurants');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>CULINARY EXPEDITIONS</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Editorial City Food Guides
          </h1>
          <p className="text-stone-400 text-sm">
            Curated street trails, historic heritage bistros, and iconic neighborhood secrets worth traveling for.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Amravati', 'Bengaluru', 'Mumbai', 'Delhi NCR'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCity === city
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Trails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrails.map((trail) => (
            <div
              key={trail.id}
              className="rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="relative h-60 w-full overflow-hidden bg-stone-800">
                <img
                  src={trail.image}
                  alt={trail.headline}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-400 text-xs font-bold border border-stone-700">
                  {trail.city} • {trail.vibe}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-stone-400 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{trail.area}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {trail.headline}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {trail.description}
                  </p>
                </div>

                {/* Famous eats tags */}
                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Signature Must-Try Bites:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trail.famousEats.map((eat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-stone-950 text-amber-300 text-xs font-semibold border border-stone-800"
                      >
                        {eat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleExploreTrail(trail)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <span>Explore Kitchens in {trail.area}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
