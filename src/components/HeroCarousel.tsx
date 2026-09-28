import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VectorFashionArt } from './VectorFashionArt';
import { CategoryKey, Department } from '../types';

interface HeroCarouselProps {
  onShopClick: (categoryName: string) => void;
  department?: Department;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  categoryFilter: string;
  sceneKeys: CategoryKey[];
  colorPalette: string;
  imageUrl?: string;
}

const WOMEN_SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Pre-Winter Couture',
    subtitle: 'Champagne crystal embellishments, sculpted capes and heirloom hand-craft.',
    ctaText: 'Shop Couture',
    categoryFilter: 'Pre-Winter Couture',
    sceneKeys: ['dupatta', 'gown', 'coord'],
    colorPalette: '#2b2a33,#8b6f5a,#f1e3cc',
    imageUrl: '/src/assets/images/hero_ivory_gold_palace_1790618565665.jpg',
  },
  {
    id: 2,
    title: 'Regal Velvet Peshwas',
    subtitle: 'Opulent micro-velvet adorned with antique gold zardozi and naqshi embroidery.',
    ctaText: 'Shop Velvet Peshwas',
    categoryFilter: 'Regal Velvet Peshwas',
    sceneKeys: ['gown', 'dupatta', 'gown'],
    colorPalette: '#0d2f25,#1c5a46,#d5f2e6',
    imageUrl: '/src/assets/images/hero_emerald_velvet_regal_1790618579500.jpg',
  },
  {
    id: 3,
    title: 'Blush Organza Anarkali',
    subtitle: 'Romantic cascading silken layers with iridescent silver tilla embellishments.',
    ctaText: 'Shop Festive',
    categoryFilter: 'Formals',
    sceneKeys: ['gown', 'dupatta', 'gown'],
    colorPalette: '#3b1a33,#a04a6e,#f8dfe6',
    imageUrl: '/src/assets/images/hero_rose_organza_fairytale_1790618594563.jpg',
  },
  {
    id: 4,
    title: 'Sapphire Silk Formals',
    subtitle: 'Sculpted raw silk silhouettes with molten gold detailing and flowing capes.',
    ctaText: 'Explore Collection',
    categoryFilter: 'Ready to wear',
    sceneKeys: ['coord', 'kurta', 'dress'],
    colorPalette: '#14254b,#284b8f,#e1ecff',
    imageUrl: '/src/assets/images/hero_sapphire_silk_modern_1790618607545.jpg',
  },
];

const MEN_SLIDES: Slide[] = [
  {
    id: 101,
    title: "Men's Atelier Collection",
    subtitle: 'Authentic bespoke tailored Kameez Shalwar and regal Jamawar waistcoats.',
    ctaText: 'Shop Collection',
    categoryFilter: 'Kameez Shalwar',
    sceneKeys: ['kurta', 'coord', 'kurta'],
    colorPalette: '#172554,#1e3a8a,#dbeafe',
    imageUrl: '/src/assets/images/men_hero_banner_1790620241129.jpg',
  },
  {
    id: 102,
    title: 'Expression Series',
    subtitle: 'Crisp 100% fine combed cotton and liquid ammonia treated luxury silhouettes.',
    ctaText: 'Explore Series',
    categoryFilter: 'Kameez Shalwar',
    sceneKeys: ['kurta', 'kurta', 'coord'],
    colorPalette: '#18181b,#27272a,#fafafa',
    imageUrl: '/src/assets/images/men_kameez_shalwar_1790620146599.jpg',
  },
  {
    id: 103,
    title: 'Festive Ceremonial Kurta',
    subtitle: 'Opulent handloom raw silk adorned with antique gold zardozi and naqshi motifs.',
    ctaText: 'Shop Formal Kurta',
    categoryFilter: 'Formal Kurta',
    sceneKeys: ['gown', 'kurta', 'coord'],
    colorPalette: '#9a3412,#c2410c,#ffedd5',
    imageUrl: '/src/assets/images/men_formal_kurta_1790620174901.jpg',
  },
  {
    id: 104,
    title: 'Platinum Class Unstitched',
    subtitle: 'Authentic 100% pure Chinese silk Boski and superior Egyptian Latha.',
    ctaText: 'Shop Unstitched',
    categoryFilter: 'Unstitched',
    sceneKeys: ['dupatta', 'kurta', 'dupatta'],
    colorPalette: '#ca8a04,#854d0e,#fef9c3',
    imageUrl: '/src/assets/images/men_unstitched_boski_1790620213843.jpg',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onShopClick, department = 'Woman' }) => {
  const slides = department === 'Man' ? MEN_SLIDES : WOMEN_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset to 0 on department change
  useEffect(() => {
    setCurrentSlide(0);
  }, [department]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      aria-label="Featured collections"
      className="relative w-full h-[65vh] min-h-[440px] max-h-[720px] overflow-hidden bg-neutral-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Dark vignette gradient overlay for text readability */}
            <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />

            {/* Real World Photography / Visual Asset */}
            <div className="absolute inset-0 transform scale-100 transition-transform duration-[8000ms] ease-out">
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <VectorFashionArt
                  sceneKeys={slide.sceneKeys}
                  colorPalette={slide.colorPalette}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Text Overlay Caption */}
            <div className="absolute left-6 sm:left-12 md:left-20 bottom-12 sm:bottom-16 md:bottom-20 z-2 text-white max-w-xl">
              <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-neutral-300 mb-2 font-medium">
                New Season Edit
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] mb-3 text-white">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-neutral-200/90 mb-6 font-light max-w-md">
                {slide.subtitle}
              </p>
              <div>
                <button
                  onClick={() => onShopClick(slide.categoryFilter)}
                  className="inline-block bg-white text-neutral-950 hover:bg-neutral-100 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest border border-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                >
                  {slide.ctaText}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all ${
              idx === currentSlide
                ? 'w-8 h-1.5 bg-white rounded-full'
                : 'w-2 h-1.5 bg-white/40 hover:bg-white/70 rounded-full'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
