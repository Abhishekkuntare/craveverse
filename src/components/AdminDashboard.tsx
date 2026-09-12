import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Store, 
  Bike, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Activity,
  AlertCircle,
  DollarSign,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [pendingRestaurants, setPendingRestaurants] = useState([
    { id: 'appr-1', name: 'Artisan Sourdough & Gelato', owner: 'Chef Marco', cuisine: 'Bakery & Gelato', area: 'Koramangala 4th Block', fssai: '21223344000182' },
    { id: 'appr-2', name: 'Naga Bamboo Smokehouse', owner: 'Aonok Jamir', cuisine: 'Northeastern & Smoked Meats', area: 'Kammanahalli', fssai: '21223344000994' }
  ]);

  const handleApprove = (id: string, name: string) => {
    setPendingRestaurants((prev) => prev.filter((r) => r.id !== id));
    showToast(`Restaurant "${name}" approved and live on CraveVerse marketplace! 🎉`, 'success');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUPERADMIN COMMAND CENTER</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              CraveVerse Platform Telemetry
            </h1>
            <p className="text-xs text-stone-400">
              Real-time monitoring across consumer orders, restaurant kitchen partners & rider fleet.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-bold">All 14 Microservices Operational</span>
          </div>
        </div>

        {/* Top KPI Cards */}
      <div
  className="
    grid
    grid-cols-1
    gap-3
    sm:grid-cols-2
    sm:gap-4
    xl:grid-cols-4
  "
>
  {/* =====================================================
      MARKETPLACE GMV
  ====================================================== */}

  <div
    className="
      min-w-0
      overflow-hidden
      rounded-2xl
      border
      border-stone-800
      bg-stone-900
      p-4
      shadow-lg
      shadow-black/5
      transition
      hover:border-stone-700
      sm:rounded-3xl
      sm:p-5
    "
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className="
          min-w-0
          text-[10px]
          font-semibold
          leading-relaxed
          text-stone-400
          sm:text-xs
        "
      >
        Today's Marketplace GMV
      </span>

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-emerald-500/10
        "
      >
        <TrendingUp className="h-4 w-4 text-emerald-400" />
      </div>
    </div>

    <div
      className="
        mt-3
        truncate
        font-display
        text-2xl
        font-black
        tracking-tight
        text-white
        sm:text-3xl
      "
    >
      ₹1,420,800
    </div>

    <div
      className="
        mt-1.5
        flex
        items-center
        gap-1
        text-[9px]
        font-bold
        text-emerald-400
        sm:text-[11px]
      "
    >
      <TrendingUp className="h-3 w-3 shrink-0" />

      <span className="truncate">
        +24.2% vs yesterday
      </span>
    </div>
  </div>


  {/* =====================================================
      NET PLATFORM REVENUE
  ====================================================== */}

  <div
    className="
      min-w-0
      overflow-hidden
      rounded-2xl
      border
      border-stone-800
      bg-stone-900
      p-4
      shadow-lg
      shadow-black/5
      transition
      hover:border-stone-700
      sm:rounded-3xl
      sm:p-5
    "
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className="
          min-w-0
          text-[10px]
          font-semibold
          leading-relaxed
          text-stone-400
          sm:text-xs
        "
      >
        Net Platform Revenue (15%)
      </span>

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-amber-500/10
        "
      >
        <DollarSign className="h-4 w-4 text-amber-400" />
      </div>
    </div>

    <div
      className="
        mt-3
        truncate
        font-display
        text-2xl
        font-black
        tracking-tight
        text-amber-400
        sm:text-3xl
      "
    >
      ₹213,120
    </div>

    <p
      className="
        mt-1.5
        truncate
        text-[9px]
        font-medium
        text-stone-500
        sm:text-[11px]
      "
    >
      Includes commissions & ads
    </p>
  </div>


  {/* =====================================================
      LIVE ORDERS
  ====================================================== */}

  <div
    className="
      min-w-0
      overflow-hidden
      rounded-2xl
      border
      border-stone-800
      bg-stone-900
      p-4
      shadow-lg
      shadow-black/5
      transition
      hover:border-stone-700
      sm:rounded-3xl
      sm:p-5
    "
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className="
          min-w-0
          text-[10px]
          font-semibold
          leading-relaxed
          text-stone-400
          sm:text-xs
        "
      >
        Live Orders in Flight
      </span>

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-rose-500/10
        "
      >
        <Clock className="h-4 w-4 text-rose-400" />
      </div>
    </div>

    <div
      className="
        mt-3
        truncate
        font-display
        text-2xl
        font-black
        tracking-tight
        text-rose-400
        sm:text-3xl
      "
    >
      142
      <span
        className="
          ml-1
          text-[10px]
          font-bold
          text-rose-400/70
          sm:text-sm
        "
      >
        Orders
      </span>
    </div>

    <div
      className="
        mt-1.5
        flex
        items-center
        gap-1.5
        truncate
        text-[9px]
        font-medium
        text-stone-500
        sm:text-[11px]
      "
    >
      <Clock className="h-3 w-3 shrink-0" />

      <span className="truncate">
        Avg delivery ETA: 24.8 mins
      </span>
    </div>
  </div>


  {/* =====================================================
      ACTIVE COURIER FLEET
  ====================================================== */}

  <div
    className="
      min-w-0
      overflow-hidden
      rounded-2xl
      border
      border-stone-800
      bg-stone-900
      p-4
      shadow-lg
      shadow-black/5
      transition
      hover:border-stone-700
      sm:rounded-3xl
      sm:p-5
    "
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className="
          min-w-0
          text-[10px]
          font-semibold
          leading-relaxed
          text-stone-400
          sm:text-xs
        "
      >
        Active Courier Fleet
      </span>

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-emerald-500/10
        "
      >
        <Bike className="h-4 w-4 text-emerald-400" />
      </div>
    </div>

    <div
      className="
        mt-3
        truncate
        font-display
        text-2xl
        font-black
        tracking-tight
        text-emerald-400
        sm:text-3xl
      "
    >
      184
      <span
        className="
          ml-1
          text-[10px]
          font-bold
          text-emerald-400/70
          sm:text-sm
        "
      >
        Riders
      </span>
    </div>

    <div
      className="
        mt-1.5
        flex
        items-center
        gap-1.5
        text-[9px]
        font-semibold
        text-emerald-400
        sm:text-[11px]
      "
    >
      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />

      94% EV Utilization
    </div>
  </div>
</div>

        {/* Real-time Hourly Order Curve & Cuisine Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">
                Hourly Order Velocity (Today)
              </h3>
              <span className="text-xs text-stone-400">Peak hour: 8:45 PM (480 orders/hr)</span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="w-full min-w-0">
  {/* Chart */}
  <div className="relative">
    {/* Y-axis guide lines */}
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
      {[100, 75, 50, 25, 0].map((value) => (
        <div key={value} className="flex items-center gap-2">
          <span className="w-7 shrink-0 text-right text-[8px] font-mono text-stone-600">
            {value}
          </span>

          <div className="h-px flex-1 bg-stone-800/70" />
        </div>
      ))}
    </div>

    {/* Scrollable chart area */}
    <div className="relative overflow-x-auto overscroll-x-contain pb-1 scrollbar-none">
      <div
        className="
          flex h-52 min-w-[720px] items-end
          gap-2 px-1 pt-4
          sm:min-w-0 sm:gap-2.5 sm:px-2
        "
      >
        {[
          { time: "11 AM", val: 30 },
          { time: "12 PM", val: 65 },
          { time: "1 PM", val: 88 },
          { time: "2 PM", val: 72 },
          { time: "3 PM", val: 40 },
          { time: "4 PM", val: 32 },
          { time: "5 PM", val: 45 },
          { time: "6 PM", val: 58 },
          { time: "7 PM", val: 76 },
          { time: "8 PM", val: 100 },
          { time: "9 PM", val: 94 },
          { time: "10 PM", val: 82 },
          { time: "11 PM", val: 50 },
        ].map((bar, i) => (
          <div
            key={bar.time}
            className="
              group flex h-full min-w-[42px] flex-1
              flex-col items-center justify-end
              gap-2
            "
          >
            {/* Value */}
            <span
              className="
                text-[9px] font-semibold font-mono
                text-stone-500
                opacity-0 transition-opacity
                group-hover:opacity-100
              "
            >
              {bar.val * 4}
            </span>

            {/* Bar */}
            <div className="flex h-[calc(100%-28px)] w-full items-end">
              <div
                className="
                  relative w-full
                  rounded-t-lg
                  bg-gradient-to-t from-amber-500 via-orange-500 to-rose-500
                  shadow-[0_0_18px_rgba(251,146,60,0.12)]
                  transition-all duration-300
                  group-hover:brightness-125
                  group-hover:shadow-[0_0_22px_rgba(251,146,60,0.25)]
                "
                style={{
                  height: `${Math.max(bar.val, 8)}%`,
                }}
                title={`${bar.val * 4} orders at ${bar.time}`}
              >
                {/* Highlight */}
                <div
                  className="
                    absolute inset-x-0 top-0
                    h-px rounded-full
                    bg-white/50
                  "
                />
              </div>
            </div>

            {/* Time */}
            <span
              className="
                w-full truncate text-center
                text-[8px] font-mono
                text-stone-500
                sm:text-[9px]
              "
            >
              {bar.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Mobile scroll hint */}
  <div className="mt-2 flex items-center justify-center sm:hidden">
    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-600">
      ← Swipe to view all hours →
    </span>
  </div>
</div>
          </div>

          {/* Cuisine Share */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              Cuisine Market Share
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Burgers & Sandwiches', pct: '28%', color: 'bg-amber-500' },
                { label: 'Woodfired Pizza', pct: '24%', color: 'bg-rose-500' },
                { label: 'Dum Biryani & North Indian', pct: '20%', color: 'bg-orange-500' },
                { label: 'Asian, Ramen & Momos', pct: '16%', color: 'bg-purple-500' },
                { label: 'Healthy & Desserts', pct: '12%', color: 'bg-emerald-500' }
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-stone-300">
                    <span>{c.label}</span>
                    <span className="font-bold text-white font-mono">{c.pct}</span>
                  </div>
                  <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: c.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Approval Pipeline */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                New Kitchen Onboarding Pipeline ({pendingRestaurants.length})
              </h3>
              <p className="text-xs text-stone-400">
                Review hygiene certifications, FSSAI compliance and menu pricing.
              </p>
            </div>
          </div>

          {pendingRestaurants.length === 0 ? (
            <div className="text-xs text-stone-400 py-4 text-center">
              All incoming restaurant applications reviewed and processed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRestaurants.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">{r.name}</h4>
                    <p className="text-xs text-stone-400">
                      Owner: <span className="text-stone-300 font-medium">{r.owner}</span> • Area: {r.area}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-amber-400">
                      <span>Cuisine: {r.cuisine}</span>
                      <span>•</span>
                      <span className="font-mono">FSSAI: {r.fssai}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(r.id, r.name)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Publish Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
