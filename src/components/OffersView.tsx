import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OFFERS_DATA } from '../data/mockData';
import { Tag, Copy, Check, Clock, Sparkles, ShoppingBag } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { setAppliedCoupon, appliedCoupon, showToast, setIsCartDrawerOpen } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApply = (code: string) => {
    setAppliedCoupon(code);
    showToast(`Coupon "${code}" applied to cart! 🎉`, 'success');
    setIsCartDrawerOpen(true);
  };

  const filteredOffers = OFFERS_DATA.filter((o) => {
    if (filterType === 'PERCENT') return o.discountType === 'PERCENT';
    if (filterType === 'FLAT') return o.discountType === 'FLAT';
    if (filterType === 'FREE') return o.discountType === 'FREE_DELIVERY';
    return true;
  });

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>EXCLUSIVE MARKETPLACE DEALS</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Offers & Promo Codes
          </h1>
          <p className="text-stone-400 text-sm">
            Save big on your favorite restaurants. Tap to apply instantly to your cart.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: 'All Deals', value: 'ALL' },
            { label: 'Percent Off', value: 'PERCENT' },
            { label: 'Flat Cash Off', value: 'FLAT' },
            { label: 'Free Delivery', value: 'FREE' }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                filterType === f.value
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const isApplied = appliedCoupon === offer.code;
            return (
              <div
                key={offer.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all duration-300 shadow-xl relative overflow-hidden ${
                  isApplied
                    ? 'bg-stone-900 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Visual badge top right */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-display font-black text-lg">
                    {offer.discountType === 'PERCENT' ? '%' : offer.discountType === 'FLAT' ? '₹' : '🛵'}
                  </div>

                  <span className="flex items-center space-x-1 text-[11px] text-stone-400">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>{offer.validTill}</span>
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl text-white">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {offer.description}
                  </p>
                  <p className="text-[11px] text-stone-500 pt-1">
                    Min order ₹{offer.minOrderValue} {offer.maxDiscount ? `• Max savings ₹${offer.maxDiscount}` : ''}
                  </p>
                </div>

                {/* Code box & Apply / Copy Button */}
                <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-sm tracking-wider text-amber-400">
                      {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === offer.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleApply(offer.code)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-500 text-stone-950 shadow-md'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
