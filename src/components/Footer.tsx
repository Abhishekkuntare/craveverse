import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Heart, ShieldCheck, Bike, Store, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setActiveRole, setSelectedCuisine } = useApp();

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 flex items-center justify-center text-white shadow-lg">
                <Flame className="w-6 h-6" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                CRAVE<span className="text-amber-400">VERSE</span>
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              The next-generation digital food universe. Bringing together master artisanal kitchens, woodfired pizzerias, hidden alley vendors, and late-night cravings with zero-delay express delivery.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Biodegradable Thermal Hot-Lock Packaging</span>
            </div>
          </div>

          {/* Col 2: Discover Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Flavors
            </h4>
            <ul className="space-y-2">
              {['Burgers', 'Pizza', 'Momos', 'Biryani', 'Asian & Ramen', 'Desserts & Gelato'].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      setSelectedCuisine(c);
                      setActiveRole('customer');
                      setCurrentView('restaurants');
                    }}
                    className="hover:text-amber-400 transition cursor-pointer"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Discovery & Guides */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Food Universe
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveRole('customer'); setCurrentView('food-discovery-feed'); }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Kitchen Reels & Sizzles
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('customer'); setCurrentView('collections'); }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Editorial Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('customer'); setCurrentView('offers'); }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Offers & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('customer'); setCurrentView('city-guide'); }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  City Food Trails
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Business */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Ecosystem
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveRole('restaurant'); setCurrentView('restaurant-dashboard'); }}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1 text-white font-medium"
                >
                  <Store className="w-3.5 h-3.5 text-orange-400" />
                  <span>Kitchen Partner Hub</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('delivery'); setCurrentView('delivery-dashboard'); }}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1 text-white font-medium"
                >
                  <Bike className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rider Partner Fleet</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveRole('admin'); setCurrentView('admin-dashboard'); }}
                  className="hover:text-purple-400 transition cursor-pointer text-stone-400"
                >
                  Superadmin Command
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} CraveVerse Technologies Inc. Crafted with obsessive love for good food.
          </div>

          <div className="flex items-center space-x-4">
            <span>FSSAI License #10020042000192</span>
            <span>•</span>
            <span className="text-stone-400">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
