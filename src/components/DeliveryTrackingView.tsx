import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Bike, 
  Store, 
  User, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  FileDown,
  Sparkles,
  X,
  RefreshCw,
  FastForward
} from 'lucide-react';

export const DeliveryTrackingView: React.FC = () => {
  const { activeOrder, setCurrentView, showToast, reorderOrder, advanceOrderProgress } = useApp();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Rider', text: 'Hi! I am reaching the restaurant now. Food is being packed fresh.', time: '8:48 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!activeOrder) {
    return (
      <div className="py-24 text-center text-white max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold font-display">No Active Orders</h2>
        <p className="text-stone-400 text-xs mt-2">Explore restaurants to order your next meal!</p>
        <button
          onClick={() => setCurrentView('restaurants')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm"
        >
          Discover Food
        </button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'You', text: chatInput, time: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'Rider', text: 'Got it! Handing it over carefully at your doorstep. Thanks!', time: 'Just now' }
      ]);
    }, 1500);
  };

  const handleCallRider = () => {
    showToast(`Calling delivery partner ${activeOrder.deliveryPartner?.name} (${activeOrder.deliveryPartner?.phone})...`, 'info');
  };

  const handleDownloadReceipt = () => {
    showToast(`Downloading digital tax invoice for Order #${activeOrder.id}...`, 'success');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  ORDER #{activeOrder.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  {activeOrder.status}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Live Delivery Radar
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-2 sm:gap-0">
            {/* Reorder Button */}
            <button
              id="reorder-live-btn"
              onClick={() => reorderOrder(activeOrder)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
              title="Add all items from this order back to your cart"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reorder Meal</span>
            </button>

            {/* Fast forward demo button */}
            <button
              onClick={() => advanceOrderProgress(activeOrder.id)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-xs font-semibold text-amber-300 cursor-pointer"
              title="Advance to next delivery milestone"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Stage</span>
            </button>

            <button
              onClick={handleDownloadReceipt}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-300 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Vector Map Simulation & Status Canvas */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl h-80 sm:h-96">
          {/* Simulated Dark Mode City Map Grid */}
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0c0a09" />
            <rect width="100%" height="100%" fill="url(#city-grid)" />
            
            {/* Road routes */}
            <path d="M 120 180 Q 250 120 420 170 T 750 140" fill="none" stroke="#44403c" strokeWidth="12" />
            <path d="M 120 180 Q 250 120 420 170 T 750 140" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
          </svg>

          {/* Restaurant Marker */}
          <div className="absolute top-28 left-12 sm:left-24 -translate-x-1/2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-500/40 ring-4 ring-amber-500/20">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white bg-stone-900/90 px-2.5 py-1 rounded-lg mt-1 border border-stone-800">
              {activeOrder.restaurantName}
            </span>
          </div>

          {/* Live Rider EV Animated Marker */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center shadow-xl shadow-emerald-500/50 ring-4 ring-emerald-400/30">
              <Bike className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </div>
            <span className="text-[11px] font-black text-emerald-300 bg-stone-900/95 px-2.5 py-0.5 rounded-lg mt-1 border border-emerald-500/40">
              Rider En Route (60 km/h)
            </span>
          </div>

          {/* Customer Doorstep Marker */}
          <div className="absolute top-24 right-12 sm:right-24 -translate-x-1/2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 ring-4 ring-rose-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white bg-stone-900/90 px-2.5 py-1 rounded-lg mt-1 border border-stone-800">
              {activeOrder.deliveryAddress.label} Doorstep
            </span>
          </div>

          {/* Live ETA Card overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 p-4 rounded-2xl bg-stone-950/90 border border-stone-800 backdrop-blur-xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Estimated Arrival
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {activeOrder.estimatedDeliveryAt}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 block">
                {activeOrder.status === 'DELIVERED' ? 'Arrived!' : 'On Schedule'}
              </span>
              <span className="text-[10px] text-stone-400">
                {activeOrder.deliveryOption === 'SCHEDULED' ? 'Scheduled Slot' : 'Instant 28-min Drop'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline with Dynamic Progress Animation */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Live Order Progress
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-400">Current Phase:</span>
              <span className="font-mono font-bold text-amber-400 uppercase">
                {activeOrder.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Animated Progress Meter & Courier Runner */}
          {(() => {
            const getPercent = () => {
              switch (activeOrder.status) {
                case 'PLACED': return 16;
                case 'ACCEPTED': return 32;
                case 'PREPARING': return 50;
                case 'RIDER_ASSIGNED': return 66;
                case 'PICKED_UP': return 80;
                case 'ON_THE_WAY': return 90;
                case 'ARRIVING': return 96;
                case 'DELIVERED': return 100;
                default: return 40;
              }
            };
            const percent = getPercent();

            return (
              <div className="relative pt-7 pb-2 px-1">
                {/* Background Rail */}
                <div className="h-2 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-800 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 transition-all duration-700 ease-out rounded-full relative"
                    style={{ width: `${percent}%` }}
                  >
                    {/* Shimmer light effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-pulse" />
                  </div>
                </div>

                {/* Traveling Courier Marker along Progress Track */}
                <div 
                  className="absolute top-0 transition-all duration-700 ease-out pointer-events-none -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${Math.max(4, Math.min(96, percent))}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/60 ring-2 ring-amber-300 animate-bounce">
                    <Bike className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-amber-400 mt-1 font-mono tracking-wider whitespace-nowrap bg-stone-950/90 px-1.5 py-0.5 rounded border border-amber-500/30">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Lifecycle Milestone Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {activeOrder.timeline.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                  step.completed
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-stone-950/50 border-stone-800 text-stone-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  {step.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-stone-700" />
                  )}
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${step.completed ? 'text-white' : 'text-stone-400'}`}>
                    {step.label}
                  </h4>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">{step.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rider Profile Card & Order Items Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rider Card */}
          {activeOrder.deliveryPartner && (
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Assigned Delivery Partner
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeOrder.deliveryPartner.photo}
                    alt={activeOrder.deliveryPartner.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {activeOrder.deliveryPartner.name}
                    </h4>
                    <p className="text-xs text-stone-400">
                      {activeOrder.deliveryPartner.vehicle} ({activeOrder.deliveryPartner.vehicleNumber})
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-amber-400 font-semibold mt-0.5">
                      <span>★ {activeOrder.deliveryPartner.rating}</span>
                      <span>•</span>
                      <span className="text-stone-400">{activeOrder.deliveryPartner.totalTrips}+ trips</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCallRider}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Rider</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Rider</span>
                </button>
              </div>
            </div>
          )}

          {/* Order Bill & Items */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Package Details & Instructions
              </h3>
              <button
                onClick={() => reorderOrder(activeOrder)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reorder Items</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeOrder.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center text-xs py-1 border-b border-stone-800/60">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold">{item.quantity}x</span>
                    <span className="text-stone-200 font-medium">{item.foodItem.name}</span>
                  </div>
                  <span className="font-mono text-white font-bold">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
              <span>Paid via {activeOrder.paymentMethod}</span>
              <span className="font-mono font-black text-amber-400 text-sm">
                Total Paid: ₹{activeOrder.totalAmount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Delivery Address:</span>
              <p className="text-stone-200 font-semibold mt-0.5">
                {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city}
              </p>
            </div>
          </div>
        </div>

        {/* Live Rider Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden flex flex-col h-[480px]">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeOrder.deliveryPartner?.photo}
                    alt="Rider"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-emerald-400"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeOrder.deliveryPartner?.name}</h4>
                    <span className="text-[10px] text-emerald-400">Active on road</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                        msg.sender === 'You'
                          ? 'bg-amber-500 text-stone-950 font-medium'
                          : 'bg-stone-800 text-stone-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-stone-800 flex space-x-2 bg-stone-950">
                <input
                  type="text"
                  placeholder="Type message to rider..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
