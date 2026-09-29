import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BEAUTY_HERO_IMAGE } from '../../data/fragranceBeautyData';

interface BeautyHeroSectionProps {
  onShopFragrances: () => void;
  onShopBeauty: () => void;
}

export const BeautyHeroSection: React.FC<BeautyHeroSectionProps> = ({
  onShopFragrances,
  onShopBeauty,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Editorial Hero Container */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
        {/* Background Luxury Image */}
        <div className="absolute inset-0">
          <img
            src={BEAUTY_HERO_IMAGE}
            alt="Fragrance & Beauty Luxury Campaign"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-[1.05]"
          />
          {/* Subtle Warm Luxury Dark Vignette Overlay for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent sm:from-black/70 sm:via-black/40 sm:to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 lg:py-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-medium uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Parfumerie & Cosmetics</span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white uppercase leading-[1.1] mb-5">
              FRAGRANCE <br />
              <span className="font-light italic">& BEAUTY</span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-neutral-200 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-xl mb-8 tracking-wide">
              Discover scents and beauty essentials designed to become part of your signature.
              Artisanal Extraits de Parfum, pure cold-pressed botanical elixirs, and cashmere velvet lipsticks.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onShopFragrances}
                className="bg-white text-neutral-950 hover:bg-neutral-100 font-sans font-semibold text-xs uppercase tracking-widest px-8 py-3.5 flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer shadow-lg"
              >
                <span>SHOP FRAGRANCES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onShopBeauty}
                className="bg-transparent border border-white text-white hover:bg-white/10 font-sans font-semibold text-xs uppercase tracking-widest px-8 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
              >
                <span>SHOP BEAUTY</span>
              </button>
            </div>

            {/* Micro Feature Indicators */}
            <div className="mt-12 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-sm font-semibold text-white">25% Oil</span>
                <span className="text-[11px] text-neutral-300 font-light">Long-lasting Sillage</span>
              </div>
              <div>
                <span className="block font-serif text-sm font-semibold text-white">Cruelty-Free</span>
                <span className="text-[11px] text-neutral-300 font-light">Ethical Botanicals</span>
              </div>
              <div>
                <span className="block font-serif text-sm font-semibold text-white">Authentic</span>
                <span className="text-[11px] text-neutral-300 font-light">Rare Taif & Cambodian Oud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
