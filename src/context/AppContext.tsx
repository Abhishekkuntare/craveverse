import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MainView, 
  ActiveRole, 
  Restaurant, 
  FoodItem, 
  CartItem, 
  Order, 
  OrderStatus, 
  FoodStory, 
  FoodCustomizationOption,
  UserAddress 
} from '../types';
import { RESTAURANTS_DATA, USER_ADDRESSES, POPULAR_LOCATIONS, OFFERS_DATA } from '../data/mockData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  
  // Location
  currentLocation: { city: string; area: string };
  setCurrentLocation: (loc: { city: string; area: string }) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  detectCurrentLocation: () => Promise<void>;
  isDetectingLocation: boolean;

  // Selected Entities
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  selectedFoodItem: FoodItem | null;
  setSelectedFoodItem: (item: FoodItem | null) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  vegOnly: boolean;
  setVegOnly: (veg: boolean) => void;
  isUniversalSearchOpen: boolean;
  setIsUniversalSearchOpen: (open: boolean) => void;

  // Cart Management
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: FoodItem, customizations?: { [groupId: string]: FoodCustomizationOption[] }, specialInstructions?: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  deliveryTip: number;
  setDeliveryTip: (tip: number) => void;
  deliveryInstructions: string;
  setDeliveryInstructions: (inst: string) => void;
  scheduledDeliveryTime: string | null;
  setScheduledDeliveryTime: (time: string | null) => void;
  cartTotals: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    platformFee: number;
    taxes: number;
    tip: number;
    grandTotal: number;
    itemCount: number;
  };

  // Orders & Real-time Delivery
  activeOrder: Order | null;
  orderHistory: Order[];
  createOrder: (paymentMethod: 'UPI' | 'CARD' | 'WALLET' | 'COD', address: UserAddress) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  advanceOrderProgress: (orderId: string) => void;
  reorderOrder: (order: Order) => void;

  // Customer Favorites & Membership
  favorites: { restaurants: string[]; dishes: string[] };
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteDish: (id: string) => void;
  isFoodPlusMember: boolean;
  toggleFoodPlus: () => void;
  walletBalance: number;
  addWalletMoney: (amount: number) => void;
  rewardPoints: number;

  // AI Assistant
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  aiInitialQuery: string;
  setAiInitialQuery: (q: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Restaurant Partner State (simulation)
  restaurantList: Restaurant[];
  updateRestaurantStock: (restaurantId: string, dishId: string, isAvailable: boolean) => void;
  addMenuItemToRestaurant: (restaurantId: string, newItem: FoodItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & View
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [activeRole, setActiveRole] = useState<ActiveRole>('customer');

  // Location
  const [currentLocation, setCurrentLocation] = useState({
    city: 'Bengaluru',
    area: '100ft Road, Indiranagar'
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Entities
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(RESTAURANTS_DATA[0]);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('CRAVE50');
  const [deliveryTip, setDeliveryTip] = useState(30);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState<string | null>(null);

  // User State
  const [favorites, setFavorites] = useState<{ restaurants: string[]; dishes: string[] }>({
    restaurants: ['rest-1', 'rest-2'],
    dishes: ['dish-101', 'dish-201']
  });
  const [isFoodPlusMember, setIsFoodPlusMember] = useState(true);
  const [walletBalance, setWalletBalance] = useState(780);
  const [rewardPoints, setRewardPoints] = useState(1450);

  // AI Assistant
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Orders
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([
    {
      id: 'CRV-89421',
      restaurantId: 'rest-1',
      restaurantName: 'Burger Lab & Smokehouse',
      restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      items: [
        {
          cartItemId: 'item-h1',
          foodItem: RESTAURANTS_DATA[0].menuItems[0],
          quantity: 2,
          selectedCustomizations: {},
          totalPrice: 658
        },
        {
          cartItemId: 'item-h2',
          foodItem: RESTAURANTS_DATA[0].menuItems[2],
          quantity: 1,
          selectedCustomizations: {},
          totalPrice: 189
        }
      ],
      subtotal: 847,
      deliveryFee: 0,
      platformFee: 7,
      taxes: 42,
      discount: 100,
      appliedCoupon: 'CRAVE50',
      tip: 30,
      totalAmount: 826,
      status: 'DELIVERED',
      deliveryAddress: {
        label: 'Home',
        street: 'Skyline Palms, 12th Main Road',
        area: 'Indiranagar',
        city: 'Bengaluru'
      },
      deliveryOption: 'ASAP',
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      placedAt: 'Yesterday, 8:40 PM',
      estimatedDeliveryAt: 'Yesterday, 9:08 PM',
      timeline: [
        { status: 'PLACED', label: 'Order Placed', timestamp: '8:40 PM', completed: true },
        { status: 'ACCEPTED', label: 'Restaurant Confirmed', timestamp: '8:42 PM', completed: true },
        { status: 'PREPARING', label: 'Sizzling in Kitchen', timestamp: '8:45 PM', completed: true },
        { status: 'PICKED_UP', label: 'Picked Up by Courier', timestamp: '8:58 PM', completed: true },
        { status: 'DELIVERED', label: 'Delivered at Doorstep', timestamp: '9:08 PM', completed: true }
      ]
    }
  ]);

  // Cart Calculations
  const cartTotals = React.useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      const match = OFFERS_DATA.find((o) => o.code === appliedCoupon);
      if (match) {
        if (match.discountType === 'PERCENT') {
          discount = Math.min((subtotal * match.discountValue) / 100, match.maxDiscount || 100);
        } else if (match.discountType === 'FLAT') {
          discount = match.discountValue;
        } else if (match.discountType === 'FREE_DELIVERY') {
          discount = 35;
        }
      }
    }

    const deliveryFee = subtotal > 299 || isFoodPlusMember ? 0 : 35;
    const platformFee = subtotal > 0 ? 9 : 0;
    const taxes = Math.round(subtotal * 0.05);
    const grandTotal = Math.max(0, subtotal - discount + deliveryFee + platformFee + taxes + deliveryTip);

    return {
      subtotal,
      discount,
      deliveryFee,
      platformFee,
      taxes,
      tip: deliveryTip,
      grandTotal,
      itemCount
    };
  }, [cart, appliedCoupon, isFoodPlusMember, deliveryTip]);

  // Add to Cart
  const addToCart = (
    item: FoodItem,
    customizations: { [groupId: string]: FoodCustomizationOption[] } = {},
    specialInstructions = ''
  ) => {
    const parentRest = restaurantList.find((r) => r.id === item.restaurantId) || RESTAURANTS_DATA[0];

    // Check if cart has items from different restaurant
    if (cart.length > 0 && cartRestaurant && cartRestaurant.id !== parentRest.id) {
      const confirmClear = window.confirm(
        `Your cart contains items from "${cartRestaurant.name}". Reset cart to add delicious food from "${parentRest.name}"?`
      );
      if (!confirmClear) return;
      setCart([]);
    }

    setCartRestaurant(parentRest);

    // Calculate item unit price with customizations
    let customAddPrice = 0;
    const safeCustomizations = (customizations && typeof customizations === 'object' && !Array.isArray(customizations))
      ? customizations
      : {};

    Object.values(safeCustomizations).forEach((opts) => {
      if (Array.isArray(opts)) {
        opts.forEach((o) => {
          if (o && typeof o.price === 'number') {
            customAddPrice += o.price;
          }
        });
      }
    });
    const unitPrice = item.price + customAddPrice;

    // Unique key
    const customKey = Object.entries(safeCustomizations)
      .filter(([_, opts]) => Array.isArray(opts))
      .map(([gid, opts]) => `${gid}:${opts.map((o) => o?.id || '').sort().join(',')}`)
      .sort()
      .join('|');
    const cartItemId = `${item.id}-${customKey}`;

    setCart((prev) => {
      const existing = prev.find((c) => c.cartItemId === cartItemId);
      if (existing) {
        return prev.map((c) =>
          c.cartItemId === cartItemId
            ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * unitPrice }
            : c
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          foodItem: item,
          quantity: 1,
          selectedCustomizations: safeCustomizations,
          specialInstructions,
          totalPrice: unitPrice
        }
      ];
    });

    showToast(`Added "${item.name}" to cart! 🍔`, 'success');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.cartItemId === cartItemId) {
            const nextQty = c.quantity + delta;
            if (nextQty <= 0) return null;
            const singleUnitPrice = c.totalPrice / c.quantity;
            return {
              ...c,
              quantity: nextQty,
              totalPrice: nextQty * singleUnitPrice
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
  };

  // Real Location detect with GPS reverse geocode and IP fallback
  const detectCurrentLocation = async (): Promise<void> => {
    setIsDetectingLocation(true);
    showToast('Locating your GPS coordinates...', 'info');

    const resolveReverseGeocode = async (lat: number, lng: number): Promise<boolean> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
          {
            signal: controller.signal,
            headers: { 'Accept-Language': 'en' }
          }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.quarter || addr.subdistrict || 'Current Location';
          const city = addr.city || addr.town || addr.municipality || addr.state_district || addr.state || 'Local City';
          setCurrentLocation({ city, area });
          setIsLocationModalOpen(false);
          setIsDetectingLocation(false);
          showToast(`📍 Location updated: ${area}, ${city}`, 'success');
          return true;
        }
      } catch (err) {
        console.warn('Reverse geocode error or timeout:', err);
      }
      return false;
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            const city = data.city;
            const area = data.region || 'Central Area';
            setCurrentLocation({ city, area });
            setIsLocationModalOpen(false);
            setIsDetectingLocation(false);
            showToast(`📍 Detected approximate city: ${area}, ${city}`, 'success');
            return;
          }
        }
      } catch (err) {
        console.warn('IP location error:', err);
      }

      // Default safe fallback if network offline or blocked
      setCurrentLocation(POPULAR_LOCATIONS[0]);
      setIsLocationModalOpen(false);
      setIsDetectingLocation(false);
      showToast(`📍 Set to default: ${POPULAR_LOCATIONS[0].area}, ${POPULAR_LOCATIONS[0].city}`, 'info');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const success = await resolveReverseGeocode(lat, lng);
          if (!success) {
            // Coordinate fallback
            setCurrentLocation({
              city: 'Detected Area',
              area: `GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`
            });
            setIsLocationModalOpen(false);
            setIsDetectingLocation(false);
            showToast(`📍 GPS coordinates locked: ${lat.toFixed(3)}, ${lng.toFixed(3)}`, 'success');
          }
        },
        async (error) => {
          console.warn('Geolocation denied or unavailable:', error.message);
          showToast('GPS unavailable in iframe, looking up your network location...', 'info');
          await fallbackToIP();
        },
        { timeout: 8000, enableHighAccuracy: true, maximumAge: 30000 }
      );
    } else {
      await fallbackToIP();
    }
  };

  // Create Order
  const createOrder = (paymentMethod: 'UPI' | 'CARD' | 'WALLET' | 'COD', address: UserAddress): Order => {
    const orderId = 'CRV-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const estTime = new Date(now.getTime() + 28 * 60000);

    const newOrder: Order = {
      id: orderId,
      restaurantId: cartRestaurant?.id || 'rest-1',
      restaurantName: cartRestaurant?.name || 'Burger Lab & Smokehouse',
      restaurantImage: cartRestaurant?.coverImage || RESTAURANTS_DATA[0].coverImage,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      deliveryFee: cartTotals.deliveryFee,
      platformFee: cartTotals.platformFee,
      taxes: cartTotals.taxes,
      discount: cartTotals.discount,
      appliedCoupon: appliedCoupon || undefined,
      tip: cartTotals.tip,
      totalAmount: cartTotals.grandTotal,
      status: 'PLACED',
      deliveryAddress: {
        label: address.label,
        street: address.street,
        area: address.area,
        city: address.city
      },
      deliveryOption: scheduledDeliveryTime ? 'SCHEDULED' : 'ASAP',
      scheduledTime: scheduledDeliveryTime || undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      placedAt: 'Just now',
      estimatedDeliveryAt: estTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryPartner: {
        id: 'rider-01',
        name: 'Vikram Rajput',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        phone: '+91 98450 12345',
        vehicle: 'Ather 450X EV',
        vehicleNumber: 'KA-03-HA-4819',
        rating: 4.9,
        totalTrips: 1840,
        currentLat: 12.975,
        currentLng: 77.64
      },
      timeline: [
        { status: 'PLACED', label: 'Order Confirmed', timestamp: 'Just now', completed: true },
        { status: 'ACCEPTED', label: 'Kitchen Preparing', timestamp: 'In 2 mins', completed: false },
        { status: 'RIDER_ASSIGNED', label: 'Rider Heading to Restaurant', timestamp: 'In 8 mins', completed: false },
        { status: 'PICKED_UP', label: 'Hot Food Picked Up', timestamp: 'In 16 mins', completed: false },
        { status: 'ARRIVING', label: 'Rider Arriving near Doorstep', timestamp: 'In 24 mins', completed: false },
        { status: 'DELIVERED', label: 'Delivered Fresh & Hot', timestamp: 'In 28 mins', completed: false }
      ]
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setRewardPoints((prev) => prev + Math.round(cartTotals.grandTotal * 0.1));
    if (paymentMethod === 'WALLET') {
      setWalletBalance((prev) => Math.max(0, prev - cartTotals.grandTotal));
    }
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    showToast(`Order #${orderId} Placed Successfully! 🚀`, 'success');
    setCurrentView('tracking');
    return newOrder;
  };

  // Real-time simulated progression of active order
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'DELIVERED' || activeOrder.status === 'CANCELLED') {
      return;
    }

    const timer = setTimeout(() => {
      const transitions: Record<OrderStatus, OrderStatus> = {
        PLACED: 'ACCEPTED',
        ACCEPTED: 'PREPARING',
        PREPARING: 'RIDER_ASSIGNED',
        RIDER_ASSIGNED: 'PICKED_UP',
        PICKED_UP: 'ON_THE_WAY',
        ON_THE_WAY: 'ARRIVING',
        ARRIVING: 'DELIVERED',
        READY: 'RIDER_ASSIGNED',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED'
      };

      const nextStatus = transitions[activeOrder.status];
      if (nextStatus && nextStatus !== activeOrder.status) {
        updateOrderStatus(activeOrder.id, nextStatus);
        if (nextStatus === 'DELIVERED') {
          showToast('Ding Dong! Your hot CraveVerse order has arrived! Enjoy your meal 🍔🎉', 'success');
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
          } catch {}
        } else if (nextStatus === 'ACCEPTED') {
          showToast('Restaurant accepted your order! Master chef is firing the stove.', 'info');
        } else if (nextStatus === 'PICKED_UP') {
          showToast('Vikram picked up your hot food package! Speeding your way.', 'info');
        }
      }
    }, 18000); // Progresses smoothly

    return () => clearTimeout(timer);
  }, [activeOrder]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setActiveOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: newStatus,
        timeline: prev.timeline.map((t) => (t.status === newStatus ? { ...t, completed: true } : t))
      };
    });

    setOrderHistory((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            timeline: ord.timeline.map((t) => (t.status === newStatus ? { ...t, completed: true } : t))
          };
        }
        return ord;
      })
    );
  };

  // Step to next progress state for instant interactive demonstration
  const advanceOrderProgress = (orderId: string) => {
    if (!activeOrder || activeOrder.id !== orderId) return;
    const stages: OrderStatus[] = [
      'PLACED',
      'ACCEPTED',
      'PREPARING',
      'RIDER_ASSIGNED',
      'PICKED_UP',
      'ON_THE_WAY',
      'ARRIVING',
      'DELIVERED'
    ];
    const currentIndex = stages.indexOf(activeOrder.status);
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStatus = stages[nextIndex];
    updateOrderStatus(orderId, nextStatus);

    if (nextStatus === 'DELIVERED') {
      showToast('Order delivered! Enjoy your meal 🍔🎉', 'success');
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } else {
      showToast(`Order status updated to: ${nextStatus.replace(/_/g, ' ')} 🚀`, 'info');
    }
  };

  // Instant Reorder Functionality
  const reorderOrder = (order: Order) => {
    const matchedRestaurant = restaurantList.find((r) => r.id === order.restaurantId) || {
      id: order.restaurantId,
      name: order.restaurantName,
      tagline: 'Authentic gourmet treats delivered hot',
      coverImage: order.restaurantImage,
      logo: order.restaurantImage,
      rating: 4.8,
      reviewCount: 320,
      cuisines: ['Multi-cuisine', 'Bestsellers'],
      priceRange: '₹₹',
      deliveryTimeMin: 22,
      deliveryTimeMax: 32,
      distanceKm: 2.1,
      deliveryFee: order.deliveryFee,
      address: `${order.restaurantName}, Main Hub`,
      area: order.deliveryAddress.area,
      city: order.deliveryAddress.city,
      isOpen: true,
      openingHours: '10:00 AM - 11:30 PM',
      offers: ['20% OFF up to ₹100'],
      menuCategories: ['Reordered Classics'],
      menuItems: order.items.map((i) => i.foodItem),
      coordinates: { lat: 12.975, lng: 77.64 }
    } as Restaurant;

    setCartRestaurant(matchedRestaurant);
    setSelectedRestaurant(matchedRestaurant);

    const reorderedCartItems: CartItem[] = order.items.map((item, idx) => ({
      cartItemId: `reorder-${item.foodItem.id}-${Date.now()}-${idx}`,
      foodItem: item.foodItem,
      quantity: item.quantity,
      selectedCustomizations: item.selectedCustomizations || {},
      specialInstructions: item.specialInstructions,
      totalPrice: item.totalPrice
    }));

    setCart(reorderedCartItems);
    setIsCartDrawerOpen(true);
    showToast(`Reordered ${reorderedCartItems.length} items from ${order.restaurantName}! 🍔`, 'success');
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch {}
  };

  const toggleFavoriteRestaurant = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.restaurants.includes(id);
      const updated = exists ? prev.restaurants.filter((r) => r !== id) : [...prev.restaurants, id];
      showToast(exists ? 'Removed from favorites' : 'Saved to your Food Universe ❤️', 'info');
      return { ...prev, restaurants: updated };
    });
  };

  const toggleFavoriteDish = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.dishes.includes(id);
      const updated = exists ? prev.dishes.filter((d) => d !== id) : [...prev.dishes, id];
      showToast(exists ? 'Dish unbookmarked' : 'Dish added to Favorites ⭐', 'info');
      return { ...prev, dishes: updated };
    });
  };

  const toggleFoodPlus = () => {
    setIsFoodPlusMember((prev) => {
      const next = !prev;
      showToast(next ? 'Welcome to Food+ VIP! Zero delivery fees unlocked 🌟' : 'Food+ VIP paused', 'info');
      return next;
    });
  };

  const addWalletMoney = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    showToast(`Added ₹${amount} to CraveWallet! Available balance: ₹${walletBalance + amount}`, 'success');
  };

  // Restaurant Partner Operations
  const updateRestaurantStock = (restaurantId: string, dishId: string, isAvailable: boolean) => {
    setRestaurantList((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            menuItems: r.menuItems.map((item) => (item.id === dishId ? { ...item, isAvailable } : item))
          };
        }
        return r;
      })
    );
    showToast(`Item availability updated: ${isAvailable ? 'In Stock' : 'Marked Out of Stock'}`, 'info');
  };

  const addMenuItemToRestaurant = (restaurantId: string, newItem: FoodItem) => {
    setRestaurantList((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            menuItems: [newItem, ...r.menuItems]
          };
        }
        return r;
      })
    );
    showToast(`Dish "${newItem.name}" published to live menu!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
        currentLocation,
        setCurrentLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        detectCurrentLocation,
        isDetectingLocation,
        selectedRestaurant,
        setSelectedRestaurant,
        selectedFoodItem,
        setSelectedFoodItem,
        activeStoryIndex,
        setActiveStoryIndex,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        vegOnly,
        setVegOnly,
        isUniversalSearchOpen,
        setIsUniversalSearchOpen,
        cart,
        cartRestaurant,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        setAppliedCoupon,
        deliveryTip,
        setDeliveryTip,
        deliveryInstructions,
        setDeliveryInstructions,
        scheduledDeliveryTime,
        setScheduledDeliveryTime,
        cartTotals,
        activeOrder,
        orderHistory,
        createOrder,
        updateOrderStatus,
        advanceOrderProgress,
        reorderOrder,
        favorites,
        toggleFavoriteRestaurant,
        toggleFavoriteDish,
        isFoodPlusMember,
        toggleFoodPlus,
        walletBalance,
        addWalletMoney,
        rewardPoints,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        aiInitialQuery,
        setAiInitialQuery,
        toasts,
        showToast,
        removeToast,
        restaurantList,
        updateRestaurantStock,
        addMenuItemToRestaurant
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
