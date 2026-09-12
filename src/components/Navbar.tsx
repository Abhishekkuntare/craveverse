import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  Sparkles,
  Flame,
  Compass,
  Store,
  Tag,
  Bookmark,
  ChevronDown,
  Bike,
  LayoutDashboard,
  Bot,
  Menu,
  X,
  Home,
  RefreshCw,
  Navigation,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeRole,
    setActiveRole,
    currentLocation,
    setIsLocationModalOpen,
    setIsUniversalSearchOpen,
    cartTotals,
    setIsCartDrawerOpen,
    isFoodPlusMember,
    setIsAiAssistantOpen,
    activeOrder,
    rewardPoints,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (view: any, role: any = 'customer') => {
    setActiveRole(role);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsRoleDropdownOpen(false);
  };

  const roleLabel =
    activeRole === 'customer'
      ? 'Customer'
      : activeRole === 'restaurant'
        ? 'Kitchen Hub'
        : activeRole === 'delivery'
          ? 'Fleet'
          : 'Admin';

  const isActive = (view: string) => currentView === view;

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/95 text-stone-100 backdrop-blur-xl">

        {/* =======================================================
            TOP MICRO BAR
        ======================================================== */}
        <div className="border-b border-stone-800/70">
          <div className="mx-auto flex h-8 w-full max-w-[1600px] items-center justify-between px-3 sm:h-9 sm:px-5 lg:px-6 2xl:px-8">

            {/* LOCATION + DELIVERY */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">

              <button
                id="location-picker-btn"
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex min-w-0 max-w-[210px] items-center gap-1.5 text-stone-300 transition hover:text-amber-400 sm:max-w-[280px]"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />

                <span className="truncate text-[10px] font-semibold sm:text-[11px] lg:text-xs">
                  {currentLocation.area}
                </span>

                <span className="hidden truncate text-[10px] text-stone-500 md:inline">
                  ({currentLocation.city})
                </span>

                <ChevronDown className="h-3 w-3 shrink-0 text-stone-500" />
              </button>

              <span className="hidden h-4 w-px bg-stone-800 md:block" />

              <div className="hidden items-center gap-1.5 text-[10px] text-emerald-400 md:flex lg:text-[11px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="whitespace-nowrap">
                  Express Delivery: 22–32 min
                </span>
              </div>
            </div>

            {/* RIGHT MICRO BAR */}
            <div className="flex shrink-0 items-center gap-2">

              {/* LIVE ORDER */}
              {activeOrder && activeOrder.status !== 'DELIVERED' && (
                <button
                  type="button"
                  onClick={() => setCurrentView('tracking')}
                  className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-300 transition hover:bg-amber-500/20 sm:text-[10px]"
                >
                  <Bike className="h-3 w-3 shrink-0 text-amber-400" />

                  <span className="hidden sm:inline">
                    Live Order #{activeOrder.id.slice(-4)}
                  </span>

                  <span className="sm:hidden">
                    #{activeOrder.id.slice(-4)}
                  </span>
                </button>
              )}

              {/* ROLE SWITCHER */}
              <div className="relative">

                <button
                  id="role-switcher-btn"
                  type="button"
                  aria-expanded={isRoleDropdownOpen}
                  onClick={() =>
                    setIsRoleDropdownOpen(!isRoleDropdownOpen)
                  }
                  className="flex items-center gap-1 rounded-md bg-stone-900 px-2 py-1 text-[9px] text-stone-300 transition hover:bg-stone-800 sm:px-2.5 sm:text-[10px]"
                >
                  <span className="hidden text-stone-500 sm:inline">
                    Portal:
                  </span>

                  <span className="font-bold text-amber-400">
                    {roleLabel}
                  </span>

                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      isRoleDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isRoleDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <button
                      type="button"
                      aria-label="Close portal menu"
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-[260px] overflow-hidden rounded-2xl border border-stone-700 bg-stone-900 shadow-2xl shadow-black/50">

                      <div className="border-b border-stone-800 px-4 py-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-500">
                          Switch Ecosystem View
                        </p>
                      </div>

                      {/* CUSTOMER */}
                      <button
                        type="button"
                        onClick={() =>
                          navigateTo('home', 'customer')
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-800"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                          <ShoppingBag className="h-4 w-4 text-amber-400" />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white">
                            Customer App
                          </div>
                          <div className="mt-0.5 text-[10px] text-stone-500">
                            Food discovery & ordering
                          </div>
                        </div>
                      </button>

                      {/* RESTAURANT */}
                      <button
                        type="button"
                        onClick={() =>
                          navigateTo(
                            'restaurant-dashboard',
                            'restaurant'
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-800"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                          <Store className="h-4 w-4 text-orange-400" />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white">
                            Kitchen Hub
                          </div>
                          <div className="mt-0.5 text-[10px] text-stone-500">
                            Orders, menu & AI supply chain
                          </div>
                        </div>
                      </button>

                      {/* DELIVERY */}
                      <button
                        type="button"
                        onClick={() =>
                          navigateTo(
                            'delivery-dashboard',
                            'delivery'
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-800"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                          <Bike className="h-4 w-4 text-emerald-400" />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white">
                            Rider Fleet
                          </div>
                          <div className="mt-0.5 text-[10px] text-stone-500">
                            Live navigation & earnings
                          </div>
                        </div>
                      </button>

                      {/* ADMIN */}
                      <button
                        type="button"
                        onClick={() =>
                          navigateTo(
                            'admin-dashboard',
                            'admin'
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-800"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                          <LayoutDashboard className="h-4 w-4 text-purple-400" />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white">
                            Admin Command
                          </div>
                          <div className="mt-0.5 text-[10px] text-stone-500">
                            Analytics, GMV & Platform
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            MAIN NAVBAR
        ======================================================== */}
        <div className="mx-auto flex h-[60px] w-full max-w-[1600px] items-center gap-2 px-3 sm:h-[64px] sm:px-5 lg:gap-3 lg:px-6 2xl:h-[68px] 2xl:px-8">

          {/* =====================================================
              LOGO
          ====================================================== */}
          <button
            id="brand-logo-btn"
            type="button"
            onClick={() => navigateTo('home', 'customer')}
            className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 shadow-lg shadow-orange-500/20 transition duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
              <Flame className="h-5 w-5 text-white sm:h-5.5 sm:w-5.5" />
            </div>

            <div className="hidden min-[400px]:block">
              <span className="flex items-center text-[17px] font-black tracking-tight text-white sm:text-[19px] 2xl:text-xl">
                CRAVE
                <span className="text-amber-400">VERSE</span>
              </span>

              <span className="hidden text-[8px] font-medium uppercase tracking-[0.18em] text-stone-500 min-[500px]:block sm:text-[9px]">
                Digital Food Universe
              </span>
            </div>
          </button>

          {/* =====================================================
              DESKTOP NAV
              >= 1280px
          ====================================================== */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex 2xl:gap-1">

            {/* DISCOVER */}
            <button
              type="button"
              onClick={() => navigateTo('home', 'customer')}
              className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('home') && activeRole === 'customer'
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-white'
              }`}
            >
              Discover
            </button>

            {/* RESTAURANTS */}
            <button
              type="button"
              onClick={() =>
                navigateTo('restaurants', 'customer')
              }
              className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('restaurants')
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-white'
              }`}
            >
              Restaurants
            </button>

            {/* FOOD REELS */}
            <button
              type="button"
              onClick={() =>
                navigateTo(
                  'food-discovery-feed',
                  'customer'
                )
              }
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('food-discovery-feed')
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-rose-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              <span>Food Reels</span>
            </button>

            {/* COLLECTIONS */}
            <button
              type="button"
              onClick={() =>
                navigateTo('collections', 'customer')
              }
              className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('collections')
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-white'
              }`}
            >
              Collections
            </button>

            {/* OFFERS */}
            <button
              type="button"
              onClick={() =>
                navigateTo('offers', 'customer')
              }
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('offers')
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-amber-300'
              }`}
            >
              <Tag className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span>Offers</span>
            </button>

            {/* CITY GUIDE */}
            <button
              type="button"
              onClick={() =>
                navigateTo('city-guide', 'customer')
              }
              className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition 2xl:px-3 2xl:text-sm ${
                isActive('city-guide')
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-400 hover:bg-stone-800/70 hover:text-white'
              }`}
            >
              City Guide
            </button>
          </nav>

          {/* =====================================================
              RIGHT ACTIONS
          ====================================================== */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-2.5">

            {/* SEARCH */}
            <button
              id="omni-search-btn"
              type="button"
              onClick={() =>
                setIsUniversalSearchOpen(true)
              }
              title="Search dishes, restaurants, cuisines"
              className="flex h-9 items-center gap-2 rounded-xl border border-stone-700/80 bg-stone-900/80 px-2.5 text-stone-400 transition hover:border-stone-600 hover:bg-stone-800 hover:text-white sm:h-10 sm:px-3 xl:w-[150px] 2xl:w-[190px]"
            >
              <Search className="h-4 w-4 shrink-0" />

              <span className="hidden truncate text-xs xl:block">
                Search food...
              </span>

              <kbd className="ml-auto hidden rounded border border-stone-700 bg-stone-950 px-1.5 py-0.5 font-mono text-[9px] text-stone-500 2xl:inline-block">
                ⌘K
              </kbd>
            </button>

            {/* AI CONCIERGE */}
            <button
              id="ai-food-assistant-nav-btn"
              type="button"
              onClick={() =>
                setIsAiAssistantOpen(true)
              }
              title="AI Gourmet Sommelier & Food Assistant"
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-600/20 to-amber-600/20 px-2.5 text-purple-200 shadow-lg shadow-purple-900/10 transition hover:border-purple-400 hover:text-white sm:h-10 sm:px-3"
            >
              <Bot className="h-4 w-4 shrink-0 text-purple-400" />

              <span className="hidden text-xs font-semibold 2xl:inline">
                AI Concierge
              </span>
            </button>

            {/* CART */}
            <button
              id="cart-drawer-trigger-btn"
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-2.5 text-xs font-black text-stone-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-[0.97] sm:h-10 sm:gap-2 sm:px-3.5 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />

              <span className="hidden sm:inline">
                Cart
              </span>

              {cartTotals.itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-950 px-1 text-[9px] font-black text-amber-400 sm:text-[10px]">
                  {cartTotals.itemCount}
                </span>
              )}

              {cartTotals.grandTotal > 0 && (
                <span className="hidden border-l border-amber-600/40 pl-2 font-mono text-[10px] font-black lg:inline">
                  ₹{cartTotals.grandTotal}
                </span>
              )}
            </button>

            {/* PROFILE */}
            <button
              id="customer-account-btn"
              type="button"
              onClick={() =>
                navigateTo('account', 'customer')
              }
              title="My Account"
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border transition sm:flex ${
                isActive('account')
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                  : 'border-stone-700/80 bg-stone-900/80 text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
            </button>

            {/* =================================================
                HAMBURGER
                visible below XL
            ================================================== */}
            <button
              id="mobile-hamburger-btn"
              type="button"
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isMobileMenuOpen}
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-700 bg-stone-900 text-stone-300 transition hover:bg-stone-800 hover:text-white xl:hidden sm:h-10 sm:w-10"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* =======================================================
            MOBILE / TABLET MENU
        ======================================================== */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-stone-800 bg-stone-950/98 shadow-2xl backdrop-blur-2xl">

            {/* PROFILE HEADER */}
            <div className="border-b border-stone-800 bg-stone-900/60 px-4 py-4 sm:px-6">

              <div className="flex items-center justify-between gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigateTo('account', 'customer')
                  }
                  className="flex min-w-0 items-center gap-3 text-left"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 shrink-0 rounded-xl border-2 border-amber-400 object-cover"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-white">
                        Priya Sharma
                      </span>

                      {isFoodPlusMember && (
                        <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-black text-stone-950">
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 truncate text-[10px] font-mono text-amber-400">
                      {rewardPoints} CravePoints
                    </div>
                  </div>
                </button>

                {/* AI */}
                <button
                  type="button"
                  onClick={() =>
                    setIsAiAssistantOpen(true)
                  }
                  className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-bold text-purple-300 transition hover:bg-purple-500/20"
                >
                  <Bot className="h-4 w-4" />
                  <span>AI</span>
                </button>
              </div>
            </div>

            {/* =================================================
                MOBILE NAV GRID
            ================================================== */}
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4">

              {/* DISCOVER */}
              <button
                type="button"
                onClick={() =>
                  navigateTo('home', 'customer')
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('home') &&
                  activeRole === 'customer'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Home className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Discover</span>
              </button>

              {/* RESTAURANTS */}
              <button
                type="button"
                onClick={() =>
                  navigateTo('restaurants', 'customer')
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('restaurants')
                    ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Store className="h-4 w-4 shrink-0 text-orange-400" />
                <span>Restaurants</span>
              </button>

              {/* FOOD REELS */}
              <button
                type="button"
                onClick={() =>
                  navigateTo(
                    'food-discovery-feed',
                    'customer'
                  )
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('food-discovery-feed')
                    ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Sparkles className="h-4 w-4 shrink-0 text-rose-400" />
                <span>Food Reels</span>
              </button>

              {/* COLLECTIONS */}
              <button
                type="button"
                onClick={() =>
                  navigateTo('collections', 'customer')
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('collections')
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Bookmark className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Collections</span>
              </button>

              {/* OFFERS */}
              <button
                type="button"
                onClick={() =>
                  navigateTo('offers', 'customer')
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('offers')
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Tag className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Offers & Deals</span>
              </button>

              {/* CITY GUIDE */}
              <button
                type="button"
                onClick={() =>
                  navigateTo('city-guide', 'customer')
                }
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-xs font-bold transition ${
                  isActive('city-guide')
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Compass className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>City Guide</span>
              </button>
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================== */}
            <div className="grid grid-cols-2 gap-2 border-t border-stone-800 bg-stone-950/60 p-3 sm:p-4">

              <button
                type="button"
                onClick={() =>
                  navigateTo('account', 'customer')
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-3 py-2.5 text-[10px] font-semibold text-stone-300 transition hover:bg-stone-800 sm:text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                <span>Past Orders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLocationModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-3 py-2.5 text-[10px] font-semibold text-stone-300 transition hover:bg-stone-800 sm:text-xs"
              >
                <Navigation className="h-3.5 w-3.5 text-amber-400" />
                <span>Change Location</span>
              </button>
            </div>

            {/* =================================================
                ECOSYSTEM PORTALS
            ================================================== */}
            <div className="border-t border-stone-800 bg-stone-950/80 p-3 sm:p-4">

              <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-stone-500">
                Ecosystem Portals
              </div>

              <div className="grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'restaurant-dashboard',
                      'restaurant'
                    )
                  }
                  className="rounded-xl border border-stone-800 bg-stone-900 px-2 py-2.5 text-[10px] font-bold text-orange-400 transition hover:bg-stone-800 sm:text-xs"
                >
                  Kitchen POS
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'delivery-dashboard',
                      'delivery'
                    )
                  }
                  className="rounded-xl border border-stone-800 bg-stone-900 px-2 py-2.5 text-[10px] font-bold text-emerald-400 transition hover:bg-stone-800 sm:text-xs"
                >
                  Rider Fleet
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'admin-dashboard',
                      'admin'
                    )
                  }
                  className="rounded-xl border border-stone-800 bg-stone-900 px-2 py-2.5 text-[10px] font-bold text-purple-400 transition hover:bg-stone-800 sm:text-xs"
                >
                  Admin Hub
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          MOBILE BOTTOM NAV
          <= 1023px
      ========================================================== */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-stone-800/80 bg-stone-950/95 px-1.5 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 shadow-2xl backdrop-blur-xl lg:hidden"
      >

        {/* DISCOVER */}
        <button
          type="button"
          onClick={() =>
            navigateTo('home', 'customer')
          }
          className={`flex min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition ${
            isActive('home') &&
            activeRole === 'customer'
              ? 'text-amber-400'
              : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <Home className="h-5 w-5" />

          <span className="mt-0.5 text-[9px] font-semibold">
            Discover
          </span>
        </button>

        {/* DINING */}
        <button
          type="button"
          onClick={() =>
            navigateTo('restaurants', 'customer')
          }
          className={`flex min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition ${
            isActive('restaurants')
              ? 'text-amber-400'
              : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <Store className="h-5 w-5" />

          <span className="mt-0.5 text-[9px] font-semibold">
            Dining
          </span>
        </button>

        {/* REELS */}
        <button
          type="button"
          onClick={() =>
            navigateTo(
              'food-discovery-feed',
              'customer'
            )
          }
          className={`relative flex min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition ${
            isActive('food-discovery-feed')
              ? 'text-rose-400'
              : 'text-stone-500 hover:text-rose-300'
          }`}
        >
          <Sparkles className="h-5 w-5 text-rose-400" />

          <span className="mt-0.5 text-[9px] font-semibold">
            Reels
          </span>

          <span className="absolute right-[28%] top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        {/* OFFERS */}
        <button
          type="button"
          onClick={() =>
            navigateTo('offers', 'customer')
          }
          className={`flex min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition ${
            isActive('offers')
              ? 'text-amber-400'
              : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <Tag className="h-5 w-5" />

          <span className="mt-0.5 text-[9px] font-semibold">
            Offers
          </span>
        </button>

        {/* PROFILE */}
        <button
          type="button"
          onClick={() =>
            navigateTo('account', 'customer')
          }
          className={`flex min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition ${
            isActive('account')
              ? 'text-amber-400'
              : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <User className="h-5 w-5" />

          <span className="mt-0.5 text-[9px] font-semibold">
            Profile
          </span>
        </button>
      </nav>

      {/* =========================================================
          MOBILE BOTTOM NAV SPACING
          Prevent page content from being hidden behind nav
      ========================================================== */}
      {/* <div className="h-[64px] lg:hidden" /> */}
    </>
  );
};