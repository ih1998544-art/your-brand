import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { CartItem, Currency } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState('Sara Ahmed');
  const [email, setEmail] = useState('sara.ahmed@example.com');
  const [address, setAddress] = useState('House 42, Street 15, DHA Phase 6');
  const [city, setCity] = useState('Karachi');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThresholdPKR = 10000;
  const isFreeShipping = rawSubtotal >= freeShippingThresholdPKR;
  const shippingPKR = isFreeShipping ? 0 : 490;
  const finalTotalPKR = rawSubtotal + shippingPKR;

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = `YB-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderConfirmed(newOrderId);
    onOrderSuccess(newOrderId);
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
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
            {orderConfirmed ? 'Order Confirmation' : 'Express Luxury Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderConfirmed ? (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-950">
              Thank You For Your Order!
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your order <strong className="text-neutral-950">{orderConfirmed}</strong> has been received and is being prepared with utmost care by our atelier.
            </p>
            <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 max-w-sm mx-auto space-y-1 text-left">
              <div><strong>Recipient:</strong> {fullName}</div>
              <div><strong>Shipping Address:</strong> {address}, {city}</div>
              <div><strong>Estimated Delivery:</strong> 2–4 Business Days</div>
              <div><strong>Total Paid:</strong> {formatPrice(finalTotalPKR)} ({paymentMethod.toUpperCase()})</div>
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 border-b border-neutral-200 pb-1">
                1. Delivery Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-medium">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2 text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 border-b border-neutral-200 pb-1">
                2. Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 text-left border transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                      : 'border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-bold">Cash on Delivery (COD)</div>
                  <div className="text-[11px] opacity-80">Pay upon package inspection</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 text-left border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                      : 'border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="font-bold">Credit / Debit Card</div>
                  <div className="text-[11px] opacity-80">Visa &bull; Mastercard &bull; AMEX</div>
                </button>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-neutral-700">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              <div className="flex justify-between font-medium text-neutral-700">
                <span>Delivery</span>
                <span>{isFreeShipping ? 'FREE' : formatPrice(shippingPKR)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Amount Due</span>
                <span>{formatPrice(finalTotalPKR)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Place Order ({formatPrice(finalTotalPKR)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
