import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types';
import { 
  Store, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Package, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  AlertTriangle,
  RefreshCw,
  DollarSign
} from 'lucide-react';

export const RestaurantDashboard: React.FC = () => {
  const { 
    restaurantList, 
    updateRestaurantStock, 
    addMenuItemToRestaurant,
    showToast 
  } = useApp();

  const myRestaurant = restaurantList[0]; // Active kitchen partner
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'ai-supply'>('orders');

  // Simulated live orders queue for the kitchen
  const [liveOrders, setLiveOrders] = useState([
    {
      id: 'CRV-92401',
      customer: 'Priya Sharma',
      items: [
        { name: 'Double Truffle Smash Burger', qty: 2, notes: 'Extra crispy bacon, no pickle' },
        { name: 'Loaded Animal Fries', qty: 1, notes: 'Extra melt on side' }
      ],
      total: 847,
      placedTime: '4 mins ago',
      status: 'NEW' // NEW -> ACCEPTED -> PREPARING -> READY
    },
    {
      id: 'CRV-92388',
      customer: 'Rahul Verma',
      items: [
        { name: 'Classic Cheeseburger', qty: 1, notes: 'Medium rare smash' },
        { name: 'Smoked Vanilla Milkshake', qty: 1, notes: '' }
      ],
      total: 518,
      placedTime: '12 mins ago',
      status: 'PREPARING'
    }
  ]);

  // AI Supply Chain state
  const [supplyLoading, setSupplyLoading] = useState(false);
  const [supplyReport, setSupplyReport] = useState<any>({
    ingredientShortages: [
      { ingredient: 'Brioche Buns (4.5")', currentStock: '14 packs', reorderLevel: '20 packs', status: 'CRITICAL', supplier: 'Artisan Bakery Co.' },
      { ingredient: 'Aged Cheddar Slices', currentStock: '4.2 kg', reorderLevel: '5.0 kg', status: 'LOW', supplier: 'Dairy Fresh Direct' }
    ],
    rushPrediction: 'Expect peak surge between 8:30 PM – 10:15 PM (+45% volume vs yesterday)',
    prepRecommendations: [
      'Pre-portion 50x Angus smash patties into 110g balls for quick grill turnaround',
      'Batch caramelize 4kg of onions before 8:00 PM rush',
      'Restock fry station with seasoned truffle dust'
    ],
    wasteReductionTip: 'Shift 3kg of ripe avocados to avocado bacon burgers before tomorrow noon.'
  });

  // Add Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Chef Specials');
  const [newItemDiet, setNewItemDiet] = useState<'veg' | 'non-veg'>('veg');
  const [newItemDesc, setNewItemDesc] = useState('');

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setLiveOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    showToast(`Order #${orderId} status changed to ${nextStatus}!`, 'info');
  };

  const handleFetchAiSupply = async () => {
    setSupplyLoading(true);
    try {
      const res = await fetch('/api/ai/supply-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: myRestaurant.name,
          currentOrdersCount: liveOrders.length + 18,
          ingredients: ['Brioche Buns', 'Angus Beef', 'Truffle Mayo', 'Cheddar Cheese', 'Crispy Bacon']
        })
      });
      const data = await res.json();
      if (data && data.report) {
        setSupplyReport(data.report);
        showToast('AI Supply Chain analysis updated with live kitchen data! 🧠', 'success');
      }
    } catch (e) {
      showToast('Supply chain report refreshed', 'info');
    } finally {
      setSupplyLoading(false);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const newItem: FoodItem = {
      id: 'item-custom-' + Date.now(),
      restaurantId: myRestaurant.id,
      name: newItemName,
      description: newItemDesc || 'Freshly crafted daily kitchen special.',
      price: parseFloat(newItemPrice),
      diet: newItemDiet,
      category: newItemCategory,
      prepTimeMinutes: 15,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
      rating: 5.0,
      ratingCount: 1,
      isAvailable: true
    };

    addMenuItemToRestaurant(myRestaurant.id, newItem);
    setIsAddItemOpen(false);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Partner Header */}
        <div
  className="
    w-full
    overflow-hidden
    rounded-2xl
    border
    border-stone-800
    bg-stone-900
    shadow-xl
    sm:rounded-3xl
  "
>
  <div
    className="
      p-4
      sm:p-5
      lg:p-6
    "
  >
    {/* =====================================================
        RESTAURANT HEADER
    ====================================================== */}

    <div
      className="
        flex
        flex-col
        gap-5
        xl:flex-row
        xl:items-center
        xl:justify-between
      "
    >
      {/* Restaurant Identity */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
          sm:gap-4
        "
      >
        {/* Logo */}
        <div className="relative shrink-0">
          <img
            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuDdoqJqhLMcLOFgpwI-LENZX9Cjxq8nnptqYkjgC4zKeXSrabMvOgea-M&s=10"}
            alt={myRestaurant.name}
            referrerPolicy="no-referrer"
            className="
              h-14
              w-14
              rounded-xl
              border-2
              border-amber-500/40
              object-cover
              shadow-lg
              shadow-amber-500/5
              sm:h-16
              sm:w-16
              sm:rounded-2xl
            "
          />

          {/* Live indicator */}
          <span
            className="
              absolute
              -bottom-1
              -right-1
              flex
              h-4
              w-4
              items-center
              justify-center
              rounded-full
              border-2
              border-stone-900
              bg-emerald-500
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-stone-950" />
          </span>
        </div>

        {/* Restaurant Details */}
        <div className="min-w-0 flex-1">
          {/* Status Row */}
          <div
            className="
              mb-1.5
              flex
              flex-wrap
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-md
                bg-emerald-500/10
                px-2
                py-1
                text-[8px]
                font-black
                uppercase
                tracking-wide
                text-emerald-400
                sm:text-[9px]
              "
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Kitchen Active
            </span>

            <span
              className="
                hidden
                h-1
                w-1
                rounded-full
                bg-stone-700
                sm:block
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                text-stone-500
                sm:text-[10px]
              "
            >
              Terminal #04
            </span>

            <span
              className="
                hidden
                text-stone-700
                sm:inline
              "
            >
              •
            </span>

            <span
              className="
                text-[9px]
                font-medium
                text-stone-500
                sm:text-[10px]
              "
            >
              Indiranagar Hub
            </span>
          </div>

          {/* Restaurant Name */}
          <h1
            className="
              max-w-full
              truncate
              font-display
              text-lg
              font-black
              leading-tight
              tracking-tight
              text-white
              sm:text-2xl
              lg:text-3xl
            "
            title={`${myRestaurant.name} — Kitchen Command`}
          >
            {myRestaurant.name}
            <span className="hidden text-stone-600 sm:inline">
              {' '}
              —
            </span>

            <span className="block text-stone-300 sm:inline">
              {' '}
              Kitchen Command
            </span>
          </h1>

          {/* Mobile terminal information */}
          <p
            className="
              mt-1
              text-[9px]
              text-stone-600
              sm:hidden
            "
          >
            Live POS • Terminal #04 • Indiranagar Hub
          </p>
        </div>
      </div>


      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <div
        className="
          grid
          w-full
          grid-cols-3
          divide-x
          divide-stone-800
          overflow-hidden
          rounded-xl
          border
          border-stone-800
          bg-stone-950/70
          xl:w-auto
          xl:min-w-[480px]
          xl:rounded-2xl
        "
      >
        {/* Revenue */}
        <div
          className="
            min-w-0
            px-2.5
            py-3
            sm:px-4
            sm:py-3.5
          "
        >
          <div
            className="
              truncate
              font-mono
              text-sm
              font-black
              text-white
              sm:text-lg
              lg:text-xl
            "
          >
            ₹42,850
          </div>

          <div
            className="
              mt-0.5
              truncate
              text-[7px]
              font-medium
              text-stone-500
              sm:text-[9px]
            "
          >
            Today's Gross
          </div>
        </div>


        {/* Orders */}
        <div
          className="
            min-w-0
            px-2.5
            py-3
            sm:px-4
            sm:py-3.5
          "
        >
          <div
            className="
              truncate
              font-mono
              text-sm
              font-black
              text-amber-400
              sm:text-lg
              lg:text-xl
            "
          >
            64
            <span
              className="
                ml-1
                text-[8px]
                font-bold
                text-stone-500
                sm:text-[10px]
              "
            >
              Orders
            </span>
          </div>

          <div
            className="
              mt-0.5
              truncate
              text-[7px]
              font-medium
              text-stone-500
              sm:text-[9px]
            "
          >
            Completed
          </div>
        </div>


        {/* Prep Speed */}
        <div
          className="
            min-w-0
            px-2.5
            py-3
            sm:px-4
            sm:py-3.5
          "
        >
          <div
            className="
              truncate
              font-mono
              text-sm
              font-black
              text-emerald-400
              sm:text-lg
              lg:text-xl
            "
          >
            14.2
            <span
              className="
                ml-0.5
                text-[8px]
                font-bold
                text-emerald-400/70
                sm:text-[10px]
              "
            >
              min
            </span>
          </div>

          <div
            className="
              mt-0.5
              truncate
              text-[7px]
              font-medium
              text-stone-500
              sm:text-[9px]
            "
          >
            Avg Prep Speed
          </div>
        </div>
      </div>
    </div>
  </div>


  {/* =====================================================
      LIVE POS STATUS BAR
  ====================================================== */}

  <div
    className="
      flex
      flex-col
      gap-2
      border-t
      border-stone-800
      bg-stone-950/40
      px-4
      py-2.5
      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:px-5
      lg:px-6
    "
  >
    <div
      className="
        flex
        items-center
        gap-2
        text-[8px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-stone-600
        sm:text-[9px]
      "
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      </span>

      Live POS Connected
    </div>

    <div
      className="
        flex
        items-center
        gap-2
        text-[8px]
        text-stone-600
        sm:text-[9px]
      "
    >
      <span>Orders syncing automatically</span>

      <span className="h-1 w-1 rounded-full bg-stone-700" />

      <span className="font-mono text-emerald-500/70">
        SYNCED
      </span>
    </div>
  </div>
</div>

        {/* Navigation Tabs */}
        <div
  className="
    border-b
    border-stone-800
    pb-3
  "
>
  <div
    className="
      flex
      w-full
      gap-2
      overflow-x-auto
      overscroll-x-contain
      pb-1
      scrollbar-none
      sm:gap-3
    "
  >
    {/* =====================================================
        LIVE KITCHEN KDS
    ====================================================== */}

    <button
      type="button"
      onClick={() => setActiveTab('orders')}
      className={`
        flex
        min-h-[42px]
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-xl
        px-3
        py-2
        text-[10px]
        font-bold
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        sm:px-4
        sm:text-xs
        ${
          activeTab === 'orders'
            ? `
              bg-amber-500
              text-stone-950
              shadow-md
              shadow-amber-500/10
            `
            : `
              border
              border-stone-800
              bg-stone-900
              text-stone-300
              hover:bg-stone-800
              hover:text-white
            `
        }
      `}
    >
      <Clock
        className={`
          h-4
          w-4
          shrink-0
          ${
            activeTab === 'orders'
              ? 'text-stone-950'
              : 'text-stone-400'
          }
        `}
      />

      <span>
        Live Kitchen KDS
      </span>

      <span
        className={`
          ml-0.5
          rounded-md
          px-1.5
          py-0.5
          text-[9px]
          font-black
          ${
            activeTab === 'orders'
              ? 'bg-stone-950/10 text-stone-950'
              : 'bg-stone-800 text-stone-400'
          }
        `}
      >
        {liveOrders.length}
      </span>
    </button>


    {/* =====================================================
        MENU & STOCK
    ====================================================== */}

    <button
      type="button"
      onClick={() => setActiveTab('inventory')}
      className={`
        flex
        min-h-[42px]
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-xl
        px-3
        py-2
        text-[10px]
        font-bold
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        sm:px-4
        sm:text-xs
        ${
          activeTab === 'inventory'
            ? `
              bg-amber-500
              text-stone-950
              shadow-md
              shadow-amber-500/10
            `
            : `
              border
              border-stone-800
              bg-stone-900
              text-stone-300
              hover:bg-stone-800
              hover:text-white
            `
        }
      `}
    >
      <Package
        className={`
          h-4
          w-4
          shrink-0
          ${
            activeTab === 'inventory'
              ? 'text-stone-950'
              : 'text-stone-400'
          }
        `}
      />

      <span>
        Menu & Stock
      </span>

      <span
        className={`
          ml-0.5
          rounded-md
          px-1.5
          py-0.5
          text-[9px]
          font-black
          ${
            activeTab === 'inventory'
              ? 'bg-stone-950/10 text-stone-950'
              : 'bg-stone-800 text-stone-400'
          }
        `}
      >
        86'er
      </span>
    </button>


    {/* =====================================================
        AI SUPPLY CHAIN
    ====================================================== */}

    <button
      type="button"
      onClick={() => setActiveTab('ai-supply')}
      className={`
        flex
        min-h-[42px]
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-xl
        border
        px-3
        py-2
        text-[10px]
        font-bold
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        sm:px-4
        sm:text-xs
        ${
          activeTab === 'ai-supply'
            ? `
              border-purple-500/40
              bg-purple-600
              text-white
              shadow-md
              shadow-purple-600/10
            `
            : `
              border-stone-800
              bg-stone-900
              text-purple-300
              hover:bg-stone-800
              hover:text-purple-200
            `
        }
      `}
    >
      <Sparkles
        className={`
          h-4
          w-4
          shrink-0
          ${
            activeTab === 'ai-supply'
              ? 'text-white'
              : 'text-purple-400'
          }
        `}
      />

      <span>
        AI Supply Chain & Prep
      </span>
    </button>
  </div>
</div>
        {/* TAB 1: LIVE ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Orders automatically sync from customer apps</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Sync Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono font-black text-amber-400">
                          {ord.id}
                        </span>
                        <h3 className="font-bold text-base text-white">{ord.customer}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                        ord.status === 'NEW'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : ord.status === 'PREPARING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-b border-stone-800 py-3 text-xs">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-white">{it.qty}x {it.name}</span>
                            {it.notes && (
                              <p className="text-[11px] text-amber-300 italic">{it.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Placed {ord.placedTime}</span>
                      <span className="font-mono font-bold text-white">Bill: ₹{ord.total}</span>
                    </div>
                  </div>

                  {/* KDS Action Buttons */}
                  <div className="pt-2 flex space-x-2">
                    {ord.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
                      >
                        Accept & Fire to Kitchen 🔥
                      </button>
                    )}
                    {ord.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'READY')}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs cursor-pointer"
                      >
                        Mark Ready for Courier Handover 📦
                      </button>
                    )}
                    {ord.status === 'READY' && (
                      <div className="w-full py-2 rounded-xl bg-stone-800 text-emerald-300 text-xs font-bold text-center">
                        ✓ Dispatched with Rider Vikram
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">Live Menu Items ({myRestaurant.menuItems.length})</h3>
                <p className="text-xs text-stone-400">Instant toggle out-of-stock (86) to protect order delivery ratings</p>
              </div>

              <button
                onClick={() => setIsAddItemOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRestaurant.menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{dish.name}</h4>
                      <span className="font-mono text-amber-400 font-bold text-xs">₹{dish.price}</span>
                      <p className="text-[11px] text-stone-400 line-clamp-1">{dish.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                    <span className="text-xs font-semibold text-stone-300">
                      Availability:
                    </span>
                    <button
                      onClick={() => updateRestaurantStock(myRestaurant.id, dish.id, !dish.isAvailable)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        dish.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock (Live)' : 'Out of Stock (86)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Dish Modal */}
            {isAddItemOpen && (
              <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-6 space-y-4 shadow-2xl">
                  <h3 className="font-bold text-lg text-white">Add New Signature Dish</h3>
                  <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
                    <div>
                      <label className="text-stone-400 block mb-1">Dish Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smoky Truffle Mac & Cheese"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-stone-400 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          required
                          placeholder="399"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Diet</label>
                        <select
                          value={newItemDiet}
                          onChange={(e) => setNewItemDiet(e.target.value as any)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="veg">Pure Veg</option>
                          <option value="non-veg">Non-Veg</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-stone-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Describe secret sauce, cooking technique..."
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="pt-3 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsAddItemOpen(false)}
                        className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-black"
                      >
                        Publish to Live App
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI SUPPLY CHAIN & DEMAND FORECASTING */}
        {activeTab === 'ai-supply' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-stone-900 to-stone-900 border border-purple-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini 2.5 Kitchen Intelligence</span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-white">
                    Predictive Supply Chain & Prep Optimizer
                  </h3>
                  <p className="text-xs text-stone-400">
                    Real-time demand forecasting based on local weather, footfall and current order velocities.
                  </p>
                </div>

                <button
                  onClick={handleFetchAiSupply}
                  disabled={supplyLoading}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${supplyLoading ? 'animate-spin' : ''}`} />
                  <span>Run Live AI Audit</span>
                </button>
              </div>

              {/* Peak Rush Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-xs text-amber-300">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="font-semibold">{supplyReport.rushPrediction}</span>
              </div>

              {/* Grid: Shortages & Prep Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Shortages */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Reorder Alerts & Low Stock
                  </h4>

                  <div className="space-y-2.5">
                    {supplyReport.ingredientShortages?.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{item.ingredient}</span>
                          <span className="text-[11px] text-stone-400">
                            Current: {item.currentStock} • Safe Min: {item.reorderLevel}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prep Recommendations */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Batch Prep Directives (Save 6 mins/order)
                  </h4>

                  <ul className="space-y-2 text-xs text-stone-300">
                    {supplyReport.prepRecommendations?.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>

                  {supplyReport.wasteReductionTip && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
                      💡 <strong>Zero-Waste Tip:</strong> {supplyReport.wasteReductionTip}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
