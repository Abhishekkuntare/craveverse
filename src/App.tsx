import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FoodStoriesBar } from './components/FoodStoriesBar';
import { FoodStoriesModal } from './components/FoodStoriesModal';
import { FoodMoodSelector } from './components/FoodMoodSelector';
import { CategoryUniverse } from './components/CategoryUniverse';
import { RestaurantListView } from './components/RestaurantListView';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { FoodItemModal } from './components/FoodItemModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { DeliveryTrackingView } from './components/DeliveryTrackingView';
import { FoodDiscoveryFeed } from './components/FoodDiscoveryFeed';
import { CollectionsView } from './components/CollectionsView';
import { OffersView } from './components/OffersView';
import { AiFoodAssistant } from './components/AiFoodAssistant';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { DeliveryPartnerDashboard } from './components/DeliveryPartnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerAccountView } from './components/CustomerAccountView';
import { CityGuideView } from './components/CityGuideView';
import { LocationModal } from './components/LocationModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { ToastContainer } from './components/ToastContainer';
import { DeliveryRiderAnimation } from './components/DeliveryRiderAnimation';
import { Footer } from './components/Footer';
import { RestaurantCard } from './components/RestaurantCard';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, activeRole, restaurantList } = useApp();

  // GSAP Entrance subtle animations on route transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    gsap.fromTo(
      '#main-content-view',
      { opacity: 0.85, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [currentView, activeRole]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 pb-24 lg:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content-view" className="flex-1">
        {/* Role: Kitchen Partner Hub */}
        {activeRole === 'restaurant' && <RestaurantDashboard />}

        {/* Role: Delivery Partner Fleet */}
        {activeRole === 'delivery' && <DeliveryPartnerDashboard />}

        {/* Role: Superadmin Command */}
        {activeRole === 'admin' && <AdminDashboard />}

        {/* Role: Customer App Views */}
        {activeRole === 'customer' && (
          <>
            {currentView === 'home' && (
              <>
                <HeroSection />
                <FoodStoriesBar />
                <FoodMoodSelector />
                <CategoryUniverse />

                {/* Editorial Curated Section: Top Trending Spots */}
                <section className="py-14 bg-stone-950 border-b border-stone-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <Flame className="w-3.5 h-3.5" />
                          <span>THE CULINARY HONORS LIST</span>
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
                          Trending Hotspots in Your City
                        </h2>
                        <p className="text-stone-400 text-xs sm:text-sm mt-1">
                          Consistently rated 4.7+ for texture, temperature on delivery, and uncompromising taste.
                        </p>
                      </div>

                      <button
                        onClick={() => setCurrentView('restaurants')}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                      >
                        <span>View all {restaurantList.length} restaurants</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {restaurantList.slice(0, 6).map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {currentView === 'restaurants' && <RestaurantListView />}
            {currentView === 'restaurant-detail' && <RestaurantDetailView />}
            {currentView === 'food-discovery-feed' && <FoodDiscoveryFeed />}
            {currentView === 'collections' && <CollectionsView />}
            {currentView === 'offers' && <OffersView />}
            {currentView === 'checkout' && <CheckoutView />}
            {currentView === 'tracking' && <DeliveryTrackingView />}
            {currentView === 'account' && <CustomerAccountView />}
            {currentView === 'city-guide' && <CityGuideView />}
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <FoodStoriesModal />
      <FoodItemModal />
      <CartDrawer />
      <AiFoodAssistant />
      <LocationModal />
      <UniversalSearchModal />
      <ToastContainer />

      {/* Continuous Delivery Boy Bicycle Character Animation Across Entire Website */}
      <DeliveryRiderAnimation />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
