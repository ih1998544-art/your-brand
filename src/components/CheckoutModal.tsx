import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Package, CreditCard, Truck, User } from 'lucide-react';
import { CartItem, Currency, UserProfile, UserOrder } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedDiscount?: number;
  promoCode?: string;
  currentUser?: UserProfile | null;
  onOrderSuccess: (orderId: string, orderDetails?: UserOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedDiscount = 0,
  promoCode = '',
  currentUser,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState(currentUser?.name || 'Sara Ahmed');
  const [email, setEmail] = useState(currentUser?.email || 'sara.ahmed@example.com');
  const [address, setAddress] = useState(currentUser?.address || 'House 42, Street 15, DHA Phase 6');
  const [city, setCity] = useState(currentUser?.city || 'Karachi');
  const [phone, setPhone] = useState(currentUser?.phone || '+92 300 1234567');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  // Sync if currentUser updates
  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      if (currentUser.name) setFullName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const freeShippingThresholdPKR = 10000;
  const isFreeShipping = rawSubtotal >= freeShippingThresholdPKR;
  const shippingPKR = isFreeShipping ? 0 : 490;
  const finalTotalPKR = Math.max(0, rawSubtotal - discountAmount + shippingPKR);

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `PKR ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = `YB-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderConfirmed(newOrderId);

    const orderDetails: UserOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: finalTotalPKR,
      itemsCount: items.reduce((sum, it) => sum + it.quantity, 0),
      status: 'Processing',
      items: items.map((it) => ({
        name: it.product.name,
        size: it.size,
        quantity: it.quantity,
      })),
    };

    onOrderSuccess(newOrderId, orderDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!orderConfirmed) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              {orderConfirmed ? 'Order Confirmation' : 'Express Luxury Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderConfirmed ? (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-950">
              Thank You For Your Order!
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your luxury order <strong className="text-neutral-950">{orderConfirmed}</strong> has been received and is being prepared with utmost care by our atelier.
            </p>
            <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 max-w-md mx-auto space-y-1.5 text-left rounded-xs">
              <div className="flex justify-between">
                <strong>Recipient:</strong> <span>{fullName}</span>
              </div>
              <div className="flex justify-between">
                <strong>Contact Email:</strong> <span>{email}</span>
              </div>
              <div className="flex justify-between">
                <strong>Delivery Address:</strong> <span>{address}, {city}</span>
              </div>
              <div className="flex justify-between">
                <strong>Payment Mode:</strong> <span className="uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-200 text-neutral-950 font-bold">
                <strong>Total Amount:</strong> <span>{formatPrice(finalTotalPKR)}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form & Order Summary */
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {currentUser?.isLoggedIn && (
              <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xs text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <span>
                    Checking out as <strong>{currentUser.name}</strong> ({currentUser.email})
                  </span>
                </div>
                <span className="text-[10px] bg-amber-200/60 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-amber-800">
                  {currentUser.memberTier || 'VIP Member'}
                </span>
              </div>
            )}

            {/* Delivery Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>1. Shipping &amp; Recipient Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold uppercase text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold uppercase text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-semibold uppercase text-[10px]">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold uppercase text-[10px]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold uppercase text-[10px]">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-neutral-700" />
                <span>2. Payment Option</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label
                  className={`border p-3 flex flex-col justify-between cursor-pointer rounded-xs transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-950 bg-neutral-50/80 font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Cash on Delivery (COD)</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-neutral-900"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-normal mt-1">
                    Pay safely at your doorstep across Pakistan
                  </span>
                </label>

                <label
                  className={`border p-3 flex flex-col justify-between cursor-pointer rounded-xs transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-neutral-950 bg-neutral-50/80 font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Credit / Debit Card</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-neutral-900"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-normal mt-1">
                    Visa, Mastercard &amp; UnionPay (Encrypted)
                  </span>
                </label>
              </div>
            </div>

            {/* Order Review & Pricing */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-700 font-medium">
                <span>Items Subtotal ({items.length} {items.length === 1 ? 'article' : 'articles'})</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-semibold">
                  <span>Coupon Discount {promoCode ? `(${promoCode} - ${appliedDiscount}%)` : `(${appliedDiscount}%)`}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-neutral-700 font-medium">
                <span>Shipping Fee</span>
                <span>{isFreeShipping ? 'FREE' : formatPrice(shippingPKR)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Payable</span>
                <span>{formatPrice(finalTotalPKR)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Confirm &amp; Place Luxury Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Luxury Guarantee • Complimentary Returns</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
