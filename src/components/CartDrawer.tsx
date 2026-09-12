import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFERS_DATA } from '../data/mockData';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Bike, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock, 
  Heart,
  ShoppingBag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartRestaurant, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    deliveryTip,
    setDeliveryTip,
    scheduledDeliveryTime,
    setScheduledDeliveryTime,
    cartTotals,
    setCurrentView,
    isFoodPlusMember,
    showToast
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const valid = OFFERS_DATA.find((o) => o.code.toUpperCase() === code.toUpperCase());
    if (valid) {
      setAppliedCoupon(valid.code);
      setCouponInput('');
      showToast(`Promo "${valid.code}" applied successfully! 🎉`, 'success');
    } else {
      showToast('Invalid coupon code. Try CRAVE50 or FLAT75', 'error');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div 
        className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col justify-between text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">
                Your Flavor Box
              </h2>
              {cartRestaurant && (
                <p className="text-xs text-stone-400 truncate max-w-[200px]">
                  From <span className="text-amber-400 font-semibold">{cartRestaurant.name}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto text-3xl">
                🍟
              </div>
              <h3 className="font-display font-bold text-lg text-white">Your cart is empty</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Explore handpicked burgers, artisanal pizzas, and crispy momos to fill your universe!
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('restaurants');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>{cartTotals.itemCount} Items</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                          item.foodItem.diet === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.foodItem.name}</h4>
                          <span className="text-[11px] font-mono text-stone-400 font-semibold">
                            ₹{item.totalPrice / item.quantity} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-2 px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-bold">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="hover:text-amber-400 cursor-pointer p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-amber-400 w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="hover:text-amber-400 cursor-pointer p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Customizations tags */}
                    {Object.values(item.selectedCustomizations || {}).some((opts: any) => opts?.length > 0) && (
                      <div className="flex flex-wrap gap-1 pl-4 pt-1">
                        {(Object.values(item.selectedCustomizations || {}) as any[]).flatMap((opts: any) =>
                          opts.map((opt: any) => (
                            <span
                              key={opt.id}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800"
                            >
                              + {opt.name}
                            </span>
                          ))
                        )}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-300 italic pl-4">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 pl-4 text-xs font-mono font-bold text-white">
                      <span className="text-stone-500 text-[10px]">Total</span>
                      <span>₹{item.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Timing Options */}
              <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-stone-200">Delivery Preference</span>
                  </div>
                  <button
                    onClick={() => setShowSchedulePicker(!showSchedulePicker)}
                    className="text-amber-400 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    {scheduledDeliveryTime ? scheduledDeliveryTime : 'Change'}
                  </button>
                </div>

                {!scheduledDeliveryTime ? (
                  <div className="text-xs text-stone-400 flex items-center justify-between bg-stone-900 p-2 rounded-xl">
                    <span>⚡ Standard Instant Express (25–35 min)</span>
                    <span className="text-emerald-400 font-bold">Fastest</span>
                  </div>
                ) : (
                  <div className="text-xs text-stone-300 flex items-center justify-between bg-stone-900 p-2 rounded-xl">
                    <span>📅 Scheduled for: {scheduledDeliveryTime}</span>
                    <button
                      onClick={() => setScheduledDeliveryTime(null)}
                      className="text-rose-400 text-[10px] hover:underline"
                    >
                      Reset ASAP
                    </button>
                  </div>
                )}

                {showSchedulePicker && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {['Today, 7:30 PM', 'Today, 8:45 PM', 'Today, 9:30 PM', 'Tomorrow, 1:00 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setScheduledDeliveryTime(slot);
                          setShowSchedulePicker(false);
                          showToast(`Order scheduled for ${slot}`, 'info');
                        }}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold text-center cursor-pointer"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Coupon / Promo Code Applicator */}
              <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Apply Coupon
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        showToast('Coupon removed', 'info');
                      }}
                      className="text-rose-400 hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Remove ({appliedCoupon})
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. CRAVE50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleApplyCoupon(couponInput)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Popular Codes */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['CRAVE50', 'FLAT75', 'BURGERLAB'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplyCoupon(c)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        appliedCoupon === c
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Partner Tip Selector */}
              <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Tip Your Delivery Partner
                  </span>
                  <span className="text-[10px] text-stone-400">100% goes to rider</span>
                </div>

                <div className="flex items-center space-x-2">
                  {[0, 20, 30, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDeliveryTip(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                        deliveryTip === amt
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-950'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      {amt === 0 ? 'None' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Itemized Bill Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Item Subtotal</span>
                  <span className="font-mono text-stone-200 font-semibold">₹{cartTotals.subtotal}</span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Coupon ({appliedCoupon})</span>
                    <span className="font-mono font-bold">-₹{cartTotals.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    {isFoodPlusMember && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black">
                        FOOD+ FREE
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-stone-200 font-semibold">
                    {cartTotals.deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${cartTotals.deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-stone-400">
                  <span>Platform Fee</span>
                  <span className="font-mono text-stone-200 font-semibold">₹{cartTotals.platformFee}</span>
                </div>

                <div className="flex justify-between text-stone-400">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-mono text-stone-200 font-semibold">₹{cartTotals.taxes}</span>
                </div>

                {cartTotals.tip > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Rider Tip</span>
                    <span className="font-mono font-bold">₹{cartTotals.tip}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-extrabold text-white">
                  <span>To Pay</span>
                  <span className="font-mono font-black text-amber-400 text-base">
                    ₹{cartTotals.grandTotal}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800">
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-between shadow-xl shadow-amber-500/20 transition active:scale-95 cursor-pointer"
            >
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-stone-900 block leading-none">
                  {cartTotals.itemCount} Items • Instant Order
                </span>
                <span className="font-mono font-black text-base">
                  ₹{cartTotals.grandTotal}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 font-bold">
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
