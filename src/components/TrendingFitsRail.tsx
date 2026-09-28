import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface TrendingFitsRailProps {
  products: Product[];
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  onSeeAll: () => void;
}

export const TrendingFitsRail: React.FC<TrendingFitsRailProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  onSeeAll,
}) => {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (railRef.current) {
      railRef.current.scrollBy({
        left: -railRef.current.clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (railRef.current) {
      railRef.current.scrollBy({
        left: railRef.current.clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Header with Navigation Arrows */}
      <div className="flex justify-between items-baseline mb-6 md:mb-8">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-900 tracking-wide uppercase font-normal">
          Trending fits
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onSeeAll}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
          >
            See all
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={scrollLeft}
              aria-label="Previous items"
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Next items"
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Rail */}
      <div
        ref={railRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((prod) => (
          <div
            key={prod.id}
            className="shrink-0 w-[calc(65%-10px)] sm:w-[calc(40%-12px)] md:w-[calc(25%-12px)] snap-start"
          >
            <ProductCard
              product={prod}
              currency={currency}
              isWishlisted={wishlistIds.has(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onViewProduct={onViewProduct}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
