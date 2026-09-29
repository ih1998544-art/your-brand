import React, { useState, useRef, useMemo, useEffect } from 'react';
import { TeenProduct, getProductsForCategory, TeenCategory } from '../../data/teensData';
import { Currency } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Check,
  Grid3X3,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import { TeensQuickAddModal } from './TeensQuickAddModal';

interface TeensTrendingSectionProps {
  products?: TeenProduct[];
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string, productName: string) => void;
  onQuickAdd: (product: TeenProduct, size: string) => void;
  onViewProduct?: (product: TeenProduct) => void;
}

const TABS: TeenCategory[] = [
  "Summer '26",
  'Teen Girls',
  'Teen Boys',
  'Kid Girls',
  'Kid Boys',
  'Infant',
  'Trending',
  'Sale',
];

export const TeensTrendingSection: React.FC<TeensTrendingSectionProps> = ({
  activeCategory = "Summer '26",
  onSelectCategory,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
}) => {
  const [internalTab, setInternalTab] = useState<string>(activeCategory);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [quickAddProduct, setQuickAddProduct] = useState<TeenProduct | null>(null);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync with activeCategory prop
  const currentTab = onSelectCategory ? activeCategory : internalTab;

  // Reset selected sizes & trigger transition when tab changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timer);
  }, [currentTab]);

  const handleTabChange = (tab: string) => {
    setInternalTab(tab);
    onSelectCategory?.(tab);
  };

  // Exactly 15 unique products for the active category
  const displayProducts = useMemo(() => {
    return getProductsForCategory(currentTab);
  }, [currentTab]);

  const formatPrice = (pkr: number) => {
    const converted = pkr * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkr.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleSelectSize = (productId: string, size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: prev[productId] === size ? '' : size,
    }));
  };

  const handleCardQuickAdd = (product: TeenProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    const preselectedSize = selectedSizes[product.id];
    if (preselectedSize) {
      onQuickAdd(product, preselectedSize);
    } else {
      setQuickAddProduct(product);
    }
  };

  return (
    <section
      id="trending"
      className="py-14 sm:py-20 bg-neutral-50/80 border-t border-b border-neutral-200/70 relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header & View Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                Exclusive Collection
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-neutral-950">
              {currentTab}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Showing exactly 15 unique luxury articles with dual-angle hover views & instant size selection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              15 Articles
            </span>

            {/* View Mode Toggle: Slider vs Responsive Grid */}
            <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-xs shadow-xs">
              <button
                onClick={() => setViewMode('slider')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black'
                }`}
                title="Slider View"
                aria-label="Slider View"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Slider Navigation Arrows (in slider mode) */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollLeft}
                  className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-9 h-9 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-950 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  aria-label="Next products"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Category Tabs: 8 Categories */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-4 border-b border-neutral-200">
          {TABS.map((tab) => {
            const isActive = currentTab === tab;
            const isSale = tab === 'Sale';
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? isSale
                      ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-700/20'
                      : 'bg-neutral-950 text-white shadow-sm ring-2 ring-neutral-950/20'
                    : isSale
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-950'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 15 Dedicated Products Display with consistent size selectors & dual hover images */}
        <div
          ref={sliderRef}
          className={`transition-opacity duration-300 ${
            isTransitioning ? 'opacity-40' : 'opacity-100'
          } ${
            viewMode === 'slider'
              ? 'flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pt-8 pb-6 scroll-smooth snap-x snap-mandatory'
              : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pt-8 pb-6'
          }`}
        >
          {displayProducts.map((product) => {
            const isWishlisted = wishlistIds.has(product.id);
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            const selectedSize = selectedSizes[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onViewProduct?.(product)}
                className={`group flex flex-col bg-white border border-neutral-200/90 hover:border-neutral-950 transition-all duration-400 rounded-xs shadow-xs hover:shadow-xl cursor-pointer ${
                  viewMode === 'slider'
                    ? 'w-[250px] sm:w-[275px] lg:w-[290px] shrink-0 snap-start'
                    : 'w-full'
                }`}
              >
                {/* Product Image Container with Dual-Image Hover Crossfade */}
                <div className="relative aspect-3/4 overflow-hidden bg-neutral-100 rounded-t-xs">
                  {/* Primary Image with gentle zoom on hover */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Secondary Hover Image (Consistently fades in on mouse hover across all 15 items) */}
                  {product.hoverImageUrl && (
                    <img
                      src={product.hoverImageUrl}
                      alt={`${product.name} alternate angle view`}
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none"
                      loading="lazy"
                    />
                  )}

                  {/* Hover vignette overlay */}
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/15 transition-colors duration-300 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                    {product.badge && (
                      <span
                        className={`text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-xs ${
                          product.badge === 'Sale'
                            ? 'bg-rose-700'
                            : product.badge === 'Summer 26'
                            ? 'bg-amber-600'
                            : 'bg-neutral-950'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-rose-700 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs shadow-xs">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Out of Stock Ribbon */}
                  {!product.inStock && (
                    <span className="absolute top-2.5 right-2.5 bg-rose-700 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs shadow-xs z-10">
                      Sold Out
                    </span>
                  )}

                  {/* Quick View Hover Pill on Image */}
                  <div className="absolute inset-x-4 bottom-14 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 pointer-events-none hidden sm:block">
                    <div className="bg-white/95 backdrop-blur-xs text-neutral-900 text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full text-center shadow-md flex items-center justify-center gap-1.5 border border-neutral-200">
                      <Eye className="w-3 h-3 text-neutral-600" />
                      <span>Click to View Full Details</span>
                    </div>
                  </div>

                  {/* Wishlist Heart Icon with hover feedback */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id, product.name);
                    }}
                    className={`absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                      isWishlisted
                        ? 'bg-red-50 text-red-600 scale-105 shadow-red-200'
                        : 'bg-white/90 text-neutral-700 hover:text-black hover:bg-white hover:scale-110'
                    }`}
                    aria-label="Toggle wishlist"
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  </button>
                </div>

                {/* Card Content & Consistently Displayed Interactive Size Selector */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                      <span>{product.category}</span>
                      <span className="text-neutral-500 font-mono text-[9px]">{product.sku}</span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wide truncate group-hover:text-amber-800 transition-colors mt-1">
                      {product.name}
                    </h3>

                    {/* Price with strikethrough & discount */}
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
                        <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.2 rounded-xs">
                          Save {formatPrice(product.originalPrice! - product.price)}
                        </span>
                      )}
                    </div>

                    {/* Consistent Size Selector on Every Single Product Card */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                          Select Size:
                        </span>
                        {selectedSize ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Size {selectedSize}
                          </span>
                        ) : (
                          <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                            Choose size
                          </span>
                        )}
                      </div>

                      {/* Size Chips */}
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((sz) => {
                          const isPicked = selectedSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={(e) => handleSelectSize(product.id, sz, e)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-xs transition-all border cursor-pointer ${
                                isPicked
                                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs scale-105 ring-1 ring-neutral-950'
                                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-100'
                              }`}
                              title={`Select size ${sz}`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Add Button with Size State Feedback */}
                  <button
                    type="button"
                    onClick={(e) => handleCardQuickAdd(product, e)}
                    disabled={!product.inStock}
                    className={`w-full py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 rounded-xs cursor-pointer ${
                      selectedSize
                        ? 'bg-amber-400 hover:bg-amber-500 text-neutral-950 font-extrabold shadow-sm'
                        : 'bg-neutral-900 text-white hover:bg-black group-hover:bg-neutral-950'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {!product.inStock
                        ? 'Out of Stock'
                        : selectedSize
                        ? `Add Size ${selectedSize}`
                        : 'Quick Add'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Add Modal */}
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
