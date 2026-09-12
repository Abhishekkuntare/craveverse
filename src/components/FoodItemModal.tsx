import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCustomizationOption } from '../types';
import { X, Check, Flame, Plus, Minus, ShoppingBag } from 'lucide-react';

export const FoodItemModal: React.FC = () => {
  const { selectedFoodItem, setSelectedFoodItem, addToCart } = useApp();

  const [selectedCustomizations, setSelectedCustomizations] = useState<{
    [groupId: string]: FoodCustomizationOption[];
  }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!selectedFoodItem) return null;

  // Initialize defaults if empty
  const handleToggleOption = (groupId: string, option: FoodCustomizationOption, isSingleChoice: boolean) => {
    setSelectedCustomizations((prev) => {
      const currentList = prev[groupId] || [];
      if (isSingleChoice) {
        return { ...prev, [groupId]: [option] };
      } else {
        const exists = currentList.some((o) => o.id === option.id);
        const updated = exists
          ? currentList.filter((o) => o.id !== option.id)
          : [...currentList, option];
        return { ...prev, [groupId]: updated };
      }
    });
  };

  // Calculate dynamic unit price
  let addOnTotal = 0;
  (Object.values(selectedCustomizations) as any[]).forEach((opts: any) => {
    if (Array.isArray(opts)) {
      opts.forEach((o: any) => (addOnTotal += (o.price || 0)));
    }
  });
  const unitPrice = selectedFoodItem.price + addOnTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirmAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedFoodItem, selectedCustomizations, specialInstructions);
    }
    setSelectedFoodItem(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedFoodItem(null)}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Dish Hero */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-800">
          <img
            src={selectedFoodItem.image}
            alt={selectedFoodItem.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

          <button
            onClick={() => setSelectedFoodItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${
                selectedFoodItem.diet === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
              <span className="text-[11px] font-bold text-stone-300 uppercase">
                {selectedFoodItem.diet}
              </span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
              {selectedFoodItem.name}
            </h2>
            <p className="text-xs text-stone-300 line-clamp-2 mt-0.5">
              {selectedFoodItem.description}
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-6">
          {selectedFoodItem.customizations && selectedFoodItem.customizations.length > 0 ? (
            selectedFoodItem.customizations.map((group) => {
              const selectedInGroup = selectedCustomizations[group.id] || [];
              const isSingleChoice = group.maxSelection === 1;

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{group.name}</h4>
                      <p className="text-[11px] text-stone-400">
                        {group.required ? 'Required • ' : 'Optional • '}
                        {isSingleChoice ? 'Choose 1' : `Up to ${group.maxSelection || 'multiple'}`}
                      </p>
                    </div>
                    {group.required && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isChecked = selectedInGroup.some((o) => o.id === opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleToggleOption(group.id, opt, isSingleChoice)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            isChecked
                              ? 'bg-amber-500/10 border-amber-500/60 text-white'
                              : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded ${isSingleChoice ? 'rounded-full' : 'rounded'} border flex items-center justify-center ${
                              isChecked ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-600'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">{opt.name}</span>
                          </div>

                          <span className="text-xs font-mono font-bold text-amber-400">
                            {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-stone-400 py-2">
              Standard chef preparation without additional modifications.
            </div>
          )}

          {/* Cooking Instructions note */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <label className="text-xs font-bold text-stone-300 block">
              Special Instructions for the Kitchen (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy, no onions, cutlery needed..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Add Item</span>
            </span>
            <span className="font-mono font-black">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
