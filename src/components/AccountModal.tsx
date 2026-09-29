import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
} from 'lucide-react';
import { UserProfile, Currency } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  currency: Currency;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSignOut: () => void;
  onNotify: (msg: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  currency,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onOpenTracking,
  onUpdateProfile,
  onSignOut,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '+92 300 1234567');
  const [editAddress, setEditAddress] = useState(
    user?.address || 'House 42, Street 15, DHA Phase 6'
  );
  const [editCity, setEditCity] = useState(user?.city || 'Karachi');

  if (!isOpen || !user) return null;

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `PKR ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
      city: editCity,
    });
    setIsEditingAddress(false);
    onNotify('Profile details updated successfully');
  };

  // Demo fallback orders if none exist
  const orders = user.orders && user.orders.length > 0 ? user.orders : [
    {
      id: 'YB-84920',
      date: 'Sep 24, 2026',
      total: 18480,
      itemsCount: 2,
      status: 'Dispatched' as const,
      items: [
        { name: 'Peach Lawn Embroidered Co-Ord Set', size: 'M', quantity: 1 },
        { name: 'Amber Oud Extrait De Parfum', size: '50ml', quantity: 1 },
      ],
    },
    {
      id: 'YB-71204',
      date: 'Aug 18, 2026',
      total: 9290,
      itemsCount: 1,
      status: 'Delivered' as const,
      items: [
        { name: 'Turquoise Teal Lawn Embroidered Suit', size: 'L', quantity: 1 },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with VIP Banner */}
        <div className="bg-neutral-950 text-white p-5 sm:p-6 border-b border-neutral-800">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 font-serif text-xl font-bold shadow-inner">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                    {user.name}
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{user.memberTier || 'VIP Atelier Patron'}</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span>{user.email}</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-amber-400 font-medium">
                    {user.loyaltyPoints || 1250} Loyalty Points
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Shortcuts: Wishlist & Bag */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-neutral-800/80">
            <button
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 p-2.5 rounded-xs flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400 fill-red-400/20 group-hover:fill-red-400 transition-colors" />
                <div>
                  <div className="text-[10px] uppercase text-neutral-400 tracking-wider">
                    My Wishlist
                  </div>
                  <div className="text-xs font-bold text-white">
                    {wishlistCount} {wishlistCount === 1 ? 'Piece' : 'Pieces'} Saved
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 p-2.5 rounded-xs flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
                <div>
                  <div className="text-[10px] uppercase text-neutral-400 tracking-wider">
                    Shopping Bag
                  </div>
                  <div className="text-xs font-bold text-white">
                    {cartCount} {cartCount === 1 ? 'Article' : 'Articles'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-neutral-900 bg-white text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-neutral-900 bg-white text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile &amp; Delivery Address</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-neutral-500 pb-1">
                <span>Recent Atelier &amp; Storefront Orders</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTracking();
                  }}
                  className="text-neutral-900 hover:underline font-semibold flex items-center gap-1"
                >
                  <Clock className="w-3 h-3 text-neutral-700" />
                  <span>Track an order</span>
                </button>
              </div>

              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="border border-neutral-200 p-4 rounded-xs bg-white hover:border-neutral-400 transition-colors space-y-2.5 shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-950">
                          {ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        Placed on {ord.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-neutral-900 block">
                        {formatPrice(ord.total)}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  {ord.items && (
                    <div className="pt-2 border-t border-neutral-100 space-y-1">
                      {ord.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-[11px] text-neutral-600"
                        >
                          <span className="truncate pr-2">
                            • {it.name} ({it.size})
                          </span>
                          <span className="shrink-0 text-neutral-400">
                            Qty: {it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTracking();
                      }}
                      className="text-[11px] font-medium text-neutral-700 hover:text-black underline"
                    >
                      Track Shipment &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Shipping &amp; Contact Information
                </span>
                {!isEditingAddress ? (
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs text-neutral-900 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="text-xs text-neutral-500 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingAddress ? (
                <div className="border border-neutral-200 p-4 rounded-xs bg-neutral-50/50 space-y-3 text-xs text-neutral-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>
                      <strong className="text-neutral-900">Name:</strong> {user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <span>
                      <strong className="text-neutral-900">Email:</strong> {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <span>
                      <strong className="text-neutral-900">Phone:</strong> {editPhone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900">Delivery Address:</strong>
                      <p className="text-neutral-600 mt-0.5">
                        {editAddress}, {editCity}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Street Address &amp; Suite
                    </label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Address &amp; Contact</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer with Sign Out */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure VIP Account</span>
          </div>

          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
