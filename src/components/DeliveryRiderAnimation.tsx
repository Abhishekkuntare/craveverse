// import React, { useState, useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { useApp } from '../context/AppContext';
// import { playBicycleBellSound } from '../utils/audioEffects';
// import { 
//   Bell, 
//   Zap, 
//   Sparkles, 
//   Compass, 
//   X, 
//   Volume2, 
//   VolumeX, 
//   ChevronRight,
//   Pin,
//   Play
// } from 'lucide-react';

// const MESSAGES = [
//   "Hot food & iced lattes on the way! ☕🍕",
//   "Zooming across the city in 18 minutes! ⚡",
//   "Fresh roast from The Local Bean arriving! 🚴💨",
//   "Zero emissions, 100% swift cravings delivered! 🌱",
//   "Next stop: your neighborhood cravings! 🌟"
// ];

// export const DeliveryRiderAnimation: React.FC = () => {
//   const { cart, setCurrentView } = useApp();
//   const riderContainerRef = useRef<HTMLDivElement>(null);
//   const bikeRef = useRef<HTMLDivElement>(null);
//   const travelTweenRef = useRef<gsap.core.Tween | null>(null);

//   const [isTurbo, setIsTurbo] = useState(false);
//   const [isDocked, setIsDocked] = useState(false);
//   const [speechBubble, setSpeechBubble] = useState<string | null>(null);
//   const [activeMessageIndex, setActiveMessageIndex] = useState(0);
//   const [showControls, setShowControls] = useState(false);
//   const [soundEnabled, setSoundEnabled] = useState(true);

//   // Set up continuous riding across screen using GSAP
//   useEffect(() => {
//     if (!bikeRef.current || isDocked) return;

//     const calculateAnimation = () => {
//       const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
//       const isMobile = screenWidth < 768;
//       const startX = isMobile ? -140 : -220;
//       const endX = screenWidth + (isMobile ? 140 : 220);
//       const totalDistance = endX - startX;

//       // Ensure smooth, lively pace across mobile & desktop
//       // Mobile crosses in ~8s (normal) or ~3.8s (turbo)
//       // Desktop crosses in ~14s (normal) or ~6s (turbo)
//       const pxPerSec = isTurbo ? (isMobile ? 220 : 260) : (isMobile ? 100 : 130);
//       const duration = Math.max(isTurbo ? 3.2 : 6.5, totalDistance / pxPerSec);

//       // Smooth entrance on first run so user doesn't wait offscreen
//       travelTweenRef.current?.kill();
//       travelTweenRef.current = gsap.fromTo(
//         bikeRef.current,
//         { x: startX },
//         {
//           x: endX,
//           duration: duration,
//           ease: 'none',
//           repeat: -1,
//           onRepeat: () => {
//             setActiveMessageIndex((prev) => (prev + 1) % MESSAGES.length);
//           }
//         }
//       );
//     };

//     calculateAnimation();

//     // Natural subtle vertical pedaling cadence bob
//     const bobTween = gsap.to('.delivery-cyclist-body', {
//       y: -3,
//       duration: isTurbo ? 0.18 : 0.36,
//       repeat: -1,
//       yoyo: true,
//       ease: 'sine.inOut'
//     });

//     const handleResize = () => {
//       calculateAnimation();
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       travelTweenRef.current?.kill();
//       bobTween.kill();
//     };
//   }, [isTurbo, isDocked]);

//   // Click handler: Wheelie stunt + bicycle bell sound + pop speech bubble
//   const handleRiderClick = () => {
//     if (soundEnabled) {
//       playBicycleBellSound();
//     }

//     // Wheelie stunt animation with GSAP
//     if (bikeRef.current) {
//       gsap.timeline()
//         .to(bikeRef.current, {
//           rotation: -22,
//           y: -16,
//           duration: 0.28,
//           ease: 'back.out(2)'
//         })
//         .to(bikeRef.current, {
//           rotation: 0,
//           y: 0,
//           duration: 0.45,
//           ease: 'bounce.out'
//         });
//     }

//     // Display speech bubble
//     const customMessage = cart.length > 0 
//       ? `Rush delivery! ${cart.length} signature items in transit! 🛵` 
//       : MESSAGES[activeMessageIndex];

//     setSpeechBubble(customMessage);

//     // Auto-dismiss bubble after 3.5 seconds
//     setTimeout(() => {
//       setSpeechBubble((current) => (current === customMessage ? null : current));
//     }, 3800);
//   };

//   const toggleTurbo = () => {
//     setIsTurbo((prev) => !prev);
//     if (soundEnabled) {
//       playBicycleBellSound();
//     }
//   };

//   const toggleDock = () => {
//     setIsDocked((prev) => {
//       const next = !prev;
//       if (next && bikeRef.current) {
//         gsap.to(bikeRef.current, { x: 0, y: 0, rotation: 0, duration: 0.5 });
//       }
//       return next;
//     });
//   };

//   return (
//     <>
//       {/* Dedicated Mobile Quick-Action Pill for Bicycle Boy (Always visible & accessible on mobile) */}
//       <div className="lg:hidden fixed bottom-16 right-3 z-40 pointer-events-auto flex items-center space-x-1 bg-stone-900/90 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-full shadow-xl">
//         <button
//           onClick={handleRiderClick}
//           className="flex items-center space-x-1 text-[11px] font-bold text-amber-300 active:scale-95 transition"
//           title="Ring bell & do wheelie"
//         >
//           <span>🚴</span>
//           <span>Bell & Stunt</span>
//         </button>
//         <span className="text-stone-600">|</span>
//         <button
//           onClick={toggleTurbo}
//           className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition ${
//             isTurbo ? 'bg-rose-500 text-white animate-pulse' : 'text-stone-400'
//           }`}
//           title="Toggle Turbo Speed"
//         >
//           {isTurbo ? 'TURBO ON' : 'Turbo'}
//         </button>
//       </div>

//       <div 
//         ref={riderContainerRef} 
//         className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-30 pointer-events-none select-none overflow-hidden h-24 sm:h-28 lg:h-32"
//       >
//         {/* Mini ground asphalt lane with dashed animated markings */}
//         <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent border-b border-amber-500/20">
//           <div className="w-full h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0" />
//         </div>

//         {/* DOCKED MODE CORNER BADGE (If user chooses to park him) */}
//         {isDocked ? (
//           <div className="absolute bottom-4 right-4 pointer-events-auto flex items-center gap-2 bg-stone-900/95 backdrop-blur-md p-2.5 rounded-2xl border border-amber-500/40 shadow-2xl">
//             <div 
//               onClick={handleRiderClick}
//               className="cursor-pointer group flex items-center space-x-3"
//               title="Click to ring bell & do a wheelie!"
//             >
//               <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
//                 <span className="text-xl">🚴</span>
//               </div>
//               <div className="text-left">
//                 <div className="flex items-center space-x-1.5">
//                   <span className="text-xs font-bold text-white">Crave Courier #42</span>
//                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
//                 </div>
//                 <span className="text-[10px] text-amber-400 font-mono">18 Min Fleet Active</span>
//               </div>
//             </div>

//             <button
//               onClick={toggleDock}
//               className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer flex items-center space-x-1"
//               title="Release to ride across website continuously"
//             >
//               <Play className="w-3.5 h-3.5 fill-current" />
//               <span>Ride Free</span>
//             </button>
//           </div>
//         ) : (
//           /* CONTINUOUS BICYCLE RIDER CRUISING ACROSS ENTIRE WEBSITE */
//           <div 
//             ref={bikeRef}
//             className="absolute bottom-1 pointer-events-auto flex flex-col items-center cursor-pointer group"
//             onClick={handleRiderClick}
//             onTouchStart={handleRiderClick}
//             onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//             title="Delivery Boy on Duty — Click for Bicycle Bell & Wheelie Stunt!"
//             style={{ willChange: 'transform' }}
//           >
//           {/* Interactive Speech Bubble */}
//           {speechBubble && (
//             <div className="relative mb-2 px-3.5 py-1.5 rounded-2xl bg-stone-900/95 backdrop-blur-md border border-amber-500/60 shadow-2xl text-white text-xs font-medium flex items-center space-x-2 animate-bounce whitespace-nowrap">
//               <span className="text-amber-400 font-bold">⚡</span>
//               <span>{speechBubble}</span>
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSpeechBubble(null);
//                 }}
//                 className="text-stone-400 hover:text-white ml-1"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//               {/* Pointer triangle */}
//               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-900 border-r border-b border-amber-500/60 rotate-45" />
//             </div>
//           )}

//           {/* Quick Hover Controls Overlay */}
//           {showControls && !speechBubble && (
//             <div className="absolute -top-9 flex items-center space-x-1.5 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-700 shadow-xl pointer-events-auto">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleTurbo();
//                 }}
//                 className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer ${
//                   isTurbo 
//                     ? 'bg-red-500 text-white shadow-lg animate-pulse' 
//                     : 'bg-stone-800 hover:bg-stone-700 text-amber-300'
//                 }`}
//                 title="Toggle 2.5x Turbo Speed!"
//               >
//                 <Zap className="w-3 h-3 fill-current" />
//                 <span>{isTurbo ? 'TURBO ON' : 'Turbo'}</span>
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   playBicycleBellSound();
//                 }}
//                 className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-400 transition cursor-pointer"
//                 title="Ring Bicycle Bell"
//               >
//                 <Bell className="w-3 h-3" />
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleDock();
//                 }}
//                 className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
//                 title="Dock to corner badge"
//               >
//                 <Pin className="w-3 h-3" />
//               </button>
//             </div>
//           )}

//           {/* MAIN VECTOR BICYCLE COURIER SVG CHARACTER */}
//           <div className="relative w-40 sm:w-48 h-20 sm:h-24">
            
//             {/* Front Headlight Light Beam */}
//             <div className="absolute top-8 left-[110px] sm:left-[130px] w-28 sm:w-36 h-8 bg-gradient-to-r from-amber-400/35 via-amber-300/15 to-transparent pointer-events-none transform -rotate-6 blur-[1px] rounded-r-full" />

//             {/* Speed / Wind Trails when Turbo is active */}
//             {isTurbo && (
//               <div className="absolute top-4 -left-12 flex flex-col space-y-1.5 pointer-events-none opacity-85">
//                 <div className="w-12 h-0.5 bg-gradient-to-l from-amber-400 to-transparent animate-pulse" />
//                 <div className="w-16 h-0.5 bg-gradient-to-l from-red-500 to-transparent" style={{ animationDelay: '100ms' }} />
//                 <div className="w-10 h-0.5 bg-gradient-to-l from-amber-300 to-transparent" style={{ animationDelay: '200ms' }} />
//               </div>
//             )}

//             <svg
//               viewBox="0 0 200 110"
//               className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <defs>
//                 {/* Wheel Spinning Keyframe */}
//                 <style>
//                   {`
//                     @keyframes wheelSpin {
//                       from { transform: rotate(0deg); }
//                       to { transform: rotate(360deg); }
//                     }
//                     @keyframes pedalRotate {
//                       from { transform: rotate(0deg); }
//                       to { transform: rotate(360deg); }
//                     }
//                     @keyframes pedalCounter {
//                       from { transform: rotate(0deg); }
//                       to { transform: rotate(-360deg); }
//                     }
//                     .spoke-spin {
//                       transform-origin: center center;
//                       animation: wheelSpin ${isTurbo ? '0.35s' : '0.8s'} linear infinite;
//                     }
//                     .crank-rotate {
//                       transform-origin: 95px 82px;
//                       animation: pedalRotate ${isTurbo ? '0.35s' : '0.8s'} linear infinite;
//                     }
//                     .pedal-counter-1 {
//                       transform-origin: 95px 68px;
//                       animation: pedalCounter ${isTurbo ? '0.35s' : '0.8s'} linear infinite;
//                     }
//                     .pedal-counter-2 {
//                       transform-origin: 95px 96px;
//                       animation: pedalCounter ${isTurbo ? '0.35s' : '0.8s'} linear infinite;
//                     }
//                     .steam-puff {
//                       animation: steamFloat 1.4s ease-out infinite;
//                     }
//                     @keyframes steamFloat {
//                       0% { opacity: 0.8; transform: translate(0, 0) scale(0.8); }
//                       100% { opacity: 0; transform: translate(-14px, -12px) scale(1.4); }
//                     }
//                   `}
//                 </style>

//                 {/* Gradients */}
//                 <linearGradient id="craveJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#f59e0b" />
//                   <stop offset="100%" stopColor="#d97706" />
//                 </linearGradient>

//                 <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#292524" />
//                   <stop offset="100%" stopColor="#1c1917" />
//                 </linearGradient>

//                 <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" stopColor="#f59e0b" />
//                   <stop offset="50%" stopColor="#fbbf24" />
//                   <stop offset="100%" stopColor="#ea580c" />
//                 </linearGradient>

//                 <radialGradient id="wheelRimGrad" cx="50%" cy="50%" r="50%">
//                   <stop offset="70%" stopColor="#1c1917" />
//                   <stop offset="90%" stopColor="#44403c" />
//                   <stop offset="100%" stopColor="#0c0a09" />
//                 </radialGradient>
//               </defs>

//               {/* REAR WHEEL (Center: x=45, y=82, r=22) */}
//               <g transform="translate(45, 82)">
//                 <circle cx="0" cy="0" r="22" stroke="#44403c" strokeWidth="4.5" fill="none" />
//                 <circle cx="0" cy="0" r="19" stroke="#78716c" strokeWidth="1.2" fill="none" />
//                 {/* Spinning Spokes */}
//                 <g className="spoke-spin">
//                   <line x1="-19" y1="0" x2="19" y2="0" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="0" y1="-19" x2="0" y2="19" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="-13" y1="-13" x2="13" y2="13" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="-13" y1="13" x2="13" y2="-13" stroke="#a8a29e" strokeWidth="1.2" />
//                   <circle cx="0" cy="0" r="4.5" fill="#f59e0b" />
//                 </g>
//               </g>

//               {/* FRONT WHEEL (Center: x=145, y=82, r=22) */}
//               <g transform="translate(145, 82)">
//                 <circle cx="0" cy="0" r="22" stroke="#44403c" strokeWidth="4.5" fill="none" />
//                 <circle cx="0" cy="0" r="19" stroke="#78716c" strokeWidth="1.2" fill="none" />
//                 {/* Spinning Spokes */}
//                 <g className="spoke-spin">
//                   <line x1="-19" y1="0" x2="19" y2="0" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="0" y1="-19" x2="0" y2="19" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="-13" y1="-13" x2="13" y2="13" stroke="#a8a29e" strokeWidth="1.2" />
//                   <line x1="-13" y1="13" x2="13" y2="-13" stroke="#a8a29e" strokeWidth="1.2" />
//                   <circle cx="0" cy="0" r="4.5" fill="#f59e0b" />
//                 </g>
//               </g>

//               {/* BICYCLE FRAME */}
//               {/* Chainstay (Rear hub 45,82 to Bottom Bracket 95,82) */}
//               <line x1="45" y1="82" x2="95" y2="82" stroke="#78716c" strokeWidth="3" strokeLinecap="round" />
//               {/* Seatstay (Rear hub 45,82 to Saddle post base 78,54) */}
//               <line x1="45" y1="82" x2="78" y2="54" stroke="url(#frameGrad)" strokeWidth="3.2" strokeLinecap="round" />
//               {/* Seat tube (Bottom bracket 95,82 to Saddle post base 78,54) */}
//               <line x1="95" y1="82" x2="78" y2="54" stroke="url(#frameGrad)" strokeWidth="3.6" strokeLinecap="round" />
//               {/* Top tube (Seat post base 78,54 to Head tube 128,52) */}
//               <line x1="78" y1="54" x2="128" y2="52" stroke="url(#frameGrad)" strokeWidth="3.4" strokeLinecap="round" />
//               {/* Down tube (Bottom bracket 95,82 to Head tube 128,52) */}
//               <line x1="95" y1="82" x2="128" y2="52" stroke="url(#frameGrad)" strokeWidth="3.8" strokeLinecap="round" />
//               {/* Front Fork (Head tube 128,52 to Front hub 145,82) */}
//               <line x1="128" y1="52" x2="145" y2="82" stroke="#78716c" strokeWidth="3.2" strokeLinecap="round" />
//               {/* Handlebar stem & grips */}
//               <line x1="128" y1="52" x2="132" y2="42" stroke="#a8a29e" strokeWidth="3" strokeLinecap="round" />
//               <path d="M 126 42 L 138 41 L 140 45" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />

//               {/* Bicycle Saddle / Seat */}
//               <path d="M 70 52 C 72 50, 85 50, 86 52 C 86 54, 76 55, 70 52 Z" fill="#1c1917" stroke="#44403c" strokeWidth="1" />

//               {/* ROTATING CRANK & PEDALS */}
//               <g className="crank-rotate">
//                 {/* Chainring */}
//                 <circle cx="95" cy="82" r="8" fill="#1c1917" stroke="#a8a29e" strokeWidth="1.5" />
//                 {/* Crank arms */}
//                 <line x1="95" y1="82" x2="95" y2="68" stroke="#a8a29e" strokeWidth="2.5" strokeLinecap="round" />
//                 <line x1="95" y1="82" x2="95" y2="96" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />
//                 {/* Pedals */}
//                 <rect x="91" y="66" width="8" height="3" rx="1.5" fill="#f59e0b" className="pedal-counter-1" />
//                 <rect x="91" y="95" width="8" height="3" rx="1.5" fill="#78716c" className="pedal-counter-2" />
//               </g>

//               {/* CYCLIST RIDER (Body, Legs, Backpack, Helmet) */}
//               <g className="delivery-cyclist-body">
                
//                 {/* Back Leg (Left Leg - slightly darker for 3D depth) */}
//                 <path d="M 80 50 L 96 68 L 95 68" stroke="#78716c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

//                 {/* CRAVE INSULATED DELIVERY BACKPACK */}
//                 <g>
//                   {/* Thermal Bag Body */}
//                   <rect x="52" y="24" width="22" height="26" rx="4" fill="url(#backpackGrad)" stroke="#f59e0b" strokeWidth="1.5" />
//                   {/* Front Logo / Hot icon */}
//                   <rect x="56" y="28" width="14" height="12" rx="2" fill="#f59e0b" />
//                   <path d="M 61 31 L 64 35 L 63 35 L 65 39 L 62 39 Z" fill="#1c1917" />
//                   {/* Reflective safety strip */}
//                   <line x1="53" y1="45" x2="73" y2="45" stroke="#fde047" strokeWidth="2" />
//                   {/* Straps to shoulders */}
//                   <path d="M 72 26 C 76 27, 82 32, 85 35" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" fill="none" />

//                   {/* Little Hot Aroma Steam Puffs from bag vents */}
//                   <circle cx="50" cy="22" r="2" fill="#fbbf24" className="steam-puff" />
//                   <circle cx="47" cy="18" r="1.5" fill="#fde68a" className="steam-puff" style={{ animationDelay: '0.5s' }} />
//                 </g>

//                 {/* Torso & Crave Delivery Jacket */}
//                 <path 
//                   d="M 78 50 L 90 32 C 92 29, 98 30, 102 34 L 110 40 L 98 52 Z" 
//                   fill="url(#craveJacketGrad)" 
//                   stroke="#b45309" 
//                   strokeWidth="1"
//                 />

//                 {/* Reflective Jacket Stripe */}
//                 <path d="M 86 42 L 104 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

//                 {/* Arms holding handlebars */}
//                 <path d="M 98 34 L 122 40 L 138 43" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

//                 {/* Rider Neck & Head */}
//                 <circle cx="106" cy="22" r="7" fill="#fcd34d" />

//                 {/* AERO DELIVERY HELMET WITH VISOR */}
//                 <path d="M 99 22 C 99 15, 110 13, 116 17 C 120 20, 120 25, 114 26 L 102 26 Z" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.2" />
//                 {/* Yellow Amber Visor */}
//                 <path d="M 112 21 C 115 21, 117 23, 116 25 L 110 25 Z" fill="#fbbf24" />
//                 {/* Helmet strap */}
//                 <path d="M 103 23 L 106 28 L 108 23" stroke="#44403c" strokeWidth="1" fill="none" />

//                 {/* Front Leg (Right Leg in Forefront) */}
//                 <g>
//                   {/* Thigh (Hip 84,48 to Knee 100,64) */}
//                   {/* Shin (Knee 100,64 to Foot 95,95) */}
//                   <path 
//                     d="M 82 48 L 98 62 L 95 86" 
//                     stroke="#1c1917" 
//                     strokeWidth="4.5" 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     fill="none" 
//                   />
//                   {/* Shoe */}
//                   <path d="M 92 86 L 102 86 L 100 89 L 91 89 Z" fill="#f59e0b" />
//                 </g>
//               </g>
//             </svg>
//           </div>

//         </div>
//       )}
//     </div>
//     </>
//   );
// };


import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useApp } from '../context/AppContext';
import { playBicycleBellSound } from '../utils/audioEffects';

import {
  Bell,
  Zap,
  X,
  ChevronRight,
  Pin,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

const MESSAGES = [
  'Hot food & iced lattes on the way! ☕🍕',
  'Zooming across the city in 18 minutes! ⚡',
  'Fresh roast from The Local Bean arriving! 🚴💨',
  'Zero emissions, 100% swift cravings delivered! 🌱',
  'Next stop: your neighborhood cravings! 🌟',
];

export const DeliveryRiderAnimation: React.FC = () => {
  const { cart } = useApp();

  const bikeRef = useRef<HTMLDivElement>(null);
  const travelTweenRef = useRef<gsap.core.Tween | null>(null);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isTurbo, setIsTurbo] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const [showControls, setShowControls] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  /**
   * ------------------------------------------------------------
   * CONTINUOUS RIDER MOVEMENT
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (!bikeRef.current || isDocked) return;

    const bike = bikeRef.current;

    const calculateAnimation = () => {
      const screenWidth =
        typeof window !== 'undefined' ? window.innerWidth : 1024;

      /*
       * Responsive rider width
       */
      const isSmallMobile = screenWidth < 480;
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;

      let riderWidth = 170;

      if (isSmallMobile) {
        riderWidth = 135;
      } else if (isMobile) {
        riderWidth = 155;
      } else if (isTablet) {
        riderWidth = 180;
      } else {
        riderWidth = 205;
      }

      /*
       * Start completely outside viewport
       */
      const startX = -riderWidth - 60;

      /*
       * End completely outside viewport
       */
      const endX = screenWidth + riderWidth + 60;

      const totalDistance = endX - startX;

      /*
       * Speed
       */
      const normalSpeed = isMobile ? 105 : 135;
      const turboSpeed = isMobile ? 245 : 310;

      const pxPerSecond = isTurbo ? turboSpeed : normalSpeed;

      const duration = Math.max(
        isTurbo ? 3.5 : 7,
        totalDistance / pxPerSecond
      );

      /*
       * Kill previous animation
       */
      travelTweenRef.current?.kill();

      /*
       * Start from left
       */
      gsap.set(bike, {
        x: startX,
        y: 0,
        rotation: 0,
      });

      /*
       * Main movement
       */
      travelTweenRef.current = gsap.to(bike, {
        x: endX,
        duration,
        ease: 'none',
        repeat: -1,

        onRepeat: () => {
          setActiveMessageIndex((prev) => {
            return (prev + 1) % MESSAGES.length;
          });
        },
      });
    };

    calculateAnimation();

    /*
     * Rider body bouncing / pedaling effect
     */
    const bodyBob = gsap.to('.delivery-cyclist-body', {
      y: -3,
      duration: isTurbo ? 0.17 : 0.34,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    /*
     * Small shadow movement
     */
    const shadowBob = gsap.to('.delivery-bike-shadow', {
      scaleX: 0.88,
      opacity: 0.45,
      duration: isTurbo ? 0.18 : 0.38,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    const handleResize = () => {
      calculateAnimation();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      travelTweenRef.current?.kill();
      bodyBob.kill();
      shadowBob.kill();
    };
  }, [isTurbo, isDocked]);

  /**
   * ------------------------------------------------------------
   * CLEANUP BUBBLE TIMER
   * ------------------------------------------------------------
   */
  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) {
        clearTimeout(bubbleTimerRef.current);
      }
    };
  }, []);

  /**
   * ------------------------------------------------------------
   * RIDER CLICK
   * ------------------------------------------------------------
   */
  const handleRiderClick = () => {
    /*
     * Bell
     */
    if (soundEnabled) {
      playBicycleBellSound();
    }

    /*
     * Wheelie animation
     */
    if (bikeRef.current) {
      gsap.killTweensOf(bikeRef.current, 'rotation,y');

      gsap
        .timeline()
        .to(bikeRef.current, {
          rotation: -18,
          y: -14,
          duration: 0.28,
          ease: 'back.out(2)',
        })
        .to(bikeRef.current, {
          rotation: 0,
          y: 0,
          duration: 0.55,
          ease: 'bounce.out',
        });
    }

    /*
     * Message
     */
    const message =
      cart.length > 0
        ? `Rush delivery! ${cart.length} signature ${
            cart.length === 1 ? 'item' : 'items'
          } in transit! 🛵`
        : MESSAGES[activeMessageIndex];

    /*
     * Clear old timer
     */
    if (bubbleTimerRef.current) {
      clearTimeout(bubbleTimerRef.current);
    }

    /*
     * Show bubble
     */
    setSpeechBubble(message);

    /*
     * Hide after 4 seconds
     */
    bubbleTimerRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, 4000);
  };

  /**
   * ------------------------------------------------------------
   * TURBO
   * ------------------------------------------------------------
   */
  const toggleTurbo = () => {
    setIsTurbo((prev) => !prev);

    if (soundEnabled) {
      playBicycleBellSound();
    }
  };

  /**
   * ------------------------------------------------------------
   * DOCK
   * ------------------------------------------------------------
   */
  const toggleDock = () => {
    setIsDocked((prev) => {
      const next = !prev;

      if (next && bikeRef.current) {
        travelTweenRef.current?.kill();

        gsap.to(bikeRef.current, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
        });
      }

      return next;
    });
  };

  /**
   * ------------------------------------------------------------
   * SOUND
   * ------------------------------------------------------------
   */
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <>
      {/* =========================================================
          MOBILE QUICK ACTION BAR
      ========================================================= */}

      <div
        className="
          lg:hidden
          fixed
          bottom-[4.25rem]
          right-3
          z-[80]
          pointer-events-auto
          flex
          items-center
          gap-1
          rounded-full
          border
          border-amber-500/30
          bg-stone-950/90
          backdrop-blur-xl
          px-2
          py-1.5
          shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        "
      >
        <button
          type="button"
          onClick={handleRiderClick}
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            px-2
            py-1
            text-[10px]
            font-bold
            text-amber-300
            transition
            active:scale-95
          "
        >
          <span className="text-sm">🚴</span>
          <span>Bell</span>
        </button>

        <span className="text-stone-700">|</span>

        <button
          type="button"
          onClick={toggleTurbo}
          className={`
            rounded-full
            px-2
            py-1
            text-[9px]
            font-black
            transition
            ${
              isTurbo
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-stone-400'
            }
          `}
        >
          {isTurbo ? 'TURBO' : 'Turbo'}
        </button>

        <button
          type="button"
          onClick={toggleSound}
          className="
            ml-0.5
            rounded-full
            p-1
            text-stone-400
            transition
            hover:text-white
          "
        >
          {soundEnabled ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* =========================================================
          RIDER STAGE

          IMPORTANT:
          overflow-visible fixes the speech bubble clipping issue.
      ========================================================= */}

      <div
        className="
          fixed
          left-0
          right-0
          bottom-0
          z-[70]
          h-24
          sm:h-28
          md:h-30
          lg:h-32
          pointer-events-none
          select-none
          overflow-visible
        "
      >
        {/* =======================================================
            GROUND / ROAD
        ======================================================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-3
            bg-gradient-to-t
            from-stone-950
            via-stone-900/80
            to-transparent
            border-b
            border-amber-500/20
            pointer-events-none
          "
        >
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-amber-500/40
              to-transparent
            "
          />
        </div>

        {/* =======================================================
            DOCKED RIDER
        ======================================================= */}

        {isDocked ? (
          <div
            className="
              absolute
              bottom-3
              right-3
              sm:right-5
              lg:right-8
              pointer-events-auto
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-amber-500/30
              bg-stone-950/95
              backdrop-blur-xl
              p-2
              sm:p-2.5
              shadow-[0_15px_50px_rgba(0,0,0,0.65)]
            "
          >
            <button
              type="button"
              onClick={handleRiderClick}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-1
                text-left
                transition
                hover:bg-stone-900
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-500/30
                  bg-amber-500/10
                  text-lg
                "
              >
                🚴
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-white">
                    Crave Courier #42
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>

                <span className="text-[9px] font-mono text-amber-400">
                  18 MIN FLEET ACTIVE
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={toggleDock}
              className="
                flex
                items-center
                gap-1
                rounded-xl
                bg-amber-500
                px-2.5
                py-2
                text-[10px]
                font-black
                text-stone-950
                transition
                hover:bg-amber-400
                active:scale-95
              "
            >
              <Play className="h-3 w-3 fill-current" />
              Ride
            </button>
          </div>
        ) : (
          /* =====================================================
             MOVING RIDER
          ===================================================== */

          <div
            ref={bikeRef}
            className="
              absolute
              bottom-1
              left-0
              pointer-events-auto
              cursor-pointer
              group
              will-change-transform
            "
            onClick={handleRiderClick}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            title="Click the delivery rider"
          >
            {/* =================================================
                SPEECH BUBBLE

                FIX:
                absolute + overflow-visible parent
            ================================================= */}

            {speechBubble && (
              <div
                className="
                  absolute
                  bottom-[calc(100%+14px)]
                  left-1/2
                  z-[200]
                  w-max
                  max-w-[calc(100vw-32px)]
                  -translate-x-1/2
                  pointer-events-auto
                "
              >
                <div
                  className="
                    relative
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-amber-500/50
                    bg-stone-950/95
                    px-3
                    py-2
                    sm:px-4
                    sm:py-2.5
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    text-white
                    shadow-[0_15px_50px_rgba(0,0,0,0.75)]
                    backdrop-blur-xl
                    animate-[speechPop_0.3s_ease-out]
                  "
                >
                  {/* Glow */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -inset-px
                      rounded-2xl
                      bg-amber-500/10
                      blur-md
                    "
                  />

                  <span className="relative z-10 text-sm sm:text-base">
                    ⚡
                  </span>

                  <span className="relative z-10 whitespace-normal text-center">
                    {speechBubble}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (bubbleTimerRef.current) {
                        clearTimeout(bubbleTimerRef.current);
                      }

                      setSpeechBubble(null);
                    }}
                    className="
                      relative
                      z-10
                      rounded-full
                      p-0.5
                      text-stone-500
                      transition
                      hover:bg-stone-800
                      hover:text-white
                    "
                    aria-label="Close message"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Bubble pointer */}
                  <div
                    className="
                      absolute
                      -bottom-2
                      left-1/2
                      h-4
                      w-4
                      -translate-x-1/2
                      rotate-45
                      border-r
                      border-b
                      border-amber-500/50
                      bg-stone-950
                    "
                  />
                </div>
              </div>
            )}

            {/* =================================================
                HOVER CONTROLS
            ================================================= */}

            {showControls && !speechBubble && (
              <div
                className="
                  absolute
                  bottom-[calc(100%+8px)]
                  left-1/2
                  z-[150]
                  flex
                  -translate-x-1/2
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-stone-700
                  bg-stone-950/95
                  px-2
                  py-1.5
                  shadow-2xl
                  backdrop-blur-xl
                  pointer-events-auto
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Turbo */}
                <button
                  type="button"
                  onClick={toggleTurbo}
                  className={`
                    flex
                    items-center
                    gap-1
                    rounded-full
                    px-2
                    py-1
                    text-[9px]
                    font-black
                    transition
                    ${
                      isTurbo
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                    }
                  `}
                >
                  <Zap className="h-3 w-3 fill-current" />
                  {isTurbo ? 'TURBO' : 'Turbo'}
                </button>

                {/* Bell */}
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) {
                      playBicycleBellSound();
                    }
                  }}
                  className="
                    rounded-full
                    bg-stone-800
                    p-1.5
                    text-amber-400
                    transition
                    hover:bg-stone-700
                  "
                  title="Ring bell"
                >
                  <Bell className="h-3 w-3" />
                </button>

                {/* Sound */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="
                    rounded-full
                    bg-stone-800
                    p-1.5
                    text-stone-400
                    transition
                    hover:bg-stone-700
                    hover:text-white
                  "
                  title="Toggle sound"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3 w-3" />
                  ) : (
                    <VolumeX className="h-3 w-3" />
                  )}
                </button>

                {/* Dock */}
                <button
                  type="button"
                  onClick={toggleDock}
                  className="
                    rounded-full
                    bg-stone-800
                    p-1.5
                    text-stone-400
                    transition
                    hover:bg-stone-700
                    hover:text-white
                  "
                  title="Dock rider"
                >
                  <Pin className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* =================================================
                BIKE
            ================================================= */}

            <div
              className="
                relative
                h-[78px]
                w-[140px]
                sm:h-[90px]
                sm:w-[165px]
                md:h-[100px]
                md:w-[185px]
                lg:h-[108px]
                lg:w-[205px]
              "
            >
              {/* ===============================================
                  HEADLIGHT BEAM
              =============================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[78px]
                  top-[29px]
                  h-7
                  w-24
                  rotate-[-6deg]
                  rounded-r-full
                  bg-gradient-to-r
                  from-amber-400/35
                  via-amber-300/15
                  to-transparent
                  blur-[1px]
                  sm:left-[92px]
                  sm:top-[33px]
                  sm:w-28
                  md:left-[104px]
                  md:top-[37px]
                  md:w-32
                "
              />

              {/* ===============================================
                  TURBO WIND
              =============================================== */}

              {isTurbo && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-[-34px]
                    top-3
                    flex
                    flex-col
                    gap-1.5
                    opacity-90
                  "
                >
                  <div
                    className="
                      h-[2px]
                      w-10
                      rounded-full
                      bg-gradient-to-l
                      from-amber-400
                      to-transparent
                      animate-pulse
                    "
                  />

                  <div
                    className="
                      h-[2px]
                      w-14
                      rounded-full
                      bg-gradient-to-l
                      from-red-500
                      to-transparent
                    "
                  />

                  <div
                    className="
                      h-[2px]
                      w-8
                      rounded-full
                      bg-gradient-to-l
                      from-amber-300
                      to-transparent
                    "
                  />
                </div>
              )}

              {/* ===============================================
                  BIKE SVG
              =============================================== */}

              <svg
                viewBox="0 0 200 110"
                className="
                  h-full
                  w-full
                  overflow-visible
                  drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]
                "
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* =========================================
                      ANIMATIONS
                  ========================================= */}

                  <style>
                    {`
                      @keyframes wheelSpin {
                        from {
                          transform: rotate(0deg);
                        }
                        to {
                          transform: rotate(360deg);
                        }
                      }

                      @keyframes pedalRotate {
                        from {
                          transform: rotate(0deg);
                        }
                        to {
                          transform: rotate(360deg);
                        }
                      }

                      @keyframes steamFloat {
                        0% {
                          opacity: 0.8;
                          transform: translate(0, 0) scale(0.8);
                        }

                        100% {
                          opacity: 0;
                          transform: translate(-14px, -12px) scale(1.4);
                        }
                      }

                      @keyframes speechPop {
                        0% {
                          opacity: 0;
                          transform: translateY(8px) scale(0.85);
                        }

                        70% {
                          transform: translateY(-2px) scale(1.02);
                        }

                        100% {
                          opacity: 1;
                          transform: translateY(0) scale(1);
                        }
                      }

                      .spoke-spin {
                        transform-box: fill-box;
                        transform-origin: center;
                        animation:
                          wheelSpin ${isTurbo ? '0.3s' : '0.75s'}
                          linear infinite;
                      }

                      .crank-rotate {
                        transform-origin: 95px 82px;
                        animation:
                          pedalRotate ${isTurbo ? '0.32s' : '0.75s'}
                          linear infinite;
                      }

                      .steam-puff {
                        animation:
                          steamFloat 1.4s ease-out infinite;
                      }
                    `}
                  </style>

                  {/* =========================================
                      GRADIENTS
                  ========================================= */}

                  <linearGradient
                    id="craveJacketGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  <linearGradient
                    id="backpackGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#292524" />
                    <stop offset="100%" stopColor="#1c1917" />
                  </linearGradient>

                  <linearGradient
                    id="frameGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>

                {/* =============================================
                    REAR WHEEL
                ============================================= */}

                <g transform="translate(45, 82)">
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    stroke="#44403c"
                    strokeWidth="4.5"
                    fill="none"
                  />

                  <circle
                    cx="0"
                    cy="0"
                    r="19"
                    stroke="#78716c"
                    strokeWidth="1.2"
                    fill="none"
                  />

                  <g className="spoke-spin">
                    <line
                      x1="-19"
                      y1="0"
                      x2="19"
                      y2="0"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="0"
                      y1="-19"
                      x2="0"
                      y2="19"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="-13"
                      y1="-13"
                      x2="13"
                      y2="13"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="-13"
                      y1="13"
                      x2="13"
                      y2="-13"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <circle
                      cx="0"
                      cy="0"
                      r="4.5"
                      fill="#f59e0b"
                    />
                  </g>
                </g>

                {/* =============================================
                    FRONT WHEEL
                ============================================= */}

                <g transform="translate(145, 82)">
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    stroke="#44403c"
                    strokeWidth="4.5"
                    fill="none"
                  />

                  <circle
                    cx="0"
                    cy="0"
                    r="19"
                    stroke="#78716c"
                    strokeWidth="1.2"
                    fill="none"
                  />

                  <g className="spoke-spin">
                    <line
                      x1="-19"
                      y1="0"
                      x2="19"
                      y2="0"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="0"
                      y1="-19"
                      x2="0"
                      y2="19"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="-13"
                      y1="-13"
                      x2="13"
                      y2="13"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <line
                      x1="-13"
                      y1="13"
                      x2="13"
                      y2="-13"
                      stroke="#a8a29e"
                      strokeWidth="1.2"
                    />

                    <circle
                      cx="0"
                      cy="0"
                      r="4.5"
                      fill="#f59e0b"
                    />
                  </g>
                </g>

                {/* =============================================
                    BICYCLE FRAME
                ============================================= */}

                <line
                  x1="45"
                  y1="82"
                  x2="95"
                  y2="82"
                  stroke="#78716c"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <line
                  x1="45"
                  y1="82"
                  x2="78"
                  y2="54"
                  stroke="url(#frameGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                <line
                  x1="95"
                  y1="82"
                  x2="78"
                  y2="54"
                  stroke="url(#frameGrad)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />

                <line
                  x1="78"
                  y1="54"
                  x2="128"
                  y2="52"
                  stroke="url(#frameGrad)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />

                <line
                  x1="95"
                  y1="82"
                  x2="128"
                  y2="52"
                  stroke="url(#frameGrad)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />

                <line
                  x1="128"
                  y1="52"
                  x2="145"
                  y2="82"
                  stroke="#78716c"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* =============================================
                    HANDLEBAR
                ============================================= */}

                <line
                  x1="128"
                  y1="52"
                  x2="132"
                  y2="42"
                  stroke="#a8a29e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M126 42 L138 41 L140 45"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* =============================================
                    SEAT
                ============================================= */}

                <path
                  d="M70 52 C72 50,85 50,86 52 C86 54,76 55,70 52Z"
                  fill="#1c1917"
                  stroke="#44403c"
                  strokeWidth="1"
                />

                {/* =============================================
                    CRANK
                ============================================= */}

                <g className="crank-rotate">
                  <circle
                    cx="95"
                    cy="82"
                    r="8"
                    fill="#1c1917"
                    stroke="#a8a29e"
                    strokeWidth="1.5"
                  />

                  <line
                    x1="95"
                    y1="82"
                    x2="95"
                    y2="68"
                    stroke="#a8a29e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <line
                    x1="95"
                    y1="82"
                    x2="95"
                    y2="96"
                    stroke="#78716c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <rect
                    x="91"
                    y="66"
                    width="8"
                    height="3"
                    rx="1.5"
                    fill="#f59e0b"
                  />

                  <rect
                    x="91"
                    y="95"
                    width="8"
                    height="3"
                    rx="1.5"
                    fill="#78716c"
                  />
                </g>

                {/* =============================================
                    RIDER BODY
                ============================================= */}

                <g className="delivery-cyclist-body">
                  {/* Back leg */}
                  <path
                    d="M80 50 L96 68 L95 68"
                    stroke="#78716c"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* =========================================
                      DELIVERY BACKPACK
                  ========================================= */}

                  <g>
                    <rect
                      x="52"
                      y="24"
                      width="22"
                      height="26"
                      rx="4"
                      fill="url(#backpackGrad)"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />

                    <rect
                      x="56"
                      y="28"
                      width="14"
                      height="12"
                      rx="2"
                      fill="#f59e0b"
                    />

                    <path
                      d="M61 31 L64 35 L63 35 L65 39 L62 39Z"
                      fill="#1c1917"
                    />

                    <line
                      x1="53"
                      y1="45"
                      x2="73"
                      y2="45"
                      stroke="#fde047"
                      strokeWidth="2"
                    />

                    <path
                      d="M72 26 C76 27,82 32,85 35"
                      stroke="#44403c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />

                    <circle
                      cx="50"
                      cy="22"
                      r="2"
                      fill="#fbbf24"
                      className="steam-puff"
                    />

                    <circle
                      cx="47"
                      cy="18"
                      r="1.5"
                      fill="#fde68a"
                      className="steam-puff"
                      style={{ animationDelay: '0.5s' }}
                    />
                  </g>

                  {/* =========================================
                      JACKET
                  ========================================= */}

                  <path
                    d="M78 50 L90 32 C92 29,98 30,102 34 L110 40 L98 52Z"
                    fill="url(#craveJacketGrad)"
                    stroke="#b45309"
                    strokeWidth="1"
                  />

                  <path
                    d="M86 42 L104 46"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />

                  {/* Arms */}
                  <path
                    d="M98 34 L122 40 L138 43"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* =========================================
                      HEAD
                  ========================================= */}

                  <circle
                    cx="106"
                    cy="22"
                    r="7"
                    fill="#fcd34d"
                  />

                  {/* Helmet */}
                  <path
                    d="M99 22 C99 15,110 13,116 17 C120 20,120 25,114 26 L102 26Z"
                    fill="#1c1917"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />

                  {/* Visor */}
                  <path
                    d="M112 21 C115 21,117 23,116 25 L110 25Z"
                    fill="#fbbf24"
                  />

                  {/* Helmet strap */}
                  <path
                    d="M103 23 L106 28 L108 23"
                    stroke="#44403c"
                    strokeWidth="1"
                    fill="none"
                  />

                  {/* =========================================
                      FRONT LEG
                  ========================================= */}

                  <path
                    d="M82 48 L98 62 L95 86"
                    stroke="#1c1917"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Shoe */}
                  <path
                    d="M92 86 L102 86 L100 89 L91 89Z"
                    fill="#f59e0b"
                  />
                </g>
              </svg>

              {/* ===============================================
                  GROUND SHADOW
              =============================================== */}

              <div
                className="
                  delivery-bike-shadow
                  pointer-events-none
                  absolute
                  bottom-0
                  left-1/2
                  h-1
                  w-24
                  -translate-x-1/2
                  rounded-full
                  bg-black/70
                  blur-[3px]
                "
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};