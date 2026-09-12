import React, { useEffect, useState } from 'react';
import { Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import { playCinematicWhoosh } from '../utils/audioEffects';

interface CinematicIntroOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  soundEnabled?: boolean;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  isOpen,
  onComplete,
  soundEnabled = true
}) => {
  const [phase, setPhase] = useState<'emerge' | 'spin' | 'zoom' | 'explode' | 'done'>('emerge');
  const [soundOn, setSoundOn] = useState(soundEnabled);

  useEffect(() => {
    if (!isOpen) return;

    setPhase('emerge');

    // Stage 1: Emerge and initial floating 3D tumble
    const t1 = setTimeout(() => {
      setPhase('spin');
    }, 400);

    // Stage 2: Rapid zoom into camera
    const t2 = setTimeout(() => {
      setPhase('zoom');
      if (soundOn) {
        playCinematicWhoosh();
      }
    }, 1400);

    // Stage 3: Burst / Explosion transition
    const t3 = setTimeout(() => {
      setPhase('explode');
    }, 2200);

    // Stage 4: Finish and close overlay
    const t4 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, soundOn, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none pointer-events-auto">
      {/* Ambient background particles and glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ${
            phase === 'zoom' 
              ? 'w-[800px] h-[800px] bg-amber-500/30 blur-[120px]' 
              : phase === 'explode'
              ? 'w-[1400px] h-[1400px] bg-purple-600/40 blur-[160px]'
              : 'w-[400px] h-[400px] bg-amber-600/15 blur-[90px]'
          }`} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Top Header / Skip & Sound controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block">
              The Crave Artisanal Experience
            </span>
            <span className="text-[11px] text-amber-400/80 font-mono">
              3D CINEMATIC BEAN PROLOGUE
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 text-stone-300 text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
            <span>{soundOn ? 'Sound On' : 'Muted'}</span>
          </button>
          
          <button
            onClick={onComplete}
            className="px-4 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer border border-stone-600"
          >
            <span>Skip Intro</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center 3D Coffee Bean Actor */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div 
          className="relative transition-all duration-700 ease-out"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Outer glow ring */}
          <div 
            className={`absolute -inset-10 rounded-full bg-amber-500/20 blur-2xl transition-opacity duration-500 ${
              phase === 'zoom' ? 'opacity-100 scale-150' : 'opacity-40'
            }`} 
          />

          {/* The 3D Coffee Bean Image with dynamic transforms */}
          <div
            className={`relative rounded-full transition-transform duration-700 ${
              phase === 'emerge'
                ? 'scale-75 opacity-90 rotate-[-12deg]'
                : phase === 'spin'
                ? 'scale-100 opacity-100 animate-[spin_4s_linear_infinite]'
                : phase === 'zoom'
                ? 'scale-[8] opacity-100 rotate-[45deg] blur-[1px]'
                : 'scale-[16] opacity-0 blur-xl'
            }`}
            style={{
              width: '260px',
              height: '260px',
              transformStyle: 'preserve-3d'
            }}
          >
            <img
              src="/cofee.jpg"
              alt="Artisanal Roasted Coffee Bean"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(245,158,11,0.3)] select-none pointer-events-none rounded-full"
            />
          </div>
        </div>

        {/* Phase Subtitle */}
        <div className="mt-8 text-center transition-all duration-500">
          <p className="text-stone-400 font-mono text-xs uppercase tracking-widest">
            {phase === 'emerge' && 'Sourcing Single-Origin Harvest...'}
            {phase === 'spin' && 'Hand-Roasted at 205°C...'}
            {phase === 'zoom' && 'Extracting The Extraordinary...'}
            {phase === 'explode' && 'Savor The Crave...'}
          </p>
          <div className="w-32 h-0.5 bg-stone-800 mx-auto mt-2 overflow-hidden rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500"
              style={{
                width: phase === 'emerge' ? '25%' : phase === 'spin' ? '60%' : phase === 'zoom' ? '95%' : '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Explosion Flash Overlay */}
      {phase === 'explode' && (
        <div className="absolute inset-0 bg-white/30 animate-[ping_0.6s_ease-out_1] pointer-events-none z-30" />
      )}
    </div>
  );
};
