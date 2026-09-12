import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USER_ADDRESSES } from '../data/mockData';
import { UserAddress } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Check, 
  CreditCard, 
  Wallet, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  Clock, 
  FileText,
  Sparkles,
  Plus
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartRestaurant, 
    cartTotals, 
    createOrder, 
    setCurrentView, 
    walletBalance, 
    scheduledDeliveryTime 
  } = useApp();

  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(USER_ADDRESSES[0]);
  const [deliveryInstruction, setDeliveryInstruction] = useState('Leave at door');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'WALLET' | 'COD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center text-white max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold font-display">No items in your cart</h2>
        <p className="text-stone-400 text-xs mt-2">Add some mouth-watering food first!</p>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createOrder(paymentMethod, selectedAddress);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <button
            onClick={() => setCurrentView('restaurants')}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Secure Checkout
            </h1>
            <p className="text-xs text-stone-400">
              Ordering from <span className="text-amber-400 font-semibold">{cartRestaurant?.name}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Address */}
            <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  1. Select Delivery Address
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">GPS Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {USER_ADDRESSES.map((addr) => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white uppercase tracking-wider">
                            {addr.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-xs text-stone-300 font-medium line-clamp-1">
                          {addr.street}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {addr.area}, {addr.city}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery instructions tags */}
              <div className="pt-2 border-t border-stone-800/80">
                <span className="text-[11px] text-stone-400 font-medium block mb-2">
                  Rider Drop-off Instructions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Leave at door', 'Ring doorbell', 'Avoid calling', 'Leave with security'].map((inst) => (
                    <button
                      key={inst}
                      onClick={() => setDeliveryInstruction(inst)}
                      className={`px-3 py-1 rounded-xl text-xs transition cursor-pointer ${
                        deliveryInstruction === inst
                          ? 'bg-stone-800 text-amber-300 font-bold border border-amber-500/40'
                          : 'bg-stone-950 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  2. Choose Payment Mode
                </h3>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                </span>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'UPI'
                      ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Instant UPI (Recommended)</div>
                      <div className="text-[11px] text-stone-400">Google Pay • PhonePe • Paytm • Any UPI App</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'UPI' ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}>
                    {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                  </div>
                </div>

                {/* CraveWallet */}
                <div
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'WALLET'
                      ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">CraveWallet Instant 1-Tap</div>
                      <div className="text-[11px] text-amber-300 font-semibold font-mono">
                        Available Balance: ₹{walletBalance}
                      </div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'WALLET' ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}>
                    {paymentMethod === 'WALLET' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                  </div>
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'CARD'
                      ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Credit / Debit Card</div>
                      <div className="text-[11px] text-stone-400">Visa, Mastercard, RuPay, Amex</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'CARD' ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}>
                    {paymentMethod === 'CARD' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40'
                      : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Pay On Delivery (Cash / UPI at Door)</div>
                      <div className="text-[11px] text-stone-400">Pay when food reaches your hand</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}>
                    {paymentMethod === 'COD' && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Order Review
              </h3>

              {/* Items preview */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-400 font-bold">{item.quantity}x</span>
                      <span className="text-stone-200 font-medium line-clamp-1">{item.foodItem.name}</span>
                    </div>
                    <span className="font-mono text-white font-semibold shrink-0">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Price computation */}
              <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-200">₹{cartTotals.subtotal}</span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-₹{cartTotals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Delivery</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Platform & Taxes</span>
                  <span className="font-mono text-stone-200">₹{cartTotals.platformFee + cartTotals.taxes}</span>
                </div>
                {cartTotals.tip > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Rider Tip</span>
                    <span className="font-mono font-bold">₹{cartTotals.tip}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-800 flex justify-between text-base font-extrabold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-amber-400">₹{cartTotals.grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                    <span>Transmitting to Kitchen POS...</span>
                  </span>
                ) : (
                  <span>PAY ₹{cartTotals.grandTotal} & PLACE ORDER 🚀</span>
                )}
              </button>

              <div className="text-[11px] text-center text-stone-400">
                Guaranteed freshness & hot packaging by CraveVerse
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
