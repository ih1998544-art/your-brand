import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Product, Currency } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: Currency;
  onRemoveFromWishlist: (product: Product) => void;
  onClearWishlist?: () => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  onMoveToBag?: (product: Product, size: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onRemoveFromWishlist,
  onClearWishlist,
  onQuickAdd,
  onViewProduct,
  onMoveToBag,
}) => {
  if (!isOpen) return null;

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `PKR ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleAddAllToBag = () => {
    wishlistProducts.forEach((p) => {
      const defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Standard';
      onQuickAdd(p, defaultSize);
    });
    onClose();
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
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              My Wishlist ({wishlistProducts.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {wishlistProducts.length > 0 && onClearWishlist && (
              <button
                onClick={onClearWishlist}
                className="text-[11px] text-neutral-500 hover:text-red-600 transition-colors uppercase font-medium tracking-wider mr-1"
                title="Remove all items from wishlist"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Save your favorite luxury pret, silks, perfumes, and lawn ensembles to review them anytime.
              </p>
              <button
                onClick={onClose}
                className="mt-3 inline-block px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors shadow-xs cursor-pointer"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            wishlistProducts.map((prod) => {
              const sizes = prod.sizes && prod.sizes.length > 0 ? prod.sizes : ['Standard'];
              return (
                <div
                  key={prod.id}
                  className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 p-2 rounded-xs transition-colors"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onClose();
                      onViewProduct(prod);
                    }}
                    className="w-20 h-28 shrink-0 bg-neutral-100 overflow-hidden relative border border-neutral-200 cursor-pointer group"
                    title={`View ${prod.name}`}
                  >
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
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
                          className="text-neutral-400 hover:text-red-600 p-1 shrink-0 transition-colors cursor-pointer"
                          aria-label="Remove from wishlist"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-bold text-neutral-950">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                      </div>

                      {prod.fabric && (
                        <span className="text-[10px] text-neutral-500 block mt-0.5 truncate">
                          {prod.fabric}
                        </span>
                      )}
                    </div>

                    {/* Quick Add Sizes / Move to Bag */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                          Select Size &amp; Add:
                        </span>
                        {onMoveToBag && (
                          <button
                            onClick={() => onMoveToBag(prod, sizes[0])}
                            className="text-[10px] text-neutral-700 hover:text-black font-semibold underline cursor-pointer"
                          >
                            Move to Bag
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => onQuickAdd(prod, sz)}
                            className="px-2 py-0.5 text-[10px] font-semibold border border-neutral-300 hover:border-black hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                            title={`Add size ${sz} to Bag`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2">
            <button
              onClick={handleAddAllToBag}
              className="w-full py-3 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Shopping Bag</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center uppercase tracking-wider">
              Complimentary luxury shipping on orders over PKR 10,000
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
