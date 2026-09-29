import React, { useRef, useState } from 'react';
import { TeenProduct } from '../../data/teensData';
import { Currency } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { TeensQuickAddModal } from './TeensQuickAddModal';

interface TeensTrendingFitsProps {
  products: TeenProduct[];
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
  onQuickAdd: (product: TeenProduct, size: string) => void;
  onViewProduct?: (product: TeenProduct) => void;
  onOpenCms?: () => void;
}

export const TeensTrendingFits: React.FC<TeensTrendingFitsProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  onOpenCms,
}) => {
  const [quickAddProduct, setQuickAddProduct] = useState<TeenProduct | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const formatPrice = (pkr: number) => {
    const converted = pkr * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkr.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                Infants & Little Icons
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-neutral-950">
              Trending Fits
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Pure hypoallergenic fabrics and joyful silhouettes tailored for infants and kids
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              {products.length} articles
            </span>

            {/* Previous / Next buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {onOpenCms && (
              <button
                onClick={onOpenCms}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold uppercase tracking-wider pl-2 border-l border-neutral-300"
                title="Edit Trending Fits"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>CMS</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Slider: ~23 Products */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => {
            const isWishlisted = wishlistIds.has(product.id);
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="w-[230px] sm:w-[260px] lg:w-[280px] shrink-0 snap-start flex flex-col group bg-white border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 rounded-xs shadow-xs hover:shadow-md"
              >
                {/* Product Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {product.hoverImageUrl && (
                    <img
                      src={product.hoverImageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                      loading="lazy"
                    />
                  )}

                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-neutral-950 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  {!product.inStock && (
                    <span className="absolute top-2.5 right-2.5 bg-rose-700 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-xs">
                      Sold Out
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id, product.name);
                    }}
                    className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                      isWishlisted
                        ? 'bg-red-50 text-red-600 scale-105'
                        : 'bg-white/90 text-neutral-700 hover:text-black hover:bg-white'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`}
                    />
                  </button>
                </div>

                {/* Content & Quick Add */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                      {product.category}
                    </div>

                    <h3
                      onClick={() => onViewProduct?.(product)}
                      className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wide truncate hover:text-neutral-600 transition-colors cursor-pointer mt-0.5"
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-sm font-bold text-neutral-950">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Available Sizes (8M, 12M, 2Y, etc.) */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {product.sizes.map((sz) => (
                        <span
                          key={sz}
                          className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-semibold rounded-xs"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (product.inStock) {
                        setQuickAddProduct(product);
                      }
                    }}
                    disabled={!product.inStock}
                    className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 rounded-xs disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                    <span>{product.inStock ? 'Quick Add' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickAddProduct && (
        <TeensQuickAddModal
          product={quickAddProduct}
          currency={currency}
          onClose={() => setQuickAddProduct(null)}
          onConfirmAdd={(p, sz) => {
            onQuickAdd(p, sz);
          }}
        />
      )}
    </section>
  );
};
