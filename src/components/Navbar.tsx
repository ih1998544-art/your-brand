import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import { Currency, Department } from '../types';
import { FragranceMegaMenu } from './beauty/FragranceMegaMenu';

interface NavbarProps {
  currentDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
  currency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  currencies: Currency[];
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenSignIn: () => void;
  onOpenTracking: () => void;
  onOpenStoreLocator: () => void;
  onFilterCategory?: (category: string) => void;
  onNotify: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDepartment,
  onSelectDepartment,
  currency,
  onSelectCurrency,
  currencies,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onOpenSearch,
  onOpenSignIn,
  onOpenTracking,
  onOpenStoreLocator,
  onFilterCategory,
  onNotify,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [fragranceMegaOpen, setFragranceMegaOpen] = useState(false);

  const departments: Department[] = [
    'Woman',
    'Man',
    'Teens',
    'Fragrance & Beauty',
  ];

  const handleNavClick = (cat: string) => {
    if (onFilterCategory) {
      onFilterCategory(cat);
    }
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    onNotify(`Viewing ${cat}`);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-neutral-900 text-neutral-100 text-[11px] tracking-wider uppercase py-2 px-4 flex justify-center items-center gap-6 sm:gap-8 flex-wrap font-medium">
        <button
          onClick={onOpenSignIn}
          className="hover:text-amber-200 transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={onOpenTracking}
          className="hover:text-amber-200 transition-colors"
        >
          Tracking info
        </button>
        <button
          onClick={() => onNotify('Complimentary luxury gift wrapping available at checkout')}
          className="hover:text-amber-200 transition-colors"
        >
          Gifting
        </button>
        <button
          onClick={() => onNotify('E-Gift cards delivered directly to recipient inbox')}
          className="hover:text-amber-200 transition-colors"
        >
          Shop e-gift cards
        </button>
      </div>

      {/* Sticky Main Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center px-4 md:px-10 py-3.5 gap-2">
          {/* Left Controls: Search, Stores */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden p-1.5 -ml-1 text-neutral-800 hover:text-black flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium uppercase tracking-wider text-neutral-800 hover:text-black group cursor-pointer"
            >
              <Search className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
              <span className="inline">Search</span>
            </button>

            <button
              onClick={onOpenStoreLocator}
              className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-800 hover:text-black transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-600 hover:text-black" />
              <span>Stores</span>
            </button>
          </div>

          {/* Center Brand Logo */}
          <div className="text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block font-serif text-2xl md:text-3xl font-bold tracking-[0.18em] text-neutral-950 uppercase hover:opacity-90 transition-opacity"
            >
              YOUR BRAND
            </a>
          </div>

          {/* Right Controls: PKR, Wishlist, Bag */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 text-xs font-medium uppercase tracking-wider">
            {/* Currency selector dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-neutral-800 hover:text-black py-1 px-1.5 font-semibold cursor-pointer"
              >
                <span>{currency.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white border border-neutral-200 shadow-xl py-1 z-40">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onSelectCurrency(c);
                        setCurrencyDropdownOpen(false);
                        onNotify(`Switched currency to ${c.code}`);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-100 flex justify-between cursor-pointer ${
                        currency.code === c.code ? 'font-bold bg-neutral-50' : ''
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-neutral-400">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black py-1 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-neutral-700" />
              <span className="hidden md:inline">Wishlist</span>
              <span className="text-[11px] font-semibold bg-neutral-100 px-1.5 py-0.5 rounded-sm min-w-4 text-center">
                {wishlistCount}
              </span>
            </button>

            {/* Bag / Cart Link */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-neutral-900 text-white hover:bg-black px-3 py-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Bag</span>
              <span className="text-[11px] font-bold bg-white text-neutral-900 px-1.5 py-0.2 rounded-xs min-w-4 text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar (Visible on all screens with horizontal scroll) */}
        {currentDepartment === 'Man' ? (
          <nav
            aria-label="Men's categories"
            className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative border-t border-neutral-100 px-4 overflow-x-auto scrollbar-none whitespace-nowrap py-1 bg-white"
          >
            {/* Quick Department Switchers */}
            <div className="flex items-center gap-3 sm:gap-4 border-r border-neutral-200 pr-4 mr-1 font-semibold text-neutral-500">
              <button
                onClick={() => onSelectDepartment('Woman')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Woman
              </button>
              <button
                onClick={() => onSelectDepartment('Teens')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Teens
              </button>
              <button
                onClick={() => onSelectDepartment('Fragrance & Beauty')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Fragrance & Beauty
              </button>
            </div>

            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('New in')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                New in
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('KAMEEZ SHALWAR')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Kameez Shalwar
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('KURTA TROUSER')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Kurta Trouser
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('WAISTCOAT')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Waistcoat
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('UNSTITCHED')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Unstitched
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('FORMAL KURTA')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Formal Kurta
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('FOOTWEAR')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Footwear
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-semibold hover:text-red-800 transition-colors cursor-pointer"
              >
                Sale
              </button>
            </div>
          </nav>
        ) : currentDepartment === 'Teens' ? (
          <nav
            aria-label="Teens categories"
            className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative border-t border-neutral-100 px-4 overflow-x-auto scrollbar-none whitespace-nowrap py-1 bg-white"
          >
            {/* Quick Department Switchers */}
            <div className="flex items-center gap-3 sm:gap-4 border-r border-neutral-200 pr-4 mr-1 font-semibold text-neutral-500">
              <button
                onClick={() => onSelectDepartment('Woman')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Woman
              </button>
              <button
                onClick={() => onSelectDepartment('Man')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Man
              </button>
              <button
                onClick={() => onSelectDepartment('Fragrance & Beauty')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Fragrance & Beauty
              </button>
            </div>

            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Summer 26')}
                className="font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Summer '26</span>
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Teen Girls')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Teen Girls
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Teen Boys')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Teen Boys
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Kid Girls')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Kid Girls
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Kid Boys')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Kid Boys
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Infant')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Infant
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Trending')}
                className="hover:text-black text-neutral-900 font-semibold transition-colors cursor-pointer"
              >
                Trending
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-semibold hover:text-red-800 transition-colors cursor-pointer"
              >
                Sale
              </button>
            </div>
          </nav>
        ) : currentDepartment === 'Fragrance & Beauty' ? (
          <nav
            aria-label="Fragrance and Beauty categories"
            className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative border-t border-neutral-100 px-4 overflow-x-auto scrollbar-none whitespace-nowrap py-1 bg-white"
          >
            {/* Quick Department Switchers */}
            <div className="flex items-center gap-3 sm:gap-4 border-r border-neutral-200 pr-4 mr-1">
              <button
                onClick={() => onSelectDepartment('Woman')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Woman
              </button>
              <button
                onClick={() => onSelectDepartment('Man')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Man
              </button>
              <button
                onClick={() => onSelectDepartment('Teens')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Teens
              </button>
            </div>

            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('All')}
                className="hover:text-black text-neutral-900 font-semibold transition-colors cursor-pointer"
              >
                Discover All
              </button>
            </div>
            <div
              className="py-2.5 relative group"
              onMouseEnter={() => setFragranceMegaOpen(true)}
            >
              <button
                onClick={() => {
                  handleNavClick('Fragrances');
                  setFragranceMegaOpen(true);
                }}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Fragrances</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
              </button>
            </div>
            <div
              className="py-2.5 relative group"
              onMouseEnter={() => setFragranceMegaOpen(true)}
            >
              <button
                onClick={() => {
                  handleNavClick('Makeup');
                  setFragranceMegaOpen(true);
                }}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Makeup</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
              </button>
            </div>
            <div
              className="py-2.5 relative group"
              onMouseEnter={() => setFragranceMegaOpen(true)}
            >
              <button
                onClick={() => {
                  handleNavClick('Skin Care');
                  setFragranceMegaOpen(true);
                }}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Skin Care</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Body & Home')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Body & Home
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Bakhoor')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Bakhoor
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Scented Candle')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
              >
                Candles
              </button>
            </div>
            <div className="py-2.5">
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-semibold hover:text-red-800 transition-colors cursor-pointer"
              >
                Offers & Sale
              </button>
            </div>
          </nav>
        ) : (
          <nav
            aria-label="Women's categories"
            className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative border-t border-neutral-100 px-4 overflow-x-auto scrollbar-none whitespace-nowrap py-1 bg-white"
          >
            {/* Quick Department Switchers */}
            <div className="flex items-center gap-3 sm:gap-4 border-r border-neutral-200 pr-4 mr-1 font-semibold text-neutral-500">
              <button
                onClick={() => onSelectDepartment('Man')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Man
              </button>
              <button
                onClick={() => onSelectDepartment('Teens')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Teens
              </button>
              <button
                onClick={() => onSelectDepartment('Fragrance & Beauty')}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Fragrance & Beauty
              </button>
            </div>

            {/* New in */}
          <div
            className="py-2.5 relative group"
            onMouseEnter={() => setActiveMegaMenu('new')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button
              onClick={() => handleNavClick('New in')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              New in
            </button>
          </div>

          {/* Ready to wear */}
          <div
            className="py-2.5 relative group"
            onMouseEnter={() => setActiveMegaMenu('rtw')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button
              onClick={() => handleNavClick('Ready to wear')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Ready to wear
            </button>

            {/* Mega Menu */}
            {activeMegaMenu === 'rtw' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-4 gap-8 z-40 text-left normal-case tracking-normal">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Shop by type
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Co-ords')}
                        className="hover:text-black hover:underline"
                      >
                        Co-ords
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Kurta')}
                        className="hover:text-black hover:underline"
                      >
                        Kurta
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('3 piece stitched')}
                        className="hover:text-black hover:underline"
                      >
                        3 piece stitched
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Dresses')}
                        className="hover:text-black hover:underline"
                      >
                        Dresses & Kaftans
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Fabric
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Lawn')}
                        className="hover:text-black hover:underline"
                      >
                        Lawn
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Raw silk')}
                        className="hover:text-black hover:underline"
                      >
                        Raw silk
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Cotton')}
                        className="hover:text-black hover:underline"
                      >
                        Cotton
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Chiffon')}
                        className="hover:text-black hover:underline"
                      >
                        Chiffon
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Collections
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Essentials')}
                        className="hover:text-black hover:underline"
                      >
                        Essentials
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Luxe')}
                        className="hover:text-black hover:underline"
                      >
                        Luxe
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Signature')}
                        className="hover:text-black hover:underline"
                      >
                        Signature
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="bg-neutral-50 p-4 border border-neutral-200/80">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-neutral-900">
                    Featured
                  </h4>
                  <p className="text-xs text-neutral-600 mb-3">
                    Pre-winter edit in rich textures and warm tones.
                  </p>
                  <button
                    onClick={() => handleNavClick('Pre-winter edit')}
                    className="text-xs font-semibold text-neutral-950 underline"
                  >
                    Explore Edit &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Unstitched */}
          <div
            className="py-2.5 relative group"
            onMouseEnter={() => setActiveMegaMenu('uns')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button
              onClick={() => handleNavClick('Unstitched')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Unstitched
            </button>

            {activeMegaMenu === 'uns' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-4 gap-8 z-40 text-left normal-case tracking-normal">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Shop by type
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('1 piece unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        1 piece
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('2 piece unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        2 piece
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('3 piece unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        3 piece
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Fabric
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Lawn unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        Lawn
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Khaddar unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        Khaddar
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Karandi unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        Karandi
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Collections
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Signature unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        Signature Prints
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Winter Velvet Unstitched')}
                        className="hover:text-black hover:underline"
                      >
                        Velvet Shawl Edit
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="bg-neutral-50 p-4 border border-neutral-200/80">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-neutral-900">
                    Noya Collection
                  </h4>
                  <p className="text-xs text-neutral-600 mb-3">
                    Hand-finished detail and timeless patterns.
                  </p>
                  <button
                    onClick={() => handleNavClick('Noya unstitched')}
                    className="text-xs font-semibold text-neutral-950 underline"
                  >
                    View Noya &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Formals */}
          <div className="py-2.5">
            <button
              onClick={() => handleNavClick('Formals')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Formals
            </button>
          </div>

          {/* Footwear */}
          <div className="py-2.5">
            <button
              onClick={() => handleNavClick('Footwear')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Footwear
            </button>
          </div>

          {/* Accessories */}
          <div
            className="py-2.5 relative group"
            onMouseEnter={() => setActiveMegaMenu('acc')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button
              onClick={() => handleNavClick('Accessories')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Accessories
            </button>

            {activeMegaMenu === 'acc' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-3xl bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-3 gap-8 z-40 text-left normal-case tracking-normal">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Bags
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Totes')}
                        className="hover:text-black hover:underline"
                      >
                        Totes
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Clutches')}
                        className="hover:text-black hover:underline"
                      >
                        Evening Clutches
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Jewellery
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Artisanal')}
                        className="hover:text-black hover:underline"
                      >
                        Artisanal Filigree
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Earrings')}
                        className="hover:text-black hover:underline"
                      >
                        Jhumkas & Tops
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                    Extras
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li>
                      <button
                        onClick={() => handleNavClick('Scarves')}
                        className="hover:text-black hover:underline"
                      >
                        Silk Scarves
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('Wallets')}
                        className="hover:text-black hover:underline"
                      >
                        Cardholders
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Trending */}
          <div className="py-2.5">
            <button
              onClick={() => handleNavClick('Trending')}
              className="hover:text-black text-neutral-700 transition-colors"
            >
              Trending
            </button>
          </div>

          {/* Sale */}
          <div className="py-2.5">
            <button
              onClick={() => handleNavClick('Sale')}
              className="text-red-700 font-semibold hover:text-red-800 transition-colors"
            >
              Sale
            </button>
          </div>
        </nav>
        )}

        {/* Fragrance & Beauty Luxury Mega Menu */}
        <FragranceMegaMenu
          isOpen={fragranceMegaOpen}
          onClose={() => setFragranceMegaOpen(false)}
          onSelectCategory={(cat) => {
            onSelectDepartment('Fragrance & Beauty');
            handleNavClick(cat);
          }}
        />
      </header>

      {/* Mobile Slide-out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Content Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <span className="font-serif text-lg font-bold tracking-widest uppercase">
                  YOUR BRAND
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-600 hover:text-black"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department horizontal selector for mobile */}
              <div className="p-3 bg-neutral-50 flex gap-2 overflow-x-auto border-b border-neutral-200 scrollbar-none">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      onSelectDepartment(dept);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs px-2.5 py-1 uppercase whitespace-nowrap font-medium transition-colors ${
                      currentDepartment === dept
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Category Links */}
              <div className="divide-y divide-neutral-100 text-xs font-medium uppercase tracking-wider">
                {(currentDepartment === 'Man'
                  ? [
                      'New in',
                      'KAMEEZ SHALWAR',
                      'KURTA TROUSER',
                      'WAISTCOAT',
                      'UNSTITCHED',
                      'FORMAL KURTA',
                      'FOOTWEAR',
                      'Sale',
                    ]
                  : currentDepartment === 'Teens'
                  ? [
                      "Summer '26",
                      'Teen Girls',
                      'Teen Boys',
                      'Kid Girls',
                      'Kid Boys',
                      'Infant',
                      'Trending',
                      'Sale',
                    ]
                  : currentDepartment === 'Fragrance & Beauty'
                  ? [
                      'All Products',
                      'Fragrances',
                      'Eau De Parfum',
                      'Body Mist',
                      'Makeup',
                      'Lipstick',
                      'Skin Care',
                      'Serums',
                      'Body & Home',
                      'Bakhoor',
                      'Scented Candle',
                      'Sale',
                    ]
                  : [
                      'New in',
                      'Ready to wear',
                      'Unstitched',
                      'Formals',
                      'Footwear',
                      'Accessories',
                      'Trending',
                      'Sale',
                    ]
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`w-full text-left px-5 py-3.5 flex justify-between items-center transition-colors ${
                      item === 'Sale'
                        ? 'text-red-700 font-bold hover:bg-red-50'
                        : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-neutral-400">&rsaquo;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom helper actions */}
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 uppercase font-medium">Currency</span>
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const found = currencies.find((c) => c.code === e.target.value);
                    if (found) onSelectCurrency(found);
                  }}
                  className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs uppercase"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium text-center"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="w-full py-2 border border-neutral-300 bg-white text-neutral-800 text-xs uppercase tracking-wider font-medium text-center"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
