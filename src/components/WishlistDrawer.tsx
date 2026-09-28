import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product, Currency } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: Currency;
  onRemoveFromWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onRemoveFromWishlist,
  onQuickAdd,
  onViewProduct,
}) => {
  if (!isOpen) return null;

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              My Wishlist ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-medium text-neutral-600">Your wishlist is empty.</p>
              <p className="text-xs text-neutral-400">Save your favorite pieces for quick access later.</p>
            </div>
          ) : (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    onClose();
                    onViewProduct(prod);
                  }}
                  className="w-20 h-26 shrink-0 bg-neutral-100 overflow-hidden relative border border-neutral-200 cursor-pointer"
                >
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <VectorFashionArt
                      artKey={prod.categoryKey}
                      colorPalette={prod.colorPalette}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => {
                          onClose();
                          onViewProduct(prod);
                        }}
                        className="text-xs sm:text-[13px] font-medium text-neutral-900 leading-snug line-clamp-2 cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(prod)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 block mt-1">
                      {formatPrice(prod.price)}
                    </span>
                  </div>

                  {/* Quick Add Sizes */}
                  <div className="mt-2.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                      Add to Bag:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {prod.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => onQuickAdd(prod, sz)}
                          className="px-2 py-0.5 text-[10px] font-medium border border-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => {
                  onQuickAdd(p, p.sizes[0]);
                });
                onClose();
              }}
              className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
