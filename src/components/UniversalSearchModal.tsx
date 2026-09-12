import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Store,
  ShoppingBag,
  ArrowRight,
  Flame,
  MapPin,
  Utensils,
  Sparkles,
  Clock,
} from 'lucide-react';

export const UniversalSearchModal: React.FC = () => {
  const {
    isUniversalSearchOpen,
    setIsUniversalSearchOpen,
    restaurantList,
    setSelectedRestaurant,
    setCurrentView,
    addToCart,
  } = useApp();

  const [query, setQuery] = useState('');

  /**
   * Reset search whenever modal closes.
   */
  useEffect(() => {
    if (!isUniversalSearchOpen) {
      setQuery('');
    }
  }, [isUniversalSearchOpen]);

  /**
   * Keyboard shortcuts
   * Ctrl + K / Cmd + K => Open search
   * Escape => Close search
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsUniversalSearchOpen(true);
      }

      if (e.key === 'Escape') {
        setIsUniversalSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsUniversalSearchOpen]);

  /**
   * Normalize text for smarter searching.
   */
  const normalizeText = (text: string = '') => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ');
  };

  /**
   * Smart search:
   *
   * Example:
   * Query: "Double Smash Burger"
   *
   * Matches:
   * - Double Smash Burger
   * - Double Beef Smash
   * - Smash Burger
   * - The Double Umami Smash
   *
   * Even if not every word is present.
   */
  const smartMatch = (searchText: string, searchQuery: string) => {
    const normalizedText = normalizeText(searchText);
    const normalizedQuery = normalizeText(searchQuery);

    if (!normalizedQuery) return false;

    // Full query match
    if (normalizedText.includes(normalizedQuery)) {
      return true;
    }

    const queryWords = normalizedQuery
      .split(' ')
      .filter((word) => word.length > 1);

    if (queryWords.length === 0) {
      return false;
    }

    const matchedWords = queryWords.filter((word) =>
      normalizedText.includes(word)
    );

    /**
     * Single word:
     * burger => must match burger
     *
     * Multiple words:
     * At least one important word should match.
     */
    if (queryWords.length === 1) {
      return matchedWords.length === 1;
    }

    /**
     * Match at least approximately 50% of words.
     *
     * Example:
     * "double smash burger"
     *
     * If "smash" + "burger" match,
     * result should still appear.
     */
    const minimumMatches = Math.max(
      1,
      Math.ceil(queryWords.length * 0.5)
    );

    return matchedWords.length >= minimumMatches;
  };

  /**
   * Search score.
   *
   * Higher score = result appears first.
   */
  const getSearchScore = (
    searchText: string,
    searchQuery: string
  ) => {
    const text = normalizeText(searchText);
    const queryValue = normalizeText(searchQuery);

    if (!queryValue) return 0;

    let score = 0;

    // Exact phrase match gets highest priority
    if (text.includes(queryValue)) {
      score += 100;
    }

    const queryWords = queryValue
      .split(' ')
      .filter((word) => word.length > 1);

    queryWords.forEach((word) => {
      if (text.includes(word)) {
        score += 20;
      }

      // Starts with search word
      if (
        text
          .split(' ')
          .some((textWord) => textWord.startsWith(word))
      ) {
        score += 5;
      }
    });

    return score;
  };

  /**
   * All dish data with parent restaurant.
   */
  const allDishes = useMemo(() => {
    return restaurantList.flatMap((restaurant) =>
      (restaurant.menuItems || []).map((dish) => ({
        ...dish,
        restaurantName: restaurant.name,
        restaurantArea: restaurant.area,
        restaurantCuisines: restaurant.cuisines,
        parentRest: restaurant,
      }))
    );
  }, [restaurantList]);

  /**
   * Restaurant search.
   */
  const matchingRestaurants = useMemo(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) return [];

    return restaurantList
      .map((restaurant) => {
        const searchableContent = [
          restaurant.name,
          restaurant.area,
          ...(restaurant.cuisines || []),
        ]
          .filter(Boolean)
          .join(' ');

        return {
          restaurant,
          searchableContent,
          score: getSearchScore(searchableContent, cleanQuery),
        };
      })
      .filter(({ searchableContent }) =>
        smartMatch(searchableContent, cleanQuery)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ restaurant }) => restaurant);
  }, [query, restaurantList]);

  /**
   * Dish search.
   */
  const matchingDishes = useMemo(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) return [];

    return allDishes
      .map((dish) => {
        const searchableContent = [
          dish.name,
          dish.description,
          dish.restaurantName,
          dish.restaurantArea,
          ...(dish.restaurantCuisines || []),
        ]
          .filter(Boolean)
          .join(' ');

        return {
          dish,
          searchableContent,
          score: getSearchScore(searchableContent, cleanQuery),
        };
      })
      .filter(({ searchableContent }) =>
        smartMatch(searchableContent, cleanQuery)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ dish }) => dish);
  }, [query, allDishes]);

  const hasResults =
    matchingRestaurants.length > 0 ||
    matchingDishes.length > 0;

  const closeSearch = () => {
    setIsUniversalSearchOpen(false);
  };

  const handleRestaurantClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-detail');
    closeSearch();
  };

  const handleDishAdd = (
    dish: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    /**
     * Add dish to cart.
     */
    addToCart(dish);

    closeSearch();
  };

  const trendingSearches = [
    'Burger',
    'Pizza',
    'Momos',
    'Biryani',
    'Ice Cream',
    'Coffee',
    'Pasta',
    'Double Smash Burger',
  ];

  if (!isUniversalSearchOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-start justify-center
        bg-stone-950/80
        backdrop-blur-md
        p-3
        pt-4
        sm:p-5
        sm:pt-12
        lg:pt-16
        animate-in
      "
      onClick={closeSearch}
    >
      <div
        className="
          w-full
          max-w-[720px]
          overflow-hidden
          rounded-[28px]
          border border-stone-700/80
          bg-stone-900
          text-white
          shadow-[0_25px_100px_rgba(0,0,0,0.65)]
          flex flex-col
          max-h-[calc(100dvh-24px)]
          sm:max-h-[80vh]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            SEARCH HEADER
        ===================================================== */}

        <div
          className="
            shrink-0
            flex items-center gap-3
            border-b border-stone-800
            bg-stone-950/95
            px-4 py-4
            sm:px-5
          "
        >
          <div
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-amber-500/10
              border border-amber-500/20
            "
          >
            <Search className="h-5 w-5 text-amber-400" />
          </div>

          <div className="min-w-0 flex-1">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, pizza, restaurants..."
              className="
                w-full
                bg-transparent
                text-sm
                font-medium
                text-white
                outline-none
                placeholder:text-stone-500
                sm:text-base
              "
            />

            <span className="mt-1 block text-[10px] text-stone-500 sm:text-xs">
              Search dishes, restaurants, cuisines and locations
            </span>
          </div>

          {query && (
            <button
              onClick={() => setQuery('')}
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-xl
                text-stone-400
                hover:bg-stone-800
                hover:text-white
                transition
                cursor-pointer
              "
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={closeSearch}
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-stone-800
              text-stone-400
              hover:bg-stone-700
              hover:text-white
              transition
              cursor-pointer
            "
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================================
            RESULTS AREA
        ===================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            p-4
            sm:p-5
            scrollbar-thin
            scrollbar-thumb-stone-700
            scrollbar-track-transparent
          "
        >
          {/* ===================================================
              EMPTY SEARCH / TRENDING
          =================================================== */}

          {!query.trim() && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-stone-400
                  "
                >
                  Trending food searches
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border border-stone-700
                      bg-stone-800/80
                      px-3 py-2
                      text-xs
                      font-semibold
                      text-stone-300
                      transition
                      hover:-translate-y-0.5
                      hover:border-amber-500/50
                      hover:bg-amber-500/10
                      hover:text-amber-300
                      active:scale-95
                      cursor-pointer
                    "
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    {item}
                  </button>
                ))}
              </div>

              <div
                className="
                  mt-2
                  rounded-2xl
                  border border-stone-800
                  bg-stone-950/50
                  p-4
                  sm:p-5
                "
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-amber-500/10
                    "
                  >
                    <Utensils className="h-5 w-5 text-amber-400" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Discover your next craving
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-stone-400">
                      Try searching for a food item like Burger, Pizza,
                      Biryani, Momos or explore restaurants by cuisine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              SEARCH RESULTS
          =================================================== */}

          {query.trim() && (
            <div className="space-y-6">
              {/* SEARCH SUMMARY */}

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Search results
                  </span>

                  <h2 className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                    Results for{' '}
                    <span className="text-amber-400">
                      "{query}"
                    </span>
                  </h2>
                </div>

                {hasResults && (
                  <div
                    className="
                      shrink-0
                      rounded-full
                      border border-stone-700
                      bg-stone-800
                      px-2.5 py-1
                      text-[10px]
                      font-bold
                      text-stone-400
                    "
                  >
                    {matchingRestaurants.length +
                      matchingDishes.length}{' '}
                    found
                  </div>
                )}
              </div>

              {/* =================================================
                  RESTAURANTS
              ================================================= */}

              {matchingRestaurants.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-amber-400" />

                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-stone-400
                      "
                    >
                      Restaurants
                    </span>

                    <span className="text-[10px] text-stone-600">
                      ({matchingRestaurants.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {matchingRestaurants.map((restaurant) => (
                      <button
                        key={restaurant.id}
                        onClick={() =>
                          handleRestaurantClick(restaurant)
                        }
                        className="
                          group
                          w-full
                          rounded-2xl
                          border border-stone-800
                          bg-stone-950/70
                          p-3
                          text-left
                          transition
                          hover:border-amber-500/50
                          hover:bg-stone-950
                          active:scale-[0.99]
                          cursor-pointer
                        "
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={restaurant.logoImage}
                            alt={restaurant.name}
                            referrerPolicy="no-referrer"
                            className="
                              h-12 w-12
                              shrink-0
                              rounded-xl
                              object-cover
                              border border-stone-700
                            "
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-sm font-bold text-white">
                                {restaurant.name}
                              </h4>

                              {restaurant.isOpen && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="truncate text-[11px] text-stone-400">
                                {restaurant.cuisines.join(' • ')}
                              </span>

                              <span className="hidden text-stone-700 sm:inline">
                                •
                              </span>

                              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                                <MapPin className="h-3 w-3" />
                                {restaurant.area}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-400">
                            <span>★ {restaurant.rating}</span>

                            <ArrowRight
                              className="
                                h-4 w-4
                                transition-transform
                                group-hover:translate-x-1
                              "
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* =================================================
                  DISHES
              ================================================= */}

              {matchingDishes.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-rose-400" />

                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-stone-400
                      "
                    >
                      Signature dishes
                    </span>

                    <span className="text-[10px] text-stone-600">
                      ({matchingDishes.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {matchingDishes.map((dish, index) => (
                      <div
                        key={`${dish.parentRest.id}-${dish.id}-${index}`}
                        className="
                          group
                          overflow-hidden
                          rounded-2xl
                          border border-stone-800
                          bg-stone-950/70
                          p-3
                          transition
                          hover:border-amber-500/40
                        "
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            referrerPolicy="no-referrer"
                            className="
                              h-14 w-14
                              shrink-0
                              rounded-xl
                              object-cover
                              border border-stone-800
                            "
                          />

                          <div className="min-w-0 flex-1">
                            <h5 className="truncate text-xs font-bold text-white">
                              {dish.name}
                            </h5>

                            <p className="mt-1 truncate text-[10px] text-stone-500">
                              {dish.restaurantName}
                            </p>

                            <div className="mt-1.5 flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-black text-amber-400">
                                ₹{dish.price}
                              </span>

                              <button
                                onClick={(e) =>
                                  handleDishAdd(dish, e)
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded-lg
                                  bg-amber-500
                                  px-2.5 py-1.5
                                  text-[10px]
                                  font-black
                                  text-stone-950
                                  shadow-lg
                                  transition
                                  hover:bg-amber-400
                                  active:scale-95
                                  cursor-pointer
                                "
                              >
                                <ShoppingBag className="h-3 w-3" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* =================================================
                  NO RESULTS
              ================================================= */}

              {!hasResults && (
                <div
                  className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border border-stone-800
                    bg-stone-950/50
                    px-5
                    py-10
                    text-center
                  "
                >
                  <div
                    className="
                      flex h-14 w-14
                      items-center justify-center
                      rounded-2xl
                      bg-amber-500/10
                      border border-amber-500/20
                    "
                  >
                    <Search className="h-6 w-6 text-amber-400" />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white">
                    No exact match found
                  </h3>

                  <p className="mt-2 max-w-md text-xs leading-relaxed text-stone-400 sm:text-sm">
                    We couldn't find restaurants or dishes matching{' '}
                    <span className="font-semibold text-stone-300">
                      "{query}"
                    </span>
                    .
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {[
                      'Burger',
                      'Pizza',
                      'Momos',
                      'Biryani',
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="
                          rounded-xl
                          border border-stone-700
                          bg-stone-800
                          px-3 py-2
                          text-xs
                          font-semibold
                          text-stone-300
                          hover:border-amber-500/50
                          hover:text-amber-300
                          transition
                          cursor-pointer
                        "
                      >
                        Try "{item}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            shrink-0
            border-t border-stone-800
            bg-stone-950/80
            px-4 py-2.5
            sm:px-5
          "
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-stone-500">
              <Clock className="h-3 w-3" />
              Smart food discovery
            </span>

            <span className="hidden text-[10px] text-stone-600 sm:block">
              Press ESC to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};