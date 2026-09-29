import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Ruler, Truck, ShieldCheck, Check, ChevronLeft, ChevronRight, Layers, ZoomIn } from 'lucide-react';
import { Product, Currency } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Reset size, quantity, photo and guide on product change
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setShowSizeGuide(false);
      setActivePhotoIndex(0);
      setIsZoomed(false);
    }
  }, [product?.id]);

  if (!product) return null;

  const galleryImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const currentDisplayImage = galleryImages[activePhotoIndex] || product.imageUrl;

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Safe active size guaranteed to be valid for current product
  const activeSize =
    selectedSize && product.sizes.includes(selectedSize)
      ? selectedSize
      : product.sizes[0];

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAdd = () => {
    onAddToCart(product, activeSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Visual Column: Interactive Multi-Photo Gallery */}
        <div className="w-full md:w-1/2 flex flex-col bg-neutral-100 relative shrink-0">
          {/* Main Photo Display */}
          <div className="relative aspect-[3/4] md:aspect-auto md:flex-1 min-h-[380px] md:min-h-[440px] overflow-hidden bg-neutral-100 group">
            {currentDisplayImage ? (
              <img
                src={currentDisplayImage}
                alt={`${product.name} view ${activePhotoIndex + 1}`}
                referrerPolicy="no-referrer"
                onClick={() => setIsZoomed(!isZoomed)}
                className={`w-full h-full object-cover object-center transition-transform duration-500 cursor-zoom-in ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-103'
                }`}
              />
            ) : (
              <VectorFashionArt
                artKey={product.categoryKey}
                colorPalette={product.colorPalette}
                className="w-full h-full object-cover"
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
              {product.isNew && (
                <span className="bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  New in
                </span>
              )}
              {hasDiscount && (
                <span className="bg-red-700 text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  Sale
                </span>
              )}
            </div>

            {/* Gallery Photo Counter Badge */}
            {galleryImages.length > 1 && (
              <div className="absolute top-4 right-12 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                <Layers className="w-3 h-3 text-amber-300" />
                <span>Photo {activePhotoIndex + 1} of {galleryImages.length}</span>
              </div>
            )}

            {/* Next / Prev Navigation Chevrons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  aria-label="Previous photo angle"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  aria-label="Next photo angle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-neutral-900 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Zoom Hint */}
            <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-xs pointer-events-none flex items-center gap-1 opacity-70">
              <ZoomIn className="w-3 h-3" />
              <span>{isZoomed ? 'Click to reset' : 'Click to zoom'}</span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 shrink-0 font-medium px-1">
                Views:
              </span>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePhotoIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative w-12 h-14 rounded-xs overflow-hidden border-2 shrink-0 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Switch to photo ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[600px]">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest mb-1.5">
              <span>{product.department} &bull; {product.fabric}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-neutral-200">
              <span
                className={`text-xl font-semibold ${
                  hasDiscount ? 'text-red-700' : 'text-neutral-950'
                }`}
              >
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <span className="text-xs text-red-700 font-semibold uppercase">
                    Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Garment Details */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                Garment Description
              </h4>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-light">
                {product.details}
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  Select Size: <strong className="text-black font-bold">{activeSize}</strong>
                </span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-neutral-600 hover:text-black underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = activeSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase border transition-all ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-800'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Size Guide Table Modal Popover */}
              {showSizeGuide && (
                <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 text-xs">
                  <div className="font-semibold text-neutral-800 uppercase tracking-wider mb-2">
                    {product.department === 'Man'
                      ? product.categoryKey === 'bag'
                        ? 'Men Footwear Size Guide'
                        : product.categoryKey === 'coord'
                        ? 'Men Waistcoat Size Chart (Inches)'
                        : product.tab === 'uns'
                        ? 'Men Unstitched Fabric Dimensions'
                        : 'Men Traditional Garment Size Chart (Inches)'
                      : product.tab === 'uns'
                      ? 'Women Unstitched Fabric Dimensions'
                      : 'Women Ready-to-Wear Size Chart (Inches)'}
                  </div>

                  {product.department === 'Man' ? (
                    product.categoryKey === 'bag' ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500">
                            <th className="py-1">EU</th>
                            <th className="py-1">UK/PK</th>
                            <th className="py-1">Insole (cm)</th>
                            <th className="py-1">Insole (in)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-700">
                          <tr><td className="py-1 font-semibold">40</td><td>6</td><td>25.5 cm</td><td>10.0&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">41</td><td>7</td><td>26.2 cm</td><td>10.3&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">42</td><td>8</td><td>27.0 cm</td><td>10.6&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">43</td><td>9</td><td>27.8 cm</td><td>10.9&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">44</td><td>10</td><td>28.5 cm</td><td>11.2&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">45</td><td>11</td><td>29.2 cm</td><td>11.5&quot;</td></tr>
                        </tbody>
                      </table>
                    ) : product.categoryKey === 'coord' ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500">
                            <th className="py-1">Waistcoat Size</th>
                            <th className="py-1">Chest</th>
                            <th className="py-1">Shoulder</th>
                            <th className="py-1">Length</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-700">
                          <tr><td className="py-1 font-semibold">38 (S)</td><td>40&quot;</td><td>16.5&quot;</td><td>28&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">40 (M)</td><td>42&quot;</td><td>17.0&quot;</td><td>29&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">42 (L)</td><td>44&quot;</td><td>17.5&quot;</td><td>30&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">44 (XL)</td><td>46&quot;</td><td>18.0&quot;</td><td>30.5&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">46 (XXL)</td><td>48&quot;</td><td>18.5&quot;</td><td>31&quot;</td></tr>
                        </tbody>
                      </table>
                    ) : product.tab === 'uns' ? (
                      <div className="text-neutral-700 space-y-1">
                        <p><strong>Suit Cut:</strong> Standard 4.0 - 4.5 Meters unstitched length</p>
                        <p><strong>Width (Arz):</strong> 54 to 58 Inches (Bara Arz)</p>
                        <p><strong>Recommended:</strong> Sufficient for up to 6&apos;4&quot; tall tailored kameez shalwar or kurta pajama.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500">
                            <th className="py-1">Size</th>
                            <th className="py-1">Chest</th>
                            <th className="py-1">Shoulder</th>
                            <th className="py-1">Kameez Length</th>
                            <th className="py-1">Shalwar Length</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-700">
                          <tr><td className="py-1 font-semibold">S</td><td>40&quot;</td><td>17.5&quot;</td><td>40&quot;</td><td>40&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">M</td><td>43&quot;</td><td>18.5&quot;</td><td>42&quot;</td><td>41&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">L</td><td>46&quot;</td><td>19.5&quot;</td><td>43&quot;</td><td>42&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">XL</td><td>49&quot;</td><td>20.5&quot;</td><td>44&quot;</td><td>43&quot;</td></tr>
                          <tr><td className="py-1 font-semibold">XXL</td><td>52&quot;</td><td>21.5&quot;</td><td>45&quot;</td><td>44&quot;</td></tr>
                        </tbody>
                      </table>
                    )
                  ) : product.tab === 'uns' ? (
                    <div className="text-neutral-700 space-y-1">
                      <p><strong>Shirt Fabric:</strong> 3.0 Meters</p>
                      <p><strong>Trouser Fabric:</strong> 2.5 Meters</p>
                      <p><strong>Dupatta:</strong> 2.5 Meters</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500">
                          <th className="py-1">Size</th>
                          <th className="py-1">Chest</th>
                          <th className="py-1">Waist</th>
                          <th className="py-1">Hip</th>
                          <th className="py-1">Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-700">
                        <tr><td className="py-1 font-semibold">XS</td><td>36&quot;</td><td>32&quot;</td><td>38&quot;</td><td>42&quot;</td></tr>
                        <tr><td className="py-1 font-semibold">S</td><td>38&quot;</td><td>34&quot;</td><td>40&quot;</td><td>43&quot;</td></tr>
                        <tr><td className="py-1 font-semibold">M</td><td>41&quot;</td><td>37&quot;</td><td>43&quot;</td><td>44&quot;</td></tr>
                        <tr><td className="py-1 font-semibold">L</td><td>44&quot;</td><td>40&quot;</td><td>46&quot;</td><td>44&quot;</td></tr>
                        <tr><td className="py-1 font-semibold">XL</td><td>47&quot;</td><td>43&quot;</td><td>49&quot;</td><td>45&quot;</td></tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm font-semibold hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-sm font-semibold hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-3.5 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                className={`px-4 py-3.5 border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-neutral-300 hover:border-neutral-900 text-neutral-800'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`}
                />
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                <span>Free delivery over PKR 10k</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                <span>100% Genuine Certified Fabric</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
