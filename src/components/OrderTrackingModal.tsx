import React, { useState } from 'react';
import { X, Search, CheckCircle, Truck, Package, Clock } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [orderNumber, setOrderNumber] = useState('YB-98241');
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      onNotify('Please enter a valid order number');
      return;
    }
    setHasSearched(true);
    onNotify(`Showing tracking status for ${orderNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Track Your Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="Order Number (e.g. YB-98241)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 bg-white border border-neutral-300 px-3.5 py-2 text-xs uppercase placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
            />
            <button
              type="submit"
              className="bg-neutral-950 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Timeline */}
        {hasSearched && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                  Tracking Number
                </span>
                <span className="text-sm font-bold text-neutral-900">{orderNumber}</span>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-xs">
                In Transit &bull; On Time
              </span>
            </div>

            {/* Timeline steps */}
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 pl-8">
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Order Confirmed
                  </h4>
                  <p className="text-[11px] text-neutral-500">26 Sep 2026, 14:30 PM &bull; Payment Verified</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Tailoring &amp; Quality Inspected
                  </h4>
                  <p className="text-[11px] text-neutral-500">27 Sep 2026, 11:15 AM &bull; Karachi Logistics Hub</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center ring-4 ring-white animate-pulse">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Out for Delivery
                  </h4>
                  <p className="text-[11px] text-neutral-600">Expected Arrival: Today by 6:00 PM</p>
                </div>
              </div>

              <div className="relative opacity-40">
                <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-neutral-300 text-white flex items-center justify-center ring-4 ring-white">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Delivered
                  </h4>
                  <p className="text-[11px] text-neutral-500">Signature required on receipt</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
