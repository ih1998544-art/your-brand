import React, { useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../../types';
import { TOP_10_SALE_BEAUTY_PRODUCTS } from '../../data/fragranceBeautyData';
import { BeautyProductCard } from './BeautyProductCard';

interface BeautySaleSectionProps {
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
  onViewAllSale: () => void;
}

const SALE_HIGHLIGHTS = [
  { rank: '#1', badge: 'Vault Exclusive -30%', note: '5 Miniature Parfums' },
  { rank: '#2', badge: 'Best Value -33%', note: 'Velvet Trunk & 3 Essentials' },
  { rank: '#3', badge: 'Signature Scent -17%', note: 'Taif Rose & Oud Extrait' },
  { rank: '#4', badge: 'Iconic Floral -13%', note: 'Bulgarian Rose EDP' },
  { rank: '#5', badge: 'Pure 24K Gold -20%', note: 'Cellular Botanical Elixir' },
  { rank: '#6', badge: 'Flawless Base -16%', note: 'Second-Skin Foundation' },
  { rank: '#7', badge: 'Cashmere Pout -14%', note: 'Rosewood Velvet Matte' },
  { rank: '#8', badge: 'Barrier Shield -18%', note: '5x Ceramide Whipped Cream' },
  { rank: '#9', badge: 'Sunlit Mist -18%', note: 'Mediterranean Citrus Body Mist' },
  { rank: '#10', badge: 'Home Ambiance -17%', note: 'Smoked Amber Reed Diffuser' },
];

export const BeautySaleSection: React.FC<BeautySaleSectionProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onQuickView,
  onViewAllSale,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Editorial Decorative Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/80 text-red-300 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] mb-3">
              <Tag className="w-3.5 h-3.5 text-red-400" />
              <span>Limited Time Offers &bull; Up to 33% Off</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal uppercase tracking-tight">
              TOP 10 SALE PICKS & COFFRETS
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-light mt-2 max-w-xl">
              Curated celebratory deals on award-winning extraits de parfum, limited luxury vaults, velvet lipsticks, and rejuvenating botanical elixirs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewAllSale}
              className="text-xs uppercase tracking-widest text-neutral-300 hover:text-white font-semibold flex items-center gap-2 py-2 px-3 hover:bg-neutral-800/60 transition-colors"
            >
              <span>View All Sale Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Scroll Navigation Chevrons */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Top 10 Horizontal Rail */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory"
        >
          {TOP_10_SALE_BEAUTY_PRODUCTS.map((prod, index) => {
            const highlight = SALE_HIGHLIGHTS[index] || {
              rank: `#${index + 1}`,
              badge: 'Sale Deal',
              note: '',
            };

            return (
              <div
                key={prod.id}
                className="w-[280px] sm:w-[310px] shrink-0 snap-start flex flex-col group relative"
              >
                {/* Custom Rank & Discount Ribbon */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="font-serif text-sm font-bold text-amber-300 tracking-wider">
                    {highlight.rank}
                  </span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-red-900/90 text-red-100 border border-red-700 px-2 py-0.5">
                    {highlight.badge}
                  </span>
                </div>

                {/* Product Card Container with White Interior for Clean Visual Contrast */}
                <div className="bg-white rounded-none overflow-hidden shadow-xl text-neutral-900 flex-1 flex flex-col border border-neutral-800 hover:border-neutral-500 transition-all duration-300">
                  <BeautyProductCard
                    product={prod}
                    currency={currency}
                    isWishlisted={wishlistIds.has(prod.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickAdd={onQuickAdd}
                    onQuickView={onQuickView}
                  />

                  {/* Highlights Note footer */}
                  {highlight.note && (
                    <div className="px-3.5 py-1.5 bg-neutral-100 border-t border-neutral-200 text-[10px] text-neutral-600 flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{highlight.note}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
