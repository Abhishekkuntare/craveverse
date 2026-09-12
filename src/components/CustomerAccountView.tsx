import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USER_ADDRESSES } from '../data/mockData';
import { 
  User, 
  Wallet, 
  Sparkles, 
  Clock, 
  Heart, 
  MapPin, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Check, 
  CreditCard,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const { 
    walletBalance, 
    addWalletMoney, 
    rewardPoints, 
    isFoodPlusMember, 
    toggleFoodPlus, 
    orderHistory, 
    favorites, 
    restaurantList,
    setSelectedRestaurant,
    setCurrentView,
    addToCart,
    reorderOrder,
    showToast 
  } = useApp();

  const [topUpAmount, setTopUpAmount] = useState<number>(500);

  const handleReorder = (order: typeof orderHistory[0]) => {
    reorderOrder(order);
  };

  const savedRestaurants = restaurantList.filter((r) => favorites.restaurants.includes(r.id));

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
       <div
  className="
    w-full
    min-w-0
    p-4 sm:p-6 lg:p-8
    rounded-3xl
    bg-stone-900
    border border-stone-800
    shadow-2xl
    flex flex-col
    xl:flex-row
    xl:items-center
    justify-between
    gap-5 sm:gap-6 lg:gap-8
    overflow-hidden
  "
>
  {/* ================= PROFILE ================= */}
  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
    {/* Avatar */}
    <div className="relative shrink-0">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        alt="Priya Sharma"
        referrerPolicy="no-referrer"
        className="
          w-14 h-14
          sm:w-16 sm:h-16
          lg:w-20 lg:h-20
          rounded-2xl sm:rounded-3xl
          object-cover
          border-2 border-amber-400
          shadow-lg
        "
      />

      {/* VIP Badge */}
      <span
        className="
          absolute
          -bottom-1
          -right-1
          sm:-right-2
          px-1.5 sm:px-2
          py-0.5
          rounded-full
          bg-amber-500
          text-stone-950
          font-black
          text-[7px] sm:text-[8px] lg:text-[9px]
          uppercase
          whitespace-nowrap
          shadow-md
        "
      >
        VIP
      </span>
    </div>

    {/* Profile Information */}
    <div className="min-w-0 flex-1">
      {/* Name + Membership */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-1.5 sm:gap-2
          min-w-0
        "
      >
        <h1
          className="
            font-display
            font-black
            text-xl
            sm:text-2xl
            lg:text-3xl
            leading-tight
            text-white
            truncate
          "
        >
          Priya Sharma
        </h1>

        {isFoodPlusMember && (
          <span
            className="
              self-start sm:self-auto
              inline-flex
              items-center
              w-fit
              px-2 sm:px-2.5
              py-0.5
              rounded-full
              bg-gradient-to-r
              from-amber-400
              to-rose-400
              text-stone-950
              text-[8px] sm:text-[9px] lg:text-[10px]
              font-black
              uppercase
              tracking-wide
              whitespace-nowrap
              shadow-md
            "
          >
            FOOD+ MEMBER
          </span>
        )}
      </div>

      {/* Email / Member Since */}
      <p
        className="
          text-[10px]
          sm:text-xs
          text-stone-400
          mt-1
          leading-relaxed
          break-words
        "
      >
        <span className="break-all sm:break-normal">
          priya.sharma@craveverse.in
        </span>

        <span className="hidden sm:inline"> • </span>

        <span className="block sm:inline mt-0.5 sm:mt-0">
          Member since Jan 2024
        </span>
      </p>

      {/* Rewards / Orders */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-x-2
          gap-y-1
          text-[10px]
          sm:text-xs
          mt-2
          font-semibold
        "
      >
        <span className="text-amber-400 whitespace-nowrap">
          ⭐ {rewardPoints} CravePoints
        </span>

        <span className="text-stone-600 hidden sm:inline">
          •
        </span>

        <span className="text-stone-300 whitespace-nowrap">
          42 Orders Delivered
        </span>
      </div>
    </div>
  </div>

  {/* ================= FOOD+ CARD ================= */}
  <div
    className="
      w-full
      xl:w-auto
      xl:min-w-[320px]
      xl:max-w-[390px]
      p-3.5 sm:p-4
      rounded-2xl
      bg-stone-950
      border border-amber-500/30
      space-y-2
      shadow-lg
      min-w-0
    "
  >
    {/* Card Header */}
    <div
      className="
        flex
        items-start
        justify-between
        gap-3
        min-w-0
      "
    >
      {/* Title */}
      <span
        className="
          min-w-0
          text-[11px]
          sm:text-xs
          font-bold
          text-white
          flex
          items-center
          gap-1.5
          leading-tight
        "
      >
        <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />

        <span className="truncate">
          Food+ VIP Benefits
        </span>
      </span>

      {/* Toggle Button */}
      <button
        onClick={toggleFoodPlus}
        className={`
          shrink-0
          text-[9px]
          sm:text-[10px]
          font-bold
          px-2
          sm:px-2.5
          py-1.5
          rounded-lg
          transition
          cursor-pointer
          whitespace-nowrap
          active:scale-95
          ${
            isFoodPlusMember
              ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
          }
        `}
      >
        {isFoodPlusMember ? 'Active' : 'Upgrade ₹99/mo'}
      </button>
    </div>

    {/* Description */}
    <p
      className="
        text-[10px]
        sm:text-[11px]
        leading-relaxed
        text-stone-400
      "
    >
      {isFoodPlusMember
        ? 'Enjoy ₹0 delivery fee on all orders above ₹199 + up to 30% extra restaurant perks.'
        : 'Unlock zero delivery charges and priority culinary dispatches.'}
    </p>
  </div>
</div>

        {/* CraveWallet & Saved Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Wallet */}
          <div className="md:col-span-6 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-white">CraveWallet</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">1-Tap Checkout Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400">Available Balance</span>
                <div className="font-mono font-black text-3xl text-white">₹{walletBalance}</div>
              </div>

              <button
                onClick={() => addWalletMoney(topUpAmount)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add ₹{topUpAmount}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-400">Quick top-up:</span>
              {[200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs transition cursor-pointer ${
                    topUpAmount === amt
                      ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/40'
                      : 'bg-stone-950 text-stone-400 border border-stone-800'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="md:col-span-6 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-white">Saved Addresses</h3>
              </div>
              <span className="text-xs text-stone-400">{USER_ADDRESSES.length} locations</span>
            </div>

            <div className="space-y-2.5">
              {USER_ADDRESSES.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white uppercase text-[11px] block">
                      {addr.label}
                    </span>
                    <span className="text-stone-400 line-clamp-1">
                      {addr.street}, {addr.area}, {addr.city}
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-semibold">Default</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4 sm:space-y-5 overflow-hidden">

  {/* ================= HEADER ================= */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
      </div>

      <h3 className="font-display font-bold text-base sm:text-lg text-white truncate">
        Past Orders & Invoices
      </h3>
    </div>

    <span className="text-[10px] sm:text-xs text-stone-400 pl-10 sm:pl-0">
      {orderHistory.length} orders placed
    </span>
  </div>

  {/* ================= ORDERS ================= */}
  <div className="space-y-3 sm:space-y-4">

    {orderHistory.map((order) => (
      <div
        key={order.id}
        className="
          group
          w-full
          min-w-0
          p-3.5
          sm:p-4
          lg:p-5
          rounded-2xl
          bg-stone-950
          border border-stone-800
          hover:border-stone-700
          transition-all
          duration-200
        "
      >

        {/* ================= TOP / RESTAURANT ================= */}
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">

          {/* Restaurant Image */}
          <img
            src={order.restaurantImage}
            alt={order.restaurantName}
            referrerPolicy="no-referrer"
            className="
              w-12 h-12
              sm:w-14 sm:h-14
              rounded-xl sm:rounded-2xl
              object-cover
              border border-stone-800
              shrink-0
            "
          />

          {/* Restaurant Details */}
          <div className="min-w-0 flex-1">

            {/* Name + Status */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">

              <h4
                className="
                  font-bold
                  text-white
                  text-sm
                  sm:text-base
                  truncate
                  max-w-full
                "
              >
                {order.restaurantName}
              </h4>

              <span
                className="
                  inline-flex
                  items-center
                  px-1.5
                  sm:px-2
                  py-0.5
                  rounded-full
                  bg-emerald-500/15
                  border border-emerald-500/20
                  text-emerald-300
                  text-[8px]
                  sm:text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  whitespace-nowrap
                "
              >
                {order.status}
              </span>

            </div>

            {/* Order ID */}
            <p className="text-[10px] sm:text-xs text-stone-500 mt-1">
              Order #{order.id}
              <span className="mx-1 text-stone-700">•</span>
              Placed {order.placedAt}
            </p>

            {/* Items */}
            <p
              className="
                text-[10px]
                sm:text-[11px]
                text-stone-300
                mt-1.5
                leading-relaxed
                line-clamp-2
              "
              title={order.items
                .map((i) => `${i.quantity}x ${i.foodItem.name}`)
                .join(', ')}
            >
              {order.items
                .map((i) => `${i.quantity}x ${i.foodItem.name}`)
                .join(', ')}
            </p>

          </div>
        </div>


        {/* ================= BOTTOM DETAILS ================= */}
        <div
          className="
            mt-3
            sm:mt-4
            pt-3
            sm:pt-4
            border-t
            border-stone-800
            flex
            flex-col
            xs:flex-row
            sm:flex-row
            sm:items-center
            justify-between
            gap-3
          "
        >

          {/* Payment / Amount */}
          <div className="flex items-center justify-between xs:justify-start sm:justify-start gap-4 min-w-0">

            <div className="min-w-0">
              <span
                className="
                  font-mono
                  font-black
                  text-white
                  text-base
                  sm:text-lg
                  block
                  leading-none
                "
              >
                ₹{order.totalAmount}
              </span>

              <span className="text-[9px] sm:text-[10px] text-stone-500 mt-1 block truncate">
                Paid via {order.paymentMethod}
              </span>
            </div>

          </div>


          {/* Reorder */}
          <button
            onClick={() => handleReorder(order)}
            className="
              w-full
              xs:w-auto
              sm:w-auto
              min-h-[40px]
              px-4
              py-2.5
              rounded-xl
              bg-amber-500
              hover:bg-amber-400
              active:bg-amber-400
              text-stone-950
              font-bold
              text-[11px]
              sm:text-xs
              flex
              items-center
              justify-center
              gap-1.5
              cursor-pointer
              shrink-0
              transition-all
              duration-200
              hover:shadow-lg
              hover:shadow-amber-500/10
              active:scale-[0.98]
            "
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reorder</span>
          </button>

        </div>

      </div>
    ))}

  </div>
</div>

        {/* Saved Food Universe (Favorite Restaurants) */}
        {savedRestaurants.length > 0 && (
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-display font-bold text-lg text-white">
                  My Bookmarked Food Universe ({savedRestaurants.length})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => {
                    setSelectedRestaurant(rest);
                    setCurrentView('restaurant-detail');
                  }}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 flex items-center space-x-3 cursor-pointer transition"
                >
                  <img
                    src={rest.coverImage}
                    alt={rest.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="font-bold text-white text-xs truncate">{rest.name}</h4>
                    <p className="text-[11px] text-amber-400">★ {rest.rating} • {rest.deliveryTimeMin}m</p>
                    <p className="text-[10px] text-stone-400 truncate">{rest.cuisines.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
