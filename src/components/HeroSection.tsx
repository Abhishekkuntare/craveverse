import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  ArrowRight,
  Star,
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  Search,
  MapPin,
  TrendingUp,
  Coffee,
  Check,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  Droplets,
  Layers,
  X,
  BookOpen
} from 'lucide-react';
import { CinematicIntroOverlay } from './CinematicIntroOverlay';
import { playIceClinkSound, ambientCafePlayer } from '../utils/audioEffects';

interface BeverageItem {
  id: string;
  name: string;
  subtitle: string;
  displayWord: string;
  price: number;
  originalPrice?: number;
  image: string;
  dishId: string;
  restaurantId: string;
  portalGradient: string;
  glowColor: string;
  badgeText: string;
  headline: string;
  subtext: string;
  originTag: string;
  sensory: {
    sweetness: string;
    acidity: string;
    body: string;
    temp: string;
  };
  videoUrl: string;
  themeColor: string;
}

const BEVERAGES: BeverageItem[] = [
  {
    id: 'boba-latte',
    name: 'Artisanal Boba Iced Latte',
    subtitle: 'Brown Sugar Okinawa Pearl & Single-Origin Espresso Splash',
    displayWord: 'Coffee',
    price: 240,
    originalPrice: 280,
    image: '/src/assets/images/iced_coffee_splash_1789209988492.jpg',
    dishId: 'dish-901',
    restaurantId: 'rest-9',
    portalGradient: 'from-purple-900/90 via-purple-700 to-indigo-950',
    glowColor: 'rgba(124, 58, 237, 0.45)',
    badgeText: '★ 100% VEGAN ★ FRESHLY ROASTED COFFEE BEANS ★ ARTISAN CRAFT ★',
    headline: 'Escape the ordinary, sip the extraordinary',
    subtext: 'We source unique, single-origin beans from around the world, roasted to perfection.',
    originTag: 'Ethiopian Yirgacheffe • Grade 1 • 2,100m MASL',
    sensory: {
      sweetness: '8.5 / 10',
      acidity: '4.2 / 10',
      body: 'Velvet Silk',
      temp: '3.8°C Ice Cold'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ice-falling-into-a-glass-of-iced-coffee-41809-large.mp4',
    themeColor: 'purple'
  },
  {
    id: 'matcha-cloud',
    name: 'Ceremonial Dirty Matcha Cloud',
    subtitle: 'First-Harvest Uji Matcha & Vanilla Cold Foam Explosion',
    displayWord: 'Matcha',
    price: 260,
    originalPrice: 300,
    image: '/src/assets/images/matcha_splash_1789210015654.jpg',
    dishId: 'dish-902',
    restaurantId: 'rest-9',
    portalGradient: 'from-emerald-950 via-emerald-700 to-teal-950',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeText: '★ UJI FIRST-HARVEST ★ STONE-GROUND GREEN TEA ★ 100% VEGAN ★',
    headline: 'First-Harvest Uji, Whipped to Cloud Perfection',
    subtext: 'Stone-ground ceremonial green tea poured over velvety vanilla bean cold foam.',
    originTag: 'Uji, Kyoto Pref. • Single Cultivar Gokou • Shade Grown',
    sensory: {
      sweetness: '6.0 / 10',
      acidity: '1.5 / 10',
      body: 'Light Aerated Foam',
      temp: '4.0°C Chilled'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-making-a-latte-art-with-milk-foam-41818-large.mp4',
    themeColor: 'emerald'
  },
  {
    id: 'cascara-coldbrew',
    name: 'Cascara Citrus Cold Brew',
    subtitle: '24-Hour Slow Immersion, Star Anise & Valencia Orange Twist',
    displayWord: 'Cascara',
    price: 220,
    originalPrice: 250,
    image: '/src/assets/images/coldbrew_splash_1789210079542.jpg',
    dishId: 'dish-903',
    restaurantId: 'rest-9',
    portalGradient: 'from-amber-950 via-amber-700 to-stone-950',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    badgeText: '★ 24-HOUR SLOW DRIP ★ NITRO INFUSED ★ NATURAL SWEETNESS ★',
    headline: '24-Hour Immersion, Star Anise & Citrus Rock',
    subtext: 'Sun-dried coffee cherry infusion poured slow over hand-carved hexagonal crystal ice.',
    originTag: 'Geisha Cascara • Finca El Paraiso, Colombia',
    sensory: {
      sweetness: '4.5 / 10',
      acidity: '7.8 / 10',
      body: 'Crisp & Effervescent',
      temp: '2.5°C Crystal Rock'
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-coffee-dripping-into-a-cup-41814-large.mp4',
    themeColor: 'amber'
  }
];

export const HeroSection: React.FC = () => {
  const {
    currentLocation,
    setIsLocationModalOpen,
    setIsUniversalSearchOpen,
    setSearchQuery,
    setCurrentView,
    setSelectedRestaurant,
    restaurantList,
    addToCart,
    showToast
  } = useApp();

  const [activeBeverageIndex, setActiveBeverageIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [clinkCount, setClinkCount] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-play the 3D bean prologue on first visit
  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('crave_has_seen_bean_intro');
      if (!hasSeen) {
        setShowIntro(true);
      }
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('crave_has_seen_bean_intro', 'true');
    } catch {
      // Ignore
    }
  };

  // Refs for GSAP animation controls
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerpieceRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const iceCubeRef = useRef<HTMLDivElement>(null);

const portalInnerRef = useRef<HTMLDivElement>(null);

const outerRingRef = useRef<HTMLDivElement>(null);

const productImageRef = useRef<HTMLDivElement>(null);
const productRingRef = useRef<HTMLDivElement>(null);

const pulseRingRef = useRef<HTMLDivElement>(null);

const bean1Ref = useRef<HTMLDivElement>(null);
const bean2Ref = useRef<HTMLDivElement>(null);
const bean3Ref = useRef<HTMLDivElement>(null);


const spark1Ref = useRef<HTMLDivElement>(null);
const spark2Ref = useRef<HTMLDivElement>(null);
const spark3Ref = useRef<HTMLDivElement>(null);



  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const currentBeverage = BEVERAGES[activeBeverageIndex];

  // GSAP: Master Entrance Timeline, Background Parallax Zoom & Floating Elements
  useEffect(() => {
    if (!heroContainerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial State Setups for high-performance hardware acceleration
      gsap.set('.gsap-portal', { transformOrigin: 'center center', willChange: 'transform, opacity' });
      gsap.set('.gsap-centerpiece', { transformOrigin: 'center center', willChange: 'transform, opacity' });
      gsap.set('.gsap-bg-word', { transformOrigin: 'center center', willChange: 'transform, opacity' });
      gsap.set('.gsap-floating-elem', { willChange: 'transform' });

      // 2. Continuous Parallax Breathing Zoom on Portal Halo & Background Food Imagery
      gsap.to('.gsap-portal', {
        scale: 1.09,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.gsap-bg-words-group', {
        scale: 1.05,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 3. Continuous Gentle Floating Physics on Suspended Elements
      gsap.to('.gsap-float-bean-1', {
        y: '-=18',
        x: '+=10',
        rotation: '+=22',
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.gsap-float-bean-2', {
        y: '+=24',
        x: '-=14',
        rotation: '-=28',
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3
      });

      gsap.to('.gsap-float-bean-3', {
        y: '-=15',
        x: '-=10',
        rotation: '+=35',
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6
      });

      gsap.to('.gsap-float-ice', {
        y: '+=16',
        x: '+=9',
        rotation: '+=14',
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Rotating seal continuous spin via GSAP
      gsap.to('.gsap-seal-spinner', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // 4. Cinematic Entrance Master Timeline
      const masterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Top control bar soft fade
      masterTl.fromTo('.gsap-topbar',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 }
      );

      // Left Column side-by-side entrance
      masterTl.fromTo('.gsap-left-col',
        { x: -35, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.4'
      );

      // Staggered Coffee Name, Subtext, Origin & Action buttons
      masterTl.fromTo('.gsap-text-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power2.out' },
        '-=0.7'
      );

      // Sensory profile metrics staggered reveal
      masterTl.fromTo('.gsap-sensory-item',
        { y: 14, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' },
        '-=0.5'
      );

      // Right Portal halo blooming emergence
      masterTl.fromTo('.gsap-portal',
        { scale: 0.3, opacity: 0, filter: 'blur(30px)' },
        { scale: 1, opacity: 0.85, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' },
        '-=0.8'
      );

      // Centerpiece drink splash elastic cinematic entrance
      masterTl.fromTo('.gsap-centerpiece',
        { scale: 0.6, y: 60, opacity: 0, rotation: -5, filter: 'blur(6px)' },
        { scale: 1, y: 0, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 1.2, ease: 'back.out(1.5)' },
        '-=0.8'
      );

      // Right Rotating Seal Stamp burst
      masterTl.fromTo('.gsap-seal-container',
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.0, ease: 'back.out(1.6)' },
        '-=0.7'
      );

      // Bottom craft selector and omni search bar slide-up
      masterTl.fromTo('.gsap-bottom-bar',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );

    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // GSAP: Smooth beverage change transition
  const handleBeverageSelect = (index: number) => {
    if (index === activeBeverageIndex) return;
    playIceClinkSound();

    if (!heroContainerRef.current) {
      setActiveBeverageIndex(index);
      return;
    }

    // Quick cinematic transition out
    gsap.to(['.gsap-centerpiece', '.gsap-text-reveal', '.gsap-sensory-item'], {
      opacity: 0,
      y: 12,
      scale: 0.95,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setActiveBeverageIndex(index);

        // Staggered entrance for the new beverage
        requestAnimationFrame(() => {
          gsap.fromTo('.gsap-centerpiece',
            { scale: 0.75, opacity: 0, y: 35, rotation: 4 },
            { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.85, ease: 'back.out(1.6)' }
          );

          gsap.fromTo('.gsap-text-reveal',
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power2.out' }
          );

          gsap.fromTo('.gsap-sensory-item',
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.45, ease: 'power2.out' }
          );
        });
      }
    });
  };

  // High-Performance GSAP Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltY = ((x - centerX) / centerX) * 15;
    const tiltX = -((y - centerY) / centerY) * 12;

    setTilt({ x: tiltX, y: tiltY });

    // GSAP hardware-accelerated 3D parallax & gentle zoom interpolation
    if (centerpieceRef.current) {
      gsap.to(centerpieceRef.current, {
        rotateY: tiltY * 1.15,
        rotateX: tiltX * 1.15,
        scale: 1.03,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (bgWordsRef.current) {
      gsap.to(bgWordsRef.current, {
        x: -tiltY * 2.4,
        y: -tiltX * 2.4,
        scale: 1.02,
        duration: 0.75,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (portalRef.current) {
      gsap.to(portalRef.current, {
        x: -tiltY * 1.1,
        y: -tiltX * 1.1,
        scale: 1.06,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    // Dynamic Parallax on Floating Elements
    gsap.to('.gsap-float-bean-1', {
      x: tiltY * 2.8,
      y: tiltX * 2.8,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to('.gsap-float-bean-2', {
      x: tiltY * 3.6,
      y: tiltX * 3.6,
      duration: 0.75,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to('.gsap-float-bean-3', {
      x: tiltY * 2.2,
      y: tiltX * 2.2,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to('.gsap-float-ice', {
      x: tiltY * 3.2,
      y: tiltX * 3.2,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });

    if (centerpieceRef.current) {
      gsap.to(centerpieceRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.0,
        ease: 'elastic.out(1, 0.6)',
        overwrite: 'auto'
      });
    }

    if (bgWordsRef.current) {
      gsap.to(bgWordsRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }

    if (portalRef.current) {
      gsap.to(portalRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  // Audio Ambient Toggle
  const toggleAmbientSound = () => {
    if (isAudioPlaying) {
      ambientCafePlayer.stop();
      setIsAudioPlaying(false);
    } else {
      ambientCafePlayer.start();
      setIsAudioPlaying(true);
      showToast('Ambient cafe lo-fi chords activated', 'info');
    }
  };

  // Interactive Ice Clink with GSAP spring impulse
  const handleIceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playIceClinkSound();
    setClinkCount((prev) => prev + 1);
    showToast('❄️ Ice cube clinked! (3.8°C)', 'info');

    if (iceCubeRef.current) {
      gsap.timeline()
        .to(iceCubeRef.current, { scale: 1.35, rotate: -25, duration: 0.12, ease: 'power2.out' })
        .to(iceCubeRef.current, { scale: 1, rotate: 18, duration: 0.55, ease: 'elastic.out(1.2, 0.3)' });
    }
  };

  // 1-Click Order Signature Sip
  const handleQuickOrder = () => {
    const parentRest = restaurantList.find((r) => r.id === currentBeverage.restaurantId) || restaurantList[0];
    const dish = parentRest.menuItems.find((d) => d.id === currentBeverage.dishId) || parentRest.menuItems[0];

    addToCart(dish);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
    showToast(`Added ${currentBeverage.name} to order!`, 'success');
  };

  // Quick keyword jump
  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setCurrentView('restaurants');
  };


  useEffect(() => {
  if (
    !portalRef.current ||
    !centerpieceRef.current ||
    !productImageRef.current
  ) {
    return;
  }

  const ctx = gsap.context(() => {

    /* ========================================================
       MAIN PORTAL — BREATHING
    ======================================================== */

    gsap.to(portalRef.current, {
      scale: 1.045,
      duration: 3.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });


    /* ========================================================
       INNER PORTAL — SLOW ROTATION
    ======================================================== */

    if (portalInnerRef.current) {
      gsap.to(portalInnerRef.current, {
        rotation: 360,
        duration: 35,
        ease: "none",
        repeat: -1,
      });
    }


    /* ========================================================
       OUTER RING — ROTATE
    ======================================================== */

    if (outerRingRef.current) {
      gsap.to(outerRingRef.current, {
        rotation: -360,
        duration: 45,
        ease: "none",
        repeat: -1,
      });
    }


    /* ========================================================
       MAIN COFFEE — FLOAT
    ======================================================== */

    gsap.to(centerpieceRef.current, {
      y: -12,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });


    /* ========================================================
       COFFEE IMAGE — SUBTLE ROTATION
    ======================================================== */

    gsap.to(productImageRef.current, {
      rotationY: 4,
      rotationX: 2,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });


    /* ========================================================
       PRODUCT RING
    ======================================================== */

    if (productRingRef.current) {
      gsap.to(productRingRef.current, {
        rotation: 360,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    }


    /* ========================================================
       PULSE RING
    ======================================================== */

    if (pulseRingRef.current) {

      gsap.fromTo(
        pulseRingRef.current,

        {
          scale: 0.85,
          opacity: 0.5,
        },

        {
          scale: 1.25,
          opacity: 0,
          duration: 2.8,
          ease: "power1.out",
          repeat: -1,
        }
      );

    }


    /* ========================================================
       BEAN #1
    ======================================================== */

    if (bean1Ref.current) {

      gsap.to(bean1Ref.current, {
        y: -18,
        x: 8,
        rotation: 360,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       BEAN #2
    ======================================================== */

    if (bean2Ref.current) {

      gsap.to(bean2Ref.current, {
        y: 16,
        x: -10,
        rotation: -360,
        duration: 5.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       BEAN #3
    ======================================================== */

    if (bean3Ref.current) {

      gsap.to(bean3Ref.current, {
        y: -12,
        x: -8,
        rotation: 360,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       ICE CUBE — FLOAT + ROTATE
    ======================================================== */

    if (iceCubeRef.current) {

      gsap.to(iceCubeRef.current, {
        y: -20,
        x: 8,
        rotation: 25,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       SEAL — SLOW ROTATION
    ======================================================== */

    if (sealRef.current) {

      gsap.to(
        sealRef.current.querySelector(".gsap-seal-spinner"),
        {
          rotation: 360,
          duration: 24,
          ease: "none",
          repeat: -1,
        }
      );

    }


    /* ========================================================
       SPARK #1
    ======================================================== */

    if (spark1Ref.current) {

      gsap.to(spark1Ref.current, {
        scale: 1.8,
        opacity: 0.25,
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       SPARK #2
    ======================================================== */

    if (spark2Ref.current) {

      gsap.to(spark2Ref.current, {
        scale: 2,
        opacity: 0.2,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }


    /* ========================================================
       SPARK #3
    ======================================================== */

    if (spark3Ref.current) {

      gsap.to(spark3Ref.current, {
        scale: 1.7,
        opacity: 0.2,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

    }

  });

  return () => ctx.revert();

}, [currentBeverage]);




  return (
    <>
      {/* Cinematic Bean Zoom Prologue Overlay */}
      <CinematicIntroOverlay
        isOpen={showIntro}
        onComplete={handleIntroComplete}
        soundEnabled={true}
      />

      <div
        ref={heroContainerRef}
        className="relative overflow-hidden bg-stone-950 text-white pt-4 pb-14 border-b border-stone-800/80 select-none"
      >
        {/* Dynamic ambient backdrop illumination */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 opacity-60"
          style={{
            background: currentBeverage.glowColor
          }}
        />

        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Top Control Bar: Brand Seal, Mode Switcher & ASMR/Prologue buttons */}
          <div className="gsap-topbar flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone-800/70">
            {/* Brand Emblem */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-stone-700/80 flex items-center justify-center p-1.5 shadow-inner">
                <img
                  src="/src/assets/images/single_coffee_bean_1789210003013.jpg"
                  alt="Bean Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display font-black text-sm tracking-wide text-white">THE LOCAL BEAN</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ARTISANAL
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">Single-Origin Roastery & Foodverse</span>
              </div>
            </div>

            {/* Artisanal Extraction Status Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800/90 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-xs font-semibold text-stone-300">Cold Drip 3D Artisanal Scene</span>
            </div>

            {/* Prologue Replay & Audio Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowIntro(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-xs text-stone-300 hover:text-white flex items-center space-x-1.5 transition cursor-pointer"
                title="Watch the 3D rotating coffee bean entrance zoom animation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Replay 3D Intro</span>
              </button>

              <button
                onClick={toggleAmbientSound}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-2 transition cursor-pointer ${isAudioPlaying
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                    : 'bg-stone-900 border-stone-700/80 text-stone-400 hover:text-stone-200'
                  }`}
                title="Toggle ambient cafe lo-fi synth"
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span className="flex space-x-0.5 items-end h-3">
                      <span className="w-0.5 h-2 bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-0.5 h-3 bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-0.5 h-1.5 bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span>Cafe Audio</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MAIN HERO STAGE: Side-by-side layout separating Coffee Name and Coffee Image without overlap */}
         {/* =========================================================
    PREMIUM COFFEE HERO
    Responsive: Mobile / Tablet / Desktop
========================================================= */}

<section className="relative w-full overflow-hidden">

  <div
    className="
      mx-auto
      w-full
      max-w-7xl
      px-4
      py-8

      sm:px-6
      sm:py-10

      lg:px-8
      lg:py-14
    "
  >

    {/* =======================================================
        HERO GRID
    ======================================================== */}
    <div
      className="
        grid
        w-full
        items-center

        grid-cols-1

        gap-10

        lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]
        lg:gap-8

        xl:grid-cols-[minmax(0,0.85fr)_minmax(500px,1.15fr)]
        xl:gap-12
      "
    >

      {/* =====================================================
          LEFT — CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-30

          flex
          min-w-0
          flex-col

          items-center
          text-center

          lg:items-start
          lg:text-left
        "
      >

        {/* ===================================================
            EYEBROW
        ==================================================== */}
        <div
          className="
            gsap-text-reveal

            mb-4

            flex
            max-w-full
            items-center
            gap-2

            rounded-full

            border
            border-amber-500/30

            bg-stone-900/80

            px-3
            py-1.5

            shadow-lg
            shadow-black/10

            backdrop-blur-sm
          "
        >

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center

              rounded-lg

              border
              border-amber-500/30

              bg-amber-500/10

              text-amber-400
            "
          >
            <Coffee className="h-3.5 w-3.5" />
          </div>

          <span
            className="
              truncate

              text-[9px]
              font-mono
              font-bold
              uppercase
              tracking-[0.12em]
              text-amber-300

              sm:text-[10px]
            "
          >
            Signature Harvest • 100% Arabica
          </span>

        </div>


        {/* ===================================================
            TITLE AREA
        ==================================================== */}
        <div
          className="
            gsap-text-reveal

            w-full
            max-w-xl

            space-y-3
          "
        >

          {/* BACKGROUND WORD */}
          <div
            ref={bgWordsRef}
            className="
              select-none

              whitespace-nowrap

              font-serif
              font-black
              uppercase

              text-[clamp(4rem,16vw,8rem)]

              leading-[0.78]

              tracking-[-0.04em]

              text-transparent

              bg-gradient-to-br
              from-amber-100
              via-amber-200
              to-amber-500

              bg-clip-text
            "
            style={{
              letterSpacing: '-0.04em',
              textShadow: '0 8px 40px rgba(0,0,0,0.45)',
            }}
          >
            {currentBeverage.displayWord}
          </div>


          {/* MAIN TITLE */}
          <h1
            className="
              font-display
              font-black

              text-[clamp(1.8rem,5vw,3.6rem)]

              leading-[0.98]

              tracking-[-0.035em]

              text-white
            "
          >
            {currentBeverage.name}
          </h1>


          {/* DESCRIPTION */}
          <p
            className="
              mx-auto
              max-w-lg

              text-sm
              leading-relaxed
              text-stone-300

              sm:text-base

              lg:mx-0
              lg:max-w-md
            "
          >
            {currentBeverage.subtext}
          </p>

        </div>


        {/* ===================================================
            ORIGIN
        ==================================================== */}
        <div
          className="
            gsap-text-reveal

            mt-5

            flex
            max-w-full
            items-center
            gap-2

            rounded-2xl

            border
            border-stone-800

            bg-stone-900/80

            px-3.5
            py-2.5

            shadow-sm

            backdrop-blur-sm
          "
        >

          <Compass
            className="
              h-4
              w-4
              shrink-0
              text-amber-400
            "
          />

          <span
            className="
              max-w-[280px]

              truncate

              text-[10px]
              text-stone-300

              sm:max-w-[360px]
              sm:text-xs
            "
          >
            {currentBeverage.originTag}
          </span>

        </div>


        {/* ===================================================
            SENSORY GRID
        ==================================================== */}
        <div
          className="
            gsap-sensory-box

            mt-4

            grid
            w-full
            max-w-lg

            grid-cols-2

            gap-2

            sm:grid-cols-4
          "
        >

          {/* SWEETNESS */}
          <div
            className="
              gsap-sensory-item

              min-w-0

              rounded-xl

              border
              border-stone-800

              bg-stone-900/90

              p-3

              shadow-inner
            "
          >
            <span
              className="
                block

                text-[9px]
                font-mono
                uppercase
                tracking-wide
                text-stone-500
              "
            >
              Sweetness
            </span>

            <span className="mt-1 block truncate text-xs font-bold text-white">
              {currentBeverage.sensory.sweetness}
            </span>
          </div>


          {/* ACIDITY */}
          <div
            className="
              gsap-sensory-item

              min-w-0

              rounded-xl

              border
              border-stone-800

              bg-stone-900/90

              p-3

              shadow-inner
            "
          >
            <span
              className="
                block

                text-[9px]
                font-mono
                uppercase
                tracking-wide
                text-stone-500
              "
            >
              Acidity
            </span>

            <span className="mt-1 block truncate text-xs font-bold text-amber-400">
              {currentBeverage.sensory.acidity}
            </span>
          </div>


          {/* BODY */}
          <div
            className="
              gsap-sensory-item

              min-w-0

              rounded-xl

              border
              border-stone-800

              bg-stone-900/90

              p-3

              shadow-inner
            "
          >
            <span
              className="
                block

                text-[9px]
                font-mono
                uppercase
                tracking-wide
                text-stone-500
              "
            >
              Body
            </span>

            <span className="mt-1 block truncate text-xs font-bold text-stone-200">
              {currentBeverage.sensory.body}
            </span>
          </div>


          {/* TEMPERATURE */}
          <div
            className="
              gsap-sensory-item

              min-w-0

              rounded-xl

              border
              border-stone-800

              bg-stone-900/90

              p-3

              shadow-inner
            "
          >
            <span
              className="
                block

                text-[9px]
                font-mono
                uppercase
                tracking-wide
                text-stone-500
              "
            >
              Temp
            </span>

            <span className="mt-1 block truncate text-xs font-bold text-cyan-300">
              {currentBeverage.sensory.temp}
            </span>
          </div>

        </div>


        {/* ===================================================
            ACTIONS
        ==================================================== */}
        <div
          className="
            gsap-text-reveal

            mt-5

            flex
            w-full

            flex-col
            gap-2

            sm:w-auto
            sm:flex-row
            sm:items-center
          "
        >

          {/* ORDER */}
          <button
            onClick={handleQuickOrder}
            className={`
              flex
              min-h-[48px]

              items-center
              justify-center
              gap-2

              rounded-xl

              px-5
              py-3

              text-xs
              font-bold

              shadow-lg

              transition-all
              duration-200

              active:scale-95

              cursor-pointer

              sm:text-sm

              ${
                addedSuccess
                  ? 'bg-emerald-500 text-stone-950'
                  : 'bg-amber-500 text-stone-950 shadow-amber-500/20 hover:bg-amber-400'
              }
            `}
          >

            {addedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>
                  Sip Signature • ₹{currentBeverage.price}
                </span>
              </>
            )}

          </button>


          {/* VIEW MENU */}
          <button
            onClick={() => {
              const rest = restaurantList.find(
                (r) => r.id === currentBeverage.restaurantId
              );

              if (rest) {
                setSelectedRestaurant(rest);
                setCurrentView('restaurant-detail');
              }
            }}
            className="
              flex
              min-h-[48px]

              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-stone-800

              bg-stone-900

              px-4
              py-3

              text-xs
              font-semibold
              text-stone-300

              transition-all
              duration-200

              hover:border-stone-700
              hover:bg-stone-800
              hover:text-white

              active:scale-95

              cursor-pointer
            "
            title="View Full Roastery Menu"
          >
            <span className="sm:hidden">
              View Menu
            </span>

            <ChevronRight className="h-4 w-4" />

          </button>

        </div>

      </div>


      {/* =====================================================
          RIGHT — VISUAL SHOWCASE
      ====================================================== */}
     {/* ============================================================
    ANIMATED COFFEE SHOWCASE
============================================================ */}

<div
  className="
    relative
    flex
    min-h-[390px]
    w-full
    items-center
    justify-center

    sm:min-h-[470px]

    md:min-h-[540px]

    lg:min-h-[600px]

    xl:min-h-[650px]
  "
>

  {/* ==========================================================
      AMBIENT BACKGROUND GLOW
  =========================================================== */}
  <div
    className="
      absolute
      left-1/2
      top-1/2

      h-[250px]
      w-[250px]

      -translate-x-1/2
      -translate-y-1/2

      rounded-full

      bg-purple-600/10

      blur-[70px]

      sm:h-[340px]
      sm:w-[340px]

      md:h-[430px]
      md:w-[430px]

      lg:h-[500px]
      lg:w-[500px]
    "
  />


 


  {/* ==========================================================
      PORTAL INNER RING
  =========================================================== */}
  <div
    ref={portalInnerRef}
    className="
      gsap-portal-inner

      pointer-events-none

      absolute
      left-1/2
      top-1/2

      -translate-x-1/2
      -translate-y-1/2

      rounded-full

      border
      border-white/10

      h-[225px]
      w-[225px]

      sm:h-[300px]
      sm:w-[300px]

      md:h-[360px]
      md:w-[360px]

      lg:h-[425px]
      lg:w-[425px]

      xl:h-[465px]
      xl:w-[465px]
    "
  />


  {/* ==========================================================
      ROTATING OUTER RING
  =========================================================== */}
  <div
    ref={outerRingRef}
    className="
      gsap-outer-ring

      pointer-events-none

      absolute
      left-1/2
      top-1/2

      -translate-x-1/2
      -translate-y-1/2

      rounded-full

      border
      border-dashed
      border-amber-400/20

      h-[280px]
      w-[280px]

      sm:h-[370px]
      sm:w-[370px]

      md:h-[440px]
      md:w-[440px]

      lg:h-[510px]
      lg:w-[510px]

      xl:h-[550px]
      xl:w-[550px]
    "
  />


  {/* ==========================================================
      FLOATING ELEMENTS CONTAINER
  =========================================================== */}
  <div
    className="
      absolute
      inset-0

      z-30

      pointer-events-none

      overflow-visible
    "
  >

    {/* ========================================================
        COFFEE BEAN #1
    ========================================================= */}
    <div
      ref={bean1Ref}
      className="
        gsap-floating-bean

        absolute

        right-[12%]
        top-[16%]

        h-8
        w-8

        sm:right-[14%]
        sm:top-[15%]

        sm:h-10
        sm:w-10

        md:right-[13%]
        md:top-[13%]

        md:h-11
        md:w-11

        lg:right-[11%]
        lg:top-[11%]

        lg:h-12
        lg:w-12
      "
    >

      <img
        src="/src/assets/images/single_coffee_bean_1789210003013.jpg"
        alt="Floating coffee bean"
        referrerPolicy="no-referrer"
        draggable={false}
        className="
          h-full
          w-full

          rounded-full

          object-cover

          shadow-[0_12px_25px_rgba(0,0,0,0.75)]

          select-none
        "
      />

    </div>


    {/* ========================================================
        COFFEE BEAN #2
    ========================================================= */}
    <div
      ref={bean2Ref}
      className="
        gsap-floating-bean

        absolute

        bottom-[17%]
        left-[12%]

        h-7
        w-7

        sm:bottom-[14%]
        sm:left-[14%]

        sm:h-9
        sm:w-9

        md:bottom-[12%]
        md:left-[12%]

        md:h-10
        md:w-10

        lg:bottom-[10%]
        lg:left-[10%]

        lg:h-11
        lg:w-11
      "
    >

      <img
        src="/src/assets/images/single_coffee_bean_1789210003013.jpg"
        alt="Floating coffee bean"
        referrerPolicy="no-referrer"
        draggable={false}
        className="
          h-full
          w-full

          rounded-full

          object-cover

          shadow-[0_10px_20px_rgba(0,0,0,0.8)]

          select-none
        "
      />

    </div>


    {/* ========================================================
        COFFEE BEAN #3
    ========================================================= */}
    <div
      ref={bean3Ref}
      className="
        gsap-floating-bean

        absolute

        bottom-[26%]
        right-[10%]

        h-6
        w-6

        sm:h-8
        sm:w-8

        md:h-9
        md:w-9

        lg:h-10
        lg:w-10
      "
    >

      <img
        src="/src/assets/images/single_coffee_bean_1789210003013.jpg"
        alt="Floating coffee bean"
        referrerPolicy="no-referrer"
        draggable={false}
        className="
          h-full
          w-full

          rounded-full

          object-cover

          shadow-[0_8px_18px_rgba(0,0,0,0.8)]

          select-none
        "
      />

    </div>


    {/* ========================================================
        ICE CUBE
    ========================================================= */}
    <div
      ref={iceCubeRef}
      onClick={handleIceClick}
      title="Click the ice cube"
      className="
        gsap-floating-ice

        pointer-events-auto

        absolute

        left-[9%]
        top-[23%]

        flex
        h-11
        w-11

        items-center
        justify-center

        rounded-xl

        border
        border-white/40

        bg-white/10

        backdrop-blur-md

        shadow-[0_10px_30px_rgba(255,255,255,0.12)]

        rotate-12

        cursor-pointer

        transition-all
        duration-300

        hover:scale-110
        hover:bg-white/15

        active:scale-90

        sm:left-[11%]
        sm:top-[20%]

        sm:h-12
        sm:w-12

        md:left-[10%]
        md:top-[18%]

        lg:left-[8%]
        lg:top-[17%]

        lg:h-14
        lg:w-14
      "
    >

      <span
        className="
          whitespace-nowrap

          text-[8px]
          font-mono
          font-bold
          text-cyan-200

          sm:text-[10px]
        "
      >
        ❄️ -2°C
      </span>

    </div>


    {/* ========================================================
        SMALL SPARK #1
    ========================================================= */}
    <div
      ref={spark1Ref}
      className="
        absolute

        left-[22%]
        top-[12%]

        h-1.5
        w-1.5

        rounded-full

        bg-amber-300

        shadow-[0_0_12px_rgba(251,191,36,0.8)]
      "
    />


    {/* ========================================================
        SMALL SPARK #2
    ========================================================= */}
    <div
      ref={spark2Ref}
      className="
        absolute

        right-[24%]
        bottom-[18%]

        h-1
        w-1

        rounded-full

        bg-purple-300

        shadow-[0_0_12px_rgba(192,132,252,0.8)]
      "
    />


    {/* ========================================================
        SMALL SPARK #3
    ========================================================= */}
    <div
      ref={spark3Ref}
      className="
        absolute

        right-[18%]
        top-[35%]

        h-1.5
        w-1.5

        rounded-full

        bg-cyan-300

        shadow-[0_0_12px_rgba(103,232,249,0.8)]
      "
    />

  </div>


  {/* ==========================================================
      MAIN BEVERAGE
  =========================================================== */}
  <div
    ref={centerpieceRef}
    className="
      gsap-centerpiece

      relative
      z-20

      flex
      items-center
      justify-center

      h-[285px]
      w-[285px]

      cursor-grab

      active:cursor-grabbing

      sm:h-[360px]
      sm:w-[360px]

      md:h-[420px]
      md:w-[420px]

      lg:h-[475px]
      lg:w-[475px]

      xl:h-[515px]
      xl:w-[515px]
    "
    style={{
      perspective: '1200px',
    }}
  >

    {/* ========================================================
        ROTATING PRODUCT RING
    ========================================================= */}
    <div
      ref={productRingRef}
      className="
        gsap-product-ring

        absolute
        inset-[4%]

        rounded-full

        border
        border-white/10

        pointer-events-none
      "
    />


    {/* ========================================================
        IMAGE CIRCLE
    ========================================================= */}
    <div
      ref={productImageRef}
      className="
        gsap-product-image

        relative

        overflow-hidden

        rounded-full

        border-[5px]
        border-stone-950

        bg-stone-950

        shadow-[0_30px_90px_rgba(0,0,0,0.85)]

        h-[245px]
        w-[245px]

        sm:h-[310px]
        sm:w-[310px]

        sm:border-[6px]

        md:h-[365px]
        md:w-[365px]

        lg:h-[410px]
        lg:w-[410px]

        xl:h-[445px]
        xl:w-[445px]
      "
    >

      <img
        src="./public/ice.jpg"
        alt={currentBeverage.name}
        referrerPolicy="no-referrer"
        draggable={false}
        className="
          h-full
          w-full

          rounded-full

          object-cover

          select-none

          pointer-events-none

          transition-transform
          duration-700
          ease-out
        "
      />


      {/* ======================================================
          IMAGE GLOW
      ======================================================= */}
      <div
        className="
          pointer-events-none

          absolute
          inset-0

          rounded-full

          bg-gradient-to-tr
          from-black/40
          via-transparent
          to-white/10
        "
      />


      {/* ======================================================
          INNER LIGHT
      ======================================================= */}
      <div
        className="
          pointer-events-none

          absolute
          inset-[5%]

          rounded-full

          border
          border-white/10
        "
      />

    </div>


    {/* ========================================================
        PULSE RING
    ========================================================= */}
    <div
      ref={pulseRingRef}
      className="
        gsap-pulse-ring

        pointer-events-none

        absolute

        h-[160px]
        w-[160px]

        rounded-full

        border
        border-white/10

        sm:h-[210px]
        sm:w-[210px]

        md:h-[250px]
        md:w-[250px]

        lg:h-[290px]
        lg:w-[290px]
      "
    />

  </div>


  {/* ==========================================================
      ROASTERY SEAL
  =========================================================== */}
  <div
    ref={sealRef}
    className="
      gsap-seal-container

      absolute

      right-[3%]
      top-[7%]

      z-40

      sm:right-[5%]
      sm:top-[5%]

      md:right-[6%]

      lg:right-[2%]
      lg:top-[4%]

      xl:right-[4%]
  "
  >

    <div
      className="
        relative

        h-[78px]
        w-[78px]

        cursor-pointer

        sm:h-[95px]
        sm:w-[95px]

        md:h-[110px]
        md:w-[110px]

        lg:h-[125px]
        lg:w-[125px]

        xl:h-[135px]
        xl:w-[135px]
      "
    >

      {/* ======================================================
          ROTATING SEAL TEXT
      ======================================================= */}
      <div
        className="
          gsap-seal-spinner

          absolute
          inset-0
        "
      >

        <svg
          viewBox="0 0 160 160"
          className="h-full w-full"
        >

          <path
            id="stamp-circle-path"
            d="
              M 80,80
              m -60,0
              a 60,60 0 1,1 120,0
              a 60,60 0 1,1 -120,0
            "
            fill="none"
          />

          <text
            className="
              fill-amber-300

              text-[10px]
              font-mono
              font-bold
              tracking-wider
            "
          >

            <textPath
              href="#stamp-circle-path"
              startOffset="0%"
            >
              {currentBeverage.badgeText}
            </textPath>

          </text>

        </svg>

      </div>


      {/* ======================================================
          SEAL CENTER
      ======================================================= */}
      <div
        className="
          absolute

          inset-[18%]

          flex
          items-center
          justify-center

          rounded-full

          border-2
          border-dashed
          border-amber-500/40

          bg-stone-900/90

          shadow-xl

          backdrop-blur-md

          transition-all
          duration-300

          hover:border-amber-400
        "
      >

        <div
          className="
            h-7
            w-7

            overflow-hidden

            rounded-full

            bg-stone-950

            p-1

            sm:h-8
            sm:w-8

            md:h-9
            md:w-9

            lg:h-10
            lg:w-10
          "
        >

          <img
            src="/src/assets/images/single_coffee_bean_1789210003013.jpg"
            alt="Roasted coffee bean"
            referrerPolicy="no-referrer"
            draggable={false}
            className="
              h-full
              w-full

              rounded-full

              object-cover
            "
          />

        </div>

      </div>

    </div>

  </div>

</div>
    </div>

  </div>

</section>

          {/* USER REQUESTED MODAL: "Escape the ordinary, sip the extraordinary" shown via button */}
          {isStoryModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md transition-all duration-300"
              onClick={() => setIsStoryModalOpen(false)}
            >
              <div
                className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-700/80 shadow-2xl p-6 sm:p-7 text-white space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Title & Close Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center text-amber-400">
                        <Coffee className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        Signature Harvest
                      </span>
                      <h3 className="font-display font-bold text-white text-base">
                        {currentBeverage.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsStoryModalOpen(false)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Headline & Narrative */}
                <div className="space-y-2">
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
                    {currentBeverage.headline}
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {currentBeverage.subtext}
                  </p>
                </div>

                {/* Origin & Roastery Heritage */}
                <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                    <Compass className="w-4 h-4" />
                    <span>Single-Origin Terroir</span>
                  </div>
                  <p className="text-xs text-stone-300 font-mono">
                    {currentBeverage.originTag}
                  </p>
                </div>

                {/* Extraction & Sensory Profile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-stone-400 font-mono text-xs">
                    <span>SENSORY EXTRACTION PROFILE</span>
                    <span className="text-amber-400 font-bold">100% ETHICAL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Sweetness</span>
                      <span className="font-bold text-white">{currentBeverage.sensory.sweetness}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Acidity</span>
                      <span className="font-bold text-amber-400">{currentBeverage.sensory.acidity}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Body / Texture</span>
                      <span className="font-bold text-stone-200">{currentBeverage.sensory.body}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Chill Temp</span>
                      <span className="font-bold text-cyan-400">{currentBeverage.sensory.temp}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleQuickOrder();
                      setIsStoryModalOpen(false);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sip Signature • ₹{currentBeverage.price}</span>
                  </button>
                  <button
                    onClick={() => setIsStoryModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs sm:text-sm transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INTERACTIVE BEVERAGE CAROUSEL SELECTOR & OMNI SEARCH */}
          <div className="gsap-bottom-bar space-y-6">
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-stone-800/80">
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-white">SELECT ARTISANAL CRAFT:</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {BEVERAGES.map((bev, index) => {
                  const isSelected = index === activeBeverageIndex;
                  return (
                    <button
                      key={bev.id}
                      onClick={() => handleBeverageSelect(index)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer border ${isSelected
                          ? 'bg-stone-800 text-amber-400 border-amber-500/80 shadow-lg shadow-amber-500/10'
                          : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                      <span>{bev.name}</span>
                      <span className="font-mono text-[11px] text-stone-500">₹{bev.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OMNI SEARCH & DISCOVERY BAR: Seamless access to all 480+ restaurants */}
            <div className="p-2 rounded-2xl bg-stone-900/90 border border-stone-700 shadow-2xl backdrop-blur-md space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Location button */}
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 text-stone-200 text-xs font-semibold shrink-0 border border-stone-700/60 transition cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate max-w-[140px]">{currentLocation.area}</span>
                </button>

                {/* Universal search trigger */}
                <div
                  onClick={() => setIsUniversalSearchOpen(true)}
                  className="flex-1 flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/50 text-stone-400 hover:text-stone-200 text-sm cursor-pointer transition"
                >
                  <Search className="w-4 h-4 text-stone-400" />
                  <span className="text-xs sm:text-sm">
                    Craving Iced Boba, Woodfired Pizza, Truffle Burgers or Dum Biryani?
                  </span>
                </div>

                {/* Explore all kitchens CTA */}
                <button
                  onClick={() => setCurrentView('restaurants')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer"
                >
                  <span>Explore All Kitchens</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trending Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 px-1 text-xs">
                <span className="text-stone-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-500" /> Trending:
                </span>
                {['Boba Iced Latte', 'Dirty Matcha', 'Truffle Smash Burger', 'Burrata Pizza', 'Cold Brew Cascara', 'Awadhi Biryani'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickSearch(tag)}
                    className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition text-[11px] font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
