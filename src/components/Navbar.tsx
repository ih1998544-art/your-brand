import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, MapPin, Shield, Sparkles } from 'lucide-react';
import { Currency, Department } from '../types';
import { FragranceMegaMenu } from './beauty/FragranceMegaMenu';
import { AdminPanelModal } from './AdminPanelModal';

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
  const [adminModalOpen, setAdminModalOpen] = useState(false);

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
      {/* ======================================================== */}
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (No Mobile Overflow)   */}
      {/* ======================================================== */}
      <div className="bg-neutral-950 text-neutral-300 text-[10px] sm:text-[11px] tracking-wider uppercase py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-4 sm:gap-8 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={onOpenSignIn}
            className="hover:text-white transition-colors cursor-pointer shrink-0 font-medium"
          >
            Sign in
          </button>
          <span className="text-neutral-700 hidden sm:inline">•</span>
          <button
            onClick={onOpenTracking}
            className="hover:text-white transition-colors cursor-pointer shrink-0 font-medium"
          >
            Tracking info
          </button>
          <span className="text-neutral-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNotify('Complimentary luxury gift packaging on all orders')}
            className="hover:text-white transition-colors cursor-pointer shrink-0 font-medium"
          >
            Gifting
          </button>
          <span className="text-neutral-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNotify('E-Gift cards delivered directly to recipient inbox')}
            className="hover:text-white transition-colors cursor-pointer shrink-0 font-medium"
          >
            Shop e-gift cards
          </button>
          <span className="text-neutral-700 hidden sm:inline">•</span>
          <button
            onClick={onOpenStoreLocator}
            className="hover:text-white transition-colors cursor-pointer shrink-0 font-medium flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-neutral-400" />
            <span>Stores</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN HEADER (Zero Collision, 100% Exact Center Logo) */}
      {/* Left: WOMEN, MEN, TEENS, FRAGRANCE & BEAUTY, admin panel  */}
      {/* Center: [YOUR BRAND ]                                    */}
      {/* Right: SEARCH, WISHLIST (with count), BAG (with count)    */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white/98 backdrop-blur-md border-b border-neutral-200 transition-all shadow-xs">
        {/* DESKTOP HEADER (grid-cols-[1fr_auto_1fr] guarantees center & zero overlap) */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-6 xl:px-12 py-3.5 border-b border-neutral-200">
          {/* LEFT SIDE: WOMEN, MEN, TEENS, FRAGRANCE & BEAUTY, admin panel */}
          <div className="flex items-center gap-4 xl:gap-6 text-xs tracking-wider uppercase font-semibold text-neutral-800 min-w-0">
            {/* WOMEN */}
            <button
              onClick={() => {
                onSelectDepartment('Woman');
                onNotify('Viewing WOMEN collection');
              }}
              className={`py-1 cursor-pointer transition-all shrink-0 ${
                currentDepartment === 'Woman'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[2px]'
                  : 'hover:text-black text-neutral-700'
              }`}
            >
              WOMEN
            </button>

            {/* MEN */}
            <button
              onClick={() => {
                onSelectDepartment('Man');
                onNotify('Viewing MEN collection');
              }}
              className={`py-1 cursor-pointer transition-all shrink-0 ${
                currentDepartment === 'Man'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[2px]'
                  : 'hover:text-black text-neutral-700'
              }`}
            >
              MEN
            </button>

            {/* TEENS */}
            <button
              onClick={() => {
                onSelectDepartment('Teens');
                onNotify('Viewing TEENS collection');
              }}
              className={`py-1 cursor-pointer transition-all shrink-0 ${
                currentDepartment === 'Teens'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[2px]'
                  : 'hover:text-black text-neutral-700'
              }`}
            >
              TEENS
            </button>

            {/* FRAGRANCE & BEAUTY */}
            <button
              onClick={() => {
                onSelectDepartment('Fragrance & Beauty');
                onNotify('Viewing FRAGRANCE & BEAUTY collection');
              }}
              className={`py-1 cursor-pointer transition-all shrink-0 ${
                currentDepartment === 'Fragrance & Beauty'
                  ? 'text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[2px]'
                  : 'hover:text-black text-neutral-700'
              }`}
            >
              <span className="hidden xl:inline">FRAGRANCE & </span>BEAUTY
            </button>

            {/* admin panel */}
            <button
              onClick={() => setAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all bg-neutral-100 hover:bg-neutral-900 text-neutral-700 hover:text-white border border-neutral-300 hover:border-neutral-900 cursor-pointer shadow-2xs shrink-0"
              title="Open Store Administration Dashboard"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <Shield className="w-3 h-3 text-amber-500" />
              <span>admin panel</span>
            </button>
          </div>

          {/* CENTER: Exact Center Brand Logo / Name: [YOUR BRAND ] */}
          <div className="flex items-center justify-center px-4 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-2xl xl:text-3xl font-bold tracking-[0.18em] uppercase text-neutral-950 hover:opacity-85 transition-opacity whitespace-nowrap leading-none"
            >
              YOUR BRAND
            </a>
          </div>

          {/* RIGHT SIDE: SEARCH, WISHLIST (with small circular badge), BAG (with small circular badge) */}
          <div className="flex items-center justify-end gap-5 xl:gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-900 min-w-0">
            {/* Currency selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-neutral-700 hover:text-black py-1 cursor-pointer font-medium"
              >
                <span>{currency.code}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-neutral-200 shadow-xl py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onSelectCurrency(c);
                        setCurrencyDropdownOpen(false);
                        onNotify(`Switched currency to ${c.code}`);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-100 flex justify-between cursor-pointer ${
                        currency.code === c.code ? 'font-bold bg-neutral-50 text-black' : 'text-neutral-700'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-neutral-400">{c.symbol.trim()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-neutral-600" />
              <span>SEARCH</span>
            </button>

            {/* WISHLIST with small circular item-count badge */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors cursor-pointer group shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black transition-colors" />
              <span>WISHLIST</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold leading-none group-hover:bg-black transition-colors shadow-2xs">
                {wishlistCount}
              </span>
            </button>

            {/* BAG with small circular item-count badge */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 text-neutral-800 hover:text-black transition-colors cursor-pointer group shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black transition-colors" />
              <span>BAG</span>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold leading-none group-hover:bg-black transition-colors shadow-2xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE & TABLET HEADER (Guarantees zero text collision/overflow) */}
        <div className="lg:hidden relative flex items-center justify-between px-3 sm:px-5 py-3 border-b border-neutral-200">
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1.5 p-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-black cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-neutral-900" />
              <span className="text-[11px] font-bold">MENU</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-1.5 text-neutral-800 hover:text-black cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-neutral-800" />
            </button>
          </div>

          {/* Center: EXACT CENTER BRAND LOGO: [YOUR BRAND ] */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-auto">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-lg sm:text-xl font-bold tracking-[0.14em] uppercase text-neutral-950 truncate max-w-[170px] sm:max-w-none text-center"
            >
              YOUR BRAND
            </a>
          </div>

          {/* Right: Admin icon, Wishlist, Bag with badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 z-10">
            <button
              onClick={() => setAdminModalOpen(true)}
              className="p-1.5 text-neutral-700 hover:text-black cursor-pointer"
              title="Admin Panel"
              aria-label="Admin panel"
            >
              <Shield className="w-4 h-4 text-neutral-900" />
            </button>

            {/* Wishlist Icon with circular item-count badge */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1.5 text-neutral-800 hover:text-black cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-neutral-800" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold leading-none">
                {wishlistCount}
              </span>
            </button>

            {/* Bag Icon with circular item-count badge */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 text-neutral-900 hover:text-black cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-900" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] font-bold leading-none">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE DEPARTMENT SELECTOR RAIL (1-Tap Switch, No Scroll Overlap) */}
        {/* ======================================================== */}
        <div className="lg:hidden border-b border-neutral-200 bg-white px-3 py-1.5 flex items-center gap-4 overflow-x-auto scrollbar-none whitespace-nowrap text-[11px] font-bold tracking-wider uppercase">
          <button
            onClick={() => {
              onSelectDepartment('Woman');
              onNotify('Viewing WOMEN collection');
            }}
            className={`py-1 cursor-pointer shrink-0 transition-colors ${
              currentDepartment === 'Woman'
                ? 'text-black border-b-2 border-black font-extrabold -mb-[7px]'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => {
              onSelectDepartment('Man');
              onNotify('Viewing MEN collection');
            }}
            className={`py-1 cursor-pointer shrink-0 transition-colors ${
              currentDepartment === 'Man'
                ? 'text-black border-b-2 border-black font-extrabold -mb-[7px]'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            MEN
          </button>
          <button
            onClick={() => {
              onSelectDepartment('Teens');
              onNotify('Viewing TEENS collection');
            }}
            className={`py-1 cursor-pointer shrink-0 transition-colors ${
              currentDepartment === 'Teens'
                ? 'text-black border-b-2 border-black font-extrabold -mb-[7px]'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            TEENS
          </button>
          <button
            onClick={() => {
              onSelectDepartment('Fragrance & Beauty');
              onNotify('Viewing FRAGRANCE & BEAUTY collection');
            }}
            className={`py-1 cursor-pointer shrink-0 transition-colors ${
              currentDepartment === 'Fragrance & Beauty'
                ? 'text-black border-b-2 border-black font-extrabold -mb-[7px]'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            FRAGRANCE & BEAUTY
          </button>
          <button
            onClick={() => setAdminModalOpen(true)}
            className="py-1 cursor-pointer shrink-0 text-amber-700 font-bold flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-amber-600" />
            <span>ADMIN</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. ROW 3: SUB-NAVIGATION BAR (Tailored to active dept)   */}
        {/* ======================================================== */}
        <nav
          aria-label="Department categories"
          className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative px-4 overflow-x-auto scrollbar-none whitespace-nowrap py-1 bg-white border-b border-neutral-100"
        >
          {currentDepartment === 'Man' ? (
            <>
              <button
                onClick={() => handleNavClick('New in')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                NEW IN
              </button>
              <button
                onClick={() => handleNavClick('KAMEEZ SHALWAR')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                KAMEEZ SHALWAR
              </button>
              <button
                onClick={() => handleNavClick('KURTA TROUSER')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                KURTA TROUSER
              </button>
              <button
                onClick={() => handleNavClick('WAISTCOAT')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                WAISTCOAT
              </button>
              <button
                onClick={() => handleNavClick('UNSTITCHED')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                UNSTITCHED
              </button>
              <button
                onClick={() => handleNavClick('FORMAL KURTA')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                FORMAL KURTA
              </button>
              <button
                onClick={() => handleNavClick('FOOTWEAR')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                FOOTWEAR
              </button>
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-bold hover:text-red-800 transition-colors cursor-pointer py-2"
              >
                SALE
              </button>
            </>
          ) : currentDepartment === 'Teens' ? (
            <>
              <button
                onClick={() => handleNavClick('Summer 26')}
                className="font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer py-2"
              >
                SUMMER '26
              </button>
              <button
                onClick={() => handleNavClick('Teen Girls')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                TEEN GIRLS
              </button>
              <button
                onClick={() => handleNavClick('Teen Boys')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                TEEN BOYS
              </button>
              <button
                onClick={() => handleNavClick('Kid Girls')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                KID GIRLS
              </button>
              <button
                onClick={() => handleNavClick('Kid Boys')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                KID BOYS
              </button>
              <button
                onClick={() => handleNavClick('Infant')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                INFANT
              </button>
              <button
                onClick={() => handleNavClick('Trending')}
                className="hover:text-black text-neutral-900 font-semibold transition-colors cursor-pointer py-2"
              >
                TRENDING
              </button>
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-bold hover:text-red-800 transition-colors cursor-pointer py-2"
              >
                SALE
              </button>
            </>
          ) : currentDepartment === 'Fragrance & Beauty' ? (
            <>
              <button
                onClick={() => handleNavClick('All')}
                className="hover:text-black text-neutral-900 font-semibold transition-colors cursor-pointer py-2"
              >
                DISCOVER ALL
              </button>
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setFragranceMegaOpen(true)}
              >
                <button
                  onClick={() => {
                    handleNavClick('Fragrances');
                    setFragranceMegaOpen(true);
                  }}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>FRAGRANCES</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                </button>
              </div>
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setFragranceMegaOpen(true)}
              >
                <button
                  onClick={() => {
                    handleNavClick('Makeup');
                    setFragranceMegaOpen(true);
                  }}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>MAKEUP</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                </button>
              </div>
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setFragranceMegaOpen(true)}
              >
                <button
                  onClick={() => {
                    handleNavClick('Skin Care');
                    setFragranceMegaOpen(true);
                  }}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>SKIN CARE</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                </button>
              </div>
              <button
                onClick={() => handleNavClick('Body & Home')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                BODY & HOME
              </button>
              <button
                onClick={() => handleNavClick('Bakhoor')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                BAKHOOR
              </button>
              <button
                onClick={() => handleNavClick('Scented Candle')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                CANDLES
              </button>
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-bold hover:text-red-800 transition-colors cursor-pointer py-2"
              >
                OFFERS & SALE
              </button>
            </>
          ) : (
            /* Women categories */
            <>
              <button
                onClick={() => handleNavClick('New in')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                NEW IN
              </button>

              {/* Ready to wear */}
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setActiveMegaMenu('rtw')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick('Ready to wear')}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
                >
                  READY TO WEAR
                </button>

                {/* Mega Menu with w-full max-w-5xl (zero screen scrollbar overflow!) */}
                {activeMegaMenu === 'rtw' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(90vw,1024px)] bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-4 gap-8 z-50 text-left normal-case tracking-normal">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                        Shop by type
                      </h4>
                      <ul className="space-y-2 text-xs text-neutral-600">
                        <li>
                          <button
                            onClick={() => handleNavClick('Co-ords')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Co-ords
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Kurta')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Kurta
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('3 piece stitched')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            3 piece stitched
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Dresses')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Lawn
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Raw silk')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Raw silk
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Cotton')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Cotton
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Chiffon')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Essentials
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Luxe')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Luxe
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Signature')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                        className="text-xs font-semibold text-neutral-950 underline cursor-pointer"
                      >
                        Explore Edit &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Unstitched */}
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setActiveMegaMenu('uns')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick('Unstitched')}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
                >
                  UNSTITCHED
                </button>

                {activeMegaMenu === 'uns' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(90vw,1024px)] bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-4 gap-8 z-50 text-left normal-case tracking-normal">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                        Shop by type
                      </h4>
                      <ul className="space-y-2 text-xs text-neutral-600">
                        <li>
                          <button
                            onClick={() => handleNavClick('1 piece unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            1 piece
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('2 piece unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            2 piece
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('3 piece unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Lawn
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Khaddar unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Khaddar
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Karandi unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Signature Prints
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Winter Velvet Unstitched')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                        className="text-xs font-semibold text-neutral-950 underline cursor-pointer"
                      >
                        View Noya &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Formals */}
              <button
                onClick={() => handleNavClick('Formals')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                FORMALS
              </button>

              {/* Footwear */}
              <button
                onClick={() => handleNavClick('Footwear')}
                className="hover:text-black text-neutral-700 transition-colors cursor-pointer py-2"
              >
                FOOTWEAR
              </button>

              {/* Accessories */}
              <div
                className="py-2 relative group cursor-pointer"
                onMouseEnter={() => setActiveMegaMenu('acc')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => handleNavClick('Accessories')}
                  className="hover:text-black text-neutral-700 transition-colors cursor-pointer"
                >
                  ACCESSORIES
                </button>

                {activeMegaMenu === 'acc' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[min(90vw,768px)] bg-white border border-neutral-200 shadow-2xl p-8 grid grid-cols-3 gap-8 z-50 text-left normal-case tracking-normal">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1.5">
                        Bags
                      </h4>
                      <ul className="space-y-2 text-xs text-neutral-600">
                        <li>
                          <button
                            onClick={() => handleNavClick('Totes')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Totes
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Clutches')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Artisanal Filigree
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Earrings')}
                            className="hover:text-black hover:underline cursor-pointer"
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
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Silk Scarves
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNavClick('Wallets')}
                            className="hover:text-black hover:underline cursor-pointer"
                          >
                            Cardholders
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* S Y N C C */}
              <button
                onClick={() => handleNavClick('Trending')}
                className="hover:text-black text-neutral-800 transition-colors cursor-pointer py-2 tracking-[0.25em] font-semibold"
              >
                S Y N C C
              </button>

              {/* Sale */}
              <button
                onClick={() => handleNavClick('Sale')}
                className="text-red-700 font-bold hover:text-red-800 transition-colors cursor-pointer py-2"
              >
                SALE
              </button>
            </>
          )}
        </nav>

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

      {/* ======================================================== */}
      {/* 4. MOBILE SLIDE-OUT DRAWER MENU (Zero Overflow)          */}
      {/* ======================================================== */}
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
                  className="p-1.5 text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department horizontal selector inside drawer */}
              <div className="p-3 bg-neutral-50 flex gap-2 overflow-x-auto border-b border-neutral-200 scrollbar-none">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      onSelectDepartment(dept);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs px-2.5 py-1 uppercase whitespace-nowrap font-semibold transition-colors cursor-pointer ${
                      currentDepartment === dept
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {dept === 'Woman' ? 'WOMEN' : dept === 'Man' ? 'MEN' : dept}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAdminModalOpen(true);
                  }}
                  className="text-xs px-2.5 py-1 uppercase whitespace-nowrap font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Shield className="w-3 h-3 text-amber-700" />
                  <span>Admin</span>
                </button>
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
                    className={`w-full text-left px-5 py-3.5 flex justify-between items-center transition-colors cursor-pointer ${
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
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 uppercase font-medium">Currency</span>
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const found = currencies.find((c) => c.code === e.target.value);
                    if (found) onSelectCurrency(found);
                  }}
                  className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs uppercase cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium text-center cursor-pointer hover:bg-black transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="w-full py-2 border border-neutral-300 bg-white text-neutral-800 text-xs uppercase tracking-wider font-medium text-center cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        currentDepartment={currentDepartment}
        onSelectDepartment={onSelectDepartment}
        currency={currency}
        onNotify={onNotify}
      />
    </>
  );
};
