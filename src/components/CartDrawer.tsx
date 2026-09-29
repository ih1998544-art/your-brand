import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onCheckout: (discountPercent?: number, promoCode?: string) => void;
  onNotify: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onNotify,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // percent
  const [activeCodeName, setActiveCodeName] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const rawSubtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const freeShippingThresholdPKR = 10000;
  const isFreeShipping = rawSubtotal >= freeShippingThresholdPKR;
  const shippingPKR = isFreeShipping || items.length === 0 ? 0 : 490;
  const finalTotalPKR = Math.max(0, rawSubtotal - discountAmount + shippingPKR);

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `PKR ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const applyCode = (codeToApply: string) => {
    const code = codeToApply.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount(10);
      setActiveCodeName('WELCOME10');
      setPromoMessage('10% Welcome discount applied!');
      onNotify('Coupon WELCOME10 applied: 10% OFF');
    } else if (code === 'LUXE15' || code === 'EID2026') {
      setAppliedDiscount(15);
      setActiveCodeName(code);
      setPromoMessage('15% VIP Seasonal discount applied!');
      onNotify(`Coupon ${code} applied: 15% OFF`);
    } else {
      setPromoMessage('Invalid promo code. Try WELCOME10 or LUXE15');
      onNotify('Invalid promo code');
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCode(promoCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Shopping Bag ({totalItemCount})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => {
                  onClearCart();
                  onNotify('Shopping bag cleared');
                }}
                className="text-[11px] text-neutral-500 hover:text-red-600 transition-colors uppercase font-medium tracking-wider mr-1 cursor-pointer"
                title="Remove all items from shopping bag"
              >
                Clear Bag
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-neutral-50 p-3 sm:px-5 border-b border-neutral-200">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span>✓</span> You unlocked Free Express Delivery!
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="text-neutral-900">
                    {formatPrice(freeShippingThresholdPKR - rawSubtotal)}
                  </strong>{' '}
                  more for Free Delivery
                </span>
              )}
            </span>
            <span className="text-neutral-500 font-semibold text-[11px]">
              {Math.min(100, Math.round((rawSubtotal / freeShippingThresholdPKR) * 100))}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, (rawSubtotal / freeShippingThresholdPKR) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">
                Your shopping bag is empty
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our pret, haute formals, unstitched silks, and fragrance collections to add items.
              </p>
              <button
                onClick={onClose}
                className="mt-3 inline-block px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors shadow-xs cursor-pointer"
              >
                Discover Collections
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 p-2 rounded-xs transition-colors"
              >
                {/* Thumbnail Art */}
                <div className="w-20 h-28 shrink-0 bg-neutral-100 overflow-hidden relative border border-neutral-200">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <VectorFashionArt
                      artKey={item.product.categoryKey}
                      colorPalette={item.product.colorPalette}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-[13px] font-medium text-neutral-900 leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="text-neutral-400 hover:text-red-600 p-1 shrink-0 transition-colors cursor-pointer"
                        aria-label="Remove item"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-500 mt-1 flex flex-wrap items-center gap-1.5">
                      <span>
                        Size: <strong className="text-neutral-900 font-semibold">{item.size}</strong>
                      </span>
                      {item.product.fabric && (
                        <>
                          <span className="text-neutral-300">•</span>
                          <span className="truncate max-w-[120px]">{item.product.fabric}</span>
                        </>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-neutral-900 mt-1">
                      {formatPrice(item.product.price)} each
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded-xs bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-neutral-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-xs sm:text-sm font-bold text-neutral-950">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 sm:p-5 bg-neutral-50 space-y-3">
            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-white border border-neutral-300 pl-8 pr-3 py-1.5 text-xs uppercase placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 text-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>

              {/* Quick Coupon Chips */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Tap to Apply:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPromoCode('WELCOME10');
                    applyCode('WELCOME10');
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                    activeCodeName === 'WELCOME10'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  WELCOME10 (10% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPromoCode('LUXE15');
                    applyCode('LUXE15');
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                    activeCodeName === 'LUXE15'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  LUXE15 (15% OFF)
                </button>
              </div>

              {promoMessage && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    appliedDiscount > 0
                      ? 'text-emerald-700 font-semibold flex items-center gap-1'
                      : 'text-red-600'
                  }`}
                >
                  {appliedDiscount > 0 && <span>✓</span>}
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({totalItemCount} items)</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery</span>
                <span>{isFreeShipping ? 'COMPLIMENTARY' : formatPrice(shippingPKR)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Final Total</span>
                <span>{formatPrice(finalTotalPKR)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onCheckout(appliedDiscount, activeCodeName)}
              className="w-full py-3.5 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Proceed to Luxury Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Encrypted 256-bit Checkout • Fast Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
