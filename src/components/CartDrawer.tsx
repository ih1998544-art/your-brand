import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
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
  onCheckout: () => void;
  onNotify: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNotify,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // percent
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const freeShippingThresholdPKR = 10000;
  const isFreeShipping = rawSubtotal >= freeShippingThresholdPKR;
  const shippingPKR = isFreeShipping || items.length === 0 ? 0 : 490;
  const finalTotalPKR = rawSubtotal - discountAmount + shippingPKR;

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount(10);
      setPromoMessage('10% Welcome discount applied!');
      onNotify('Coupon applied: 10% OFF');
    } else if (code === 'EID2026' || code === 'LUXE15') {
      setAppliedDiscount(15);
      setPromoMessage('15% Seasonal discount applied!');
      onNotify('Coupon applied: 15% OFF');
    } else {
      setPromoMessage('Invalid promo code. Try WELCOME10');
      onNotify('Invalid promo code');
    }
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
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-neutral-50 p-3 sm:px-5 border-b border-neutral-200">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-700 font-semibold">
                  You unlocked Free Express Delivery!
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
            <span className="text-neutral-400">
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
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-medium text-neutral-600">Your bag is currently empty.</p>
              <button
                onClick={onClose}
                className="mt-2 inline-block px-5 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0"
              >
                {/* Thumbnail Art */}
                <div className="w-20 h-26 shrink-0 bg-neutral-100 overflow-hidden relative border border-neutral-200">
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
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs sm:text-[13px] font-medium text-neutral-900 leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Size:{' '}
                      <span className="font-semibold text-neutral-800">{item.size}</span>
                      <span className="mx-1.5">|</span>
                      <span>{item.product.fabric}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900">
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
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-neutral-300 px-3 py-1.5 text-xs uppercase placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p
                className={`text-[11px] ${
                  appliedDiscount > 0 ? 'text-emerald-700 font-medium' : 'text-red-600'
                }`}
              >
                {promoMessage}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{isFreeShipping ? 'FREE' : formatPrice(shippingPKR)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(finalTotalPKR)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Encrypted 256-bit Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
