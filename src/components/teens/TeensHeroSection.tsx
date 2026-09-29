import React, { useState, useEffect } from 'react';
import { HeroSlide, INITIAL_HERO_SLIDES, TeenCategory } from '../../data/teensData';
import { ArrowRight, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';

interface TeensHeroSectionProps {
  slides?: HeroSlide[];
  onSelectCategory: (categoryName: TeenCategory | string) => void;
  onOpenCms?: () => void;
}

export const TeensHeroSection: React.FC<TeensHeroSectionProps> = ({
  slides = INITIAL_HERO_SLIDES,
  onSelectCategory,
  onOpenCms,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play timer for slides
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = () => {
    onSelectCategory(activeSlide.categoryTarget);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-950 text-white min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] flex items-center group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images for all 5 slides with smooth cross-fade */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <picture>
              {slide.mobileImageUrl && (
                <source media="(max-width: 640px)" srcSet={slide.mobileImageUrl} />
              )}
              <img
                src={slide.imageUrl}
                alt={slide.heading}
                className="w-full h-full object-cover object-center filter brightness-95 scale-100 transition-transform duration-7000 ease-out group-hover:scale-105"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </picture>

            {/* Dynamic Overlay */}
            <div
              className="absolute inset-0 bg-neutral-950 transition-opacity"
              style={{ opacity: slide.overlayOpacity ?? 0.32 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-neutral-950/40" />
          </div>
        );
      })}

      {/* Admin Quick Edit Button */}
      {onOpenCms && (
        <button
          onClick={onOpenCms}
          className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white text-neutral-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all backdrop-blur-xs"
          title="Edit Section 1 in CMS"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Hero</span>
        </button>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20 hover:scale-110 shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-white/20 hover:scale-110 shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Hero Content Block */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-12 w-full py-16 sm:py-24">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xs shadow-xs">
            <span>{activeSlide.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[1.1] drop-shadow-sm">
            {activeSlide.heading}
          </h1>

          <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed max-w-xl drop-shadow-xs">
            {activeSlide.subtitle}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={handleCtaClick}
              className="group bg-white text-neutral-950 hover:bg-amber-300 px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 shadow-xl flex items-center gap-2.5 rounded-xs cursor-pointer"
            >
              <span>{activeSlide.buttonText || 'Shop Collection'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <span className="text-xs text-neutral-300/80 uppercase tracking-widest hidden sm:inline-block">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-8 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${slide.heading}`}
            />
          );
        })}
      </div>
    </section>
  );
};
