export type DietType = 'veg' | 'non-veg' | 'vegan' | 'egg';

export interface FoodCustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodCustomizationGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect?: number;
  options: FoodCustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  diet: DietType;
  spiceLevel?: 1 | 2 | 3; // 1: Mild, 2: Medium, 3: Fire
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  calories?: number;
  prepTimeMinutes: number;
  ingredients?: string[];
  allergens?: string[];
  customizations?: FoodCustomizationGroup[];
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  logo: string;
  rating: number;
  reviewCount: number;
  cuisines: string[];
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  distanceKm: number;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  address: string;
  area: string;
  city: string;
  isOpen: boolean;
  openingHours: string;
  isFeatured?: boolean;
  isPromoted?: boolean;
  offers: string[];
  menuCategories: string[];
  menuItems: FoodItem[];
  hasStories?: boolean;
  storyPreview?: string;
  coordinates: { lat: number; lng: number };
  reviews?: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    date: string;
    rating: number;
    comment: string;
  }>;
}

export interface CartItem {
  cartItemId: string; // unique combo of item id + customization
  foodItem: FoodItem;
  quantity: number;
  selectedCustomizations: { [groupId: string]: FoodCustomizationOption[] };
  specialInstructions?: string;
  totalPrice: number;
}

export type OrderStatus = 
  | 'PLACED' 
  | 'ACCEPTED' 
  | 'PREPARING' 
  | 'READY' 
  | 'RIDER_ASSIGNED' 
  | 'PICKED_UP' 
  | 'ON_THE_WAY' 
  | 'ARRIVING' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  photo: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  totalTrips: number;
  currentLat?: number;
  currentLng?: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  appliedCoupon?: string;
  tip: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: {
    label: string;
    street: string;
    area: string;
    city: string;
  };
  deliveryOption: 'ASAP' | 'SCHEDULED' | 'PICKUP';
  scheduledTime?: string;
  paymentMethod: 'UPI' | 'CARD' | 'WALLET' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  placedAt: string;
  estimatedDeliveryAt: string;
  deliveryPartner?: DeliveryPartner;
  timeline: OrderTimelineEvent[];
}

export interface FoodStory {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  title: string;
  mediaUrl: string;
  isVideo?: boolean;
  durationSeconds: number;
  tags: string[];
  dishMention?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface FoodVideo {
  id: string;
  title: string;
  creator: string;
  restaurantName: string;
  restaurantId: string;
  dishName: string;
  dishId: string;
  price: number;
  videoPoster: string;
  videoUrl: string;
  likes: number;
  tags: string[];
  isVeg: boolean;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  restaurantCount: number;
  filterCuisine?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FLAT' | 'BOGO' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validTill: string;
  tag: string;
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  street: string;
  area: string;
  city: string;
  isDefault: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  dishReviewed?: string;
  helpfulCount: number;
  photo?: string;
  restaurantReply?: string;
}

export type ActiveRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export type MainView = 
  | 'home' 
  | 'restaurants' 
  | 'restaurant-detail' 
  | 'food-discovery-feed' 
  | 'collections' 
  | 'offers' 
  | 'checkout' 
  | 'tracking' 
  | 'account' 
  | 'restaurant-dashboard' 
  | 'delivery-dashboard' 
  | 'admin-dashboard' 
  | 'city-guide';
