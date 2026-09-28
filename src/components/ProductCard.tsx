import React from 'react';
import { Heart } from 'lucide-react';
import { Product, Currency } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
}) => {
  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <article className="group relative flex flex-col h-full bg-white text-left">
      {/* Media / Visual Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              New in
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-700 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-white text-red-600 shadow-md'
              : 'bg-white/85 text-neutral-800 hover:bg-white hover:text-red-500 shadow-xs'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-red-600 text-red-600' : ''
            }`}
          />
        </button>

        {/* Product Art (Clickable to view detail modal) */}
        <button
          onClick={() => onViewProduct(product)}
          className="w-full h-full block focus:outline-hidden"
          aria-label={`View details of ${product.name}`}
        >
          <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-103">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <VectorFashionArt
                artKey={product.categoryKey}
                colorPalette={product.colorPalette}
              />
            )}
          </div>
        </button>

        {/* Quick Add Slide-up Drawer */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xs p-3 transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-250 ease-out z-20 border-t border-neutral-200 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-800">
              Quick add
            </span>
            <span className="text-[10px] text-neutral-500 uppercase">Select size</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product, sz);
                }}
                className="flex-1 min-w-[34px] py-1 px-1.5 text-[11px] font-medium border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors rounded-xs text-center"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="pt-3 pb-2 flex flex-col grow justify-between">
        <div>
          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
            {product.fabric}
          </span>
          <button
            onClick={() => onViewProduct(product)}
            className="text-xs sm:text-[13px] font-normal text-neutral-900 hover:text-neutral-600 line-clamp-2 leading-snug transition-colors text-left"
          >
            {product.name}
          </button>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span
            className={`text-xs sm:text-[13px] font-medium tracking-tight ${
              hasDiscount ? 'text-red-700' : 'text-neutral-950'
            }`}
          >
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
