import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Department } from '../types';

interface FeaturedBannerProps {
  onShopClick: (collection: string) => void;
  department?: Department;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ onShopClick, department = 'Woman' }) => {
  const isMan = department === 'Man';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Guarantee automatic autoplay without requiring user interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser initially blocks, mute and retry immediately
          video.muted = true;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full h-[60vh] min-h-[420px] max-h-[640px] overflow-hidden bg-neutral-950 group">
      {/* Cinematic Fashion Film Video Background with Guaranteed Autoplay */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={isMan ? '/src/assets/images/men_platinum_boski_video_1790620941781.jpg' : '/src/assets/images/noya_luxury_unstitched_1790617815906.jpg'}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-flowing-red-silk-fabric-41880-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-orange-dress-41804-large.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Cinematic Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/35 pointer-events-none" />

      {/* Video Control Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Campaign Badge (Top Left) */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-2 text-white/90 text-[11px] uppercase tracking-[0.2em] font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span>{isMan ? "Men's Atelier Unstitched • Boski & Latha Edition" : 'Atelier Fashion Film • Fall/Winter'}</span>
      </div>

      {/* Caption Content */}
      <div className="absolute inset-x-0 bottom-12 md:bottom-16 text-center text-white z-10 px-4">
        <span className="block text-xs uppercase tracking-[0.3em] text-neutral-300 mb-2 font-medium">
          {isMan ? 'Platinum Class Silk' : 'Unstitched Couture Collection'}
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide mb-3">
          {isMan ? 'Platinum Boski' : 'Noya'}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-200/90 max-w-lg mx-auto mb-6 font-light">
          {isMan
            ? 'Pure 7 Lbs Chinese silk Boski and superior Egyptian Latha presented in signature heirloom gift boxes.'
            : 'Hand-finished embellishments, flowing artisanal weaves, and tactile textures brought to life.'}
        </p>
        <button
          onClick={() => onShopClick('Unstitched')}
          className="inline-block bg-white text-neutral-950 hover:bg-neutral-100 px-9 py-3.5 text-xs font-semibold uppercase tracking-widest border border-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-2xl"
        >
          {isMan ? "Explore Men's Unstitched" : 'Explore Noya'}
        </button>
      </div>
    </section>
  );
};
