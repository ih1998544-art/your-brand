import React, { useState } from 'react';
import { X, Heart, Star, ShoppingBag, Truck, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, Currency } from '../../types';

interface BeautyQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, quantity: number) => void;
}

export const BeautyQuickViewModal: React.FC<BeautyQuickViewModalProps> = ({
  product,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('notes');

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl || '/src/assets/images/cat_fragrance_luxe_1790706160651.jpg'];

  const formattedPrice = (priceVal: number) => {
    const converted = Math.round(priceVal * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const toggleAccordion = (section: string) => {
    setOpenAccordion((curr) => (curr === section ? null : section));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Images */}
          <div>
            <div className="aspect-square bg-neutral-100 overflow-hidden relative border border-neutral-100">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent && (
                <span className="absolute top-3 left-3 bg-red-700 text-white font-sans text-xs font-bold uppercase tracking-wider px-2.5 py-0.5">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 flex-shrink-0 border-2 overflow-hidden ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Buying actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-neutral-500 mb-1.5">
                <span>{product.subCategory || product.beautyCategory || 'Fragrance & Beauty'}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">In Stock</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl text-neutral-950 font-normal uppercase tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-neutral-600 font-medium">
                  {product.rating || 4.9} ({product.reviewCount || 120} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-neutral-100">
                <span className="font-sans text-xl sm:text-2xl font-bold text-neutral-950">
                  {formattedPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-sm text-neutral-400 line-through">
                    {formattedPrice(product.originalPrice)}
                  </span>
                )}
                {product.volume && (
                  <span className="text-xs text-neutral-500 uppercase tracking-wider ml-auto">
                    {product.volume}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-700 leading-relaxed font-light mb-5">
                {product.details}
              </p>

              {/* Size / Volume / Shade Selector */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-neutral-800 mb-2">
                  <span>Option / Volume:</span>
                  <span className="text-neutral-500 font-normal">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-3.5 py-1.5 border uppercase font-medium transition-all ${
                        selectedSize === sz
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-300 text-neutral-800 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-sm hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-sm hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons: Add to Bag + Buy Now + Wishlist */}
              <div className="space-y-2 mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(product, selectedSize, quantity)}
                    className="flex-1 bg-neutral-900 text-white hover:bg-black font-sans text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="p-3 border border-neutral-300 hover:border-black text-neutral-800 hover:text-red-600 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-red-600 text-red-600' : ''
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => onBuyNow(product, selectedSize, quantity)}
                  className="w-full bg-amber-900 text-white hover:bg-amber-950 font-sans text-xs font-semibold uppercase tracking-widest py-3 transition-colors cursor-pointer"
                >
                  BUY NOW
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Free Express Delivery over PKR 5,000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>100% Genuine Luxury Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Accordions: Notes / Ingredients / How To Use */}
            <div className="mt-6 pt-4 border-t border-neutral-200 divide-y divide-neutral-100">
              {product.fragranceNotes && (
                <div>
                  <button
                    onClick={() => toggleAccordion('notes')}
                    className="w-full py-2.5 flex items-center justify-between text-xs uppercase font-semibold text-neutral-900 hover:text-black"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      OLFACTORY PYRAMID & NOTES
                    </span>
                    {openAccordion === 'notes' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {openAccordion === 'notes' && (
                    <div className="pb-3 text-xs text-neutral-600 space-y-1.5">
                      <p>
                        <strong className="text-neutral-900">Top Notes:</strong>{' '}
                        {product.fragranceNotes.top}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Heart Notes:</strong>{' '}
                        {product.fragranceNotes.heart}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Base Notes:</strong>{' '}
                        {product.fragranceNotes.base}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {product.howToUse && (
                <div>
                  <button
                    onClick={() => toggleAccordion('use')}
                    className="w-full py-2.5 flex items-center justify-between text-xs uppercase font-semibold text-neutral-900 hover:text-black"
                  >
                    <span>HOW TO APPLY / RITUAL</span>
                    {openAccordion === 'use' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {openAccordion === 'use' && (
                    <div className="pb-3 text-xs text-neutral-600 leading-relaxed">
                      {product.howToUse}
                    </div>
                  )}
                </div>
              )}

              {product.ingredients && (
                <div>
                  <button
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full py-2.5 flex items-center justify-between text-xs uppercase font-semibold text-neutral-900 hover:text-black"
                  >
                    <span>INGREDIENTS & FORMULATION</span>
                    {openAccordion === 'ingredients' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="pb-3 text-[11px] text-neutral-500 font-mono leading-relaxed">
                      {product.ingredients}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
