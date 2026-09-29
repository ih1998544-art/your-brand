import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product, Currency } from '../../types';

interface BeautyProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const BeautyProductCard: React.FC<BeautyProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Price conversion
  const formattedPrice = (priceVal: number) => {
    const converted = Math.round(priceVal * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '100ml';

  const handleSelectSizeAndAdd = (size: string) => {
    onQuickAdd(product, size);
    setSizePickerOpen(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const primaryImage = product.imageUrl || '/src/assets/images/cat_fragrance_luxe_1790706160651.jpg';
  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1]
      : primaryImage;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSizePickerOpen(false);
      }}
      className="group relative flex flex-col bg-white border border-neutral-100 hover:border-neutral-300 transition-all duration-300"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50 cursor-pointer">
        {/* Main Image with Hover Swap */}
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          onClick={() => onQuickView(product)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges: Sale & New */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-red-700 text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-950 text-white font-sans text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Save to wishlist"
          className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 transition-colors shadow-xs"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-600 text-red-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-neutral-900 text-[11px] font-sans font-semibold uppercase tracking-wider py-2 shadow-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Box */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Scent Note */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
            <span>{product.subCategory || product.beautyCategory || 'Beauty'}</span>
            {product.volume && <span>{product.volume}</span>}
            {product.shade && <span>{product.shade}</span>}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-sans text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1 hover:underline cursor-pointer tracking-normal mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Key Olfactory / Formula summary */}
          {product.fragranceNotes?.top && (
            <p className="text-[10px] text-neutral-400 font-light line-clamp-1 mb-2">
              Notes: {product.fragranceNotes.top}
            </p>
          )}
        </div>

        {/* Pricing & Add To Bag Area */}
        <div className="pt-2 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-xs sm:text-sm font-semibold text-neutral-950">
                {formattedPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-[11px] text-neutral-400 line-through">
                  {formattedPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* In stock indicator */}
            <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">
              In Stock
            </span>
          </div>

          {/* Size / Volume selector or Quick Add Button */}
          {sizePickerOpen ? (
            <div className="space-y-1.5 animate-fadeIn">
              <span className="text-[10px] uppercase font-semibold text-neutral-600 block">
                Select Size / Volume:
              </span>
              <div className="grid grid-cols-2 gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleSelectSizeAndAdd(sz)}
                    className="text-[10px] py-1 border border-neutral-300 hover:border-black hover:bg-neutral-950 hover:text-white transition-colors uppercase font-medium"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (product.sizes.length > 1) {
                  setSizePickerOpen(true);
                } else {
                  handleSelectSizeAndAdd(defaultSize);
                }
              }}
              className={`w-full text-xs font-sans font-semibold uppercase tracking-wider py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-neutral-900 text-white hover:bg-black'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
