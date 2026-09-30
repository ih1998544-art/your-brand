import React, { useState, useMemo } from 'react';
import { PRODUCTS, CURRENCIES } from './data/products';
import { Product, CartItem, Currency, Department, ProductTab } from './types';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedBanner } from './components/FeaturedBanner';
import { TrendingSection } from './components/TrendingSection';
import { TwoColumnBanners } from './components/TwoColumnBanners';
import { TrendingFitsRail } from './components/TrendingFitsRail';
import { ThreeColumnBanners } from './components/ThreeColumnBanners';
import { StoreLocatorSection } from './components/StoreLocatorSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SignInModal } from './components/SignInModal';
import { AccountModal } from './components/AccountModal';
import { ServerAuthTestModal } from './components/ServerAuthTestModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';
import { TeensHomepage } from './components/teens/TeensHomepage';
import { FragranceBeautyHomepage } from './components/beauty/FragranceBeautyHomepage';
import { INITIAL_TRENDING_PRODUCTS, INITIAL_TRENDING_FITS, adaptTeenToProduct } from './data/teensData';
import { UserProfile, UserOrder } from './types';
import { adminStore } from './services/adminStore';
import { authService } from './services/authService';

export default function App() {
  // Navigation & Department
  const [currentDepartment, setCurrentDepartment] = useState<Department>('Fragrance & Beauty');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]); // default PKR

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('yb_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      name: 'Sajjad',
      email: 'sajjad501633@gmail.com',
      phone: '+92 300 1234567',
      address: 'House 42, Street 15, DHA Phase 6',
      city: 'Karachi',
      memberTier: 'Diamond Atelier Patron',
      loyaltyPoints: 3450,
      isLoggedIn: true,
      orders: [
        {
          id: 'YB-84920',
          date: 'Sep 24, 2026',
          total: 18480,
          itemsCount: 2,
          status: 'Dispatched',
          items: [
            { name: 'Peach Lawn Embroidered Co-Ord Set', size: 'M', quantity: 1 },
            { name: 'Amber Oud Extrait De Parfum', size: '50ml', quantity: 1 },
          ],
        },
      ],
    };
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(['rtw-1']));

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Plum Magenta Embroidered Kurta Set
      size: 'M',
      quantity: 1,
    },
  ]);

  // Modals & Drawers state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [serverTestOpen, setServerTestOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Discount state passed to checkout
  const [cartDiscount, setCartDiscount] = useState<{ percent: number; code: string }>({
    percent: 0,
    code: '',
  });

  // Verify server-side session on mount
  React.useEffect(() => {
    authService.verifySession().then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    });
  }, []);

  // Trending section tab and category filter state
  const [trendingTab, setTrendingTab] = useState<ProductTab>('rtw');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, setStoreTick] = useState(0);

  React.useEffect(() => {
    const handleStoreChange = () => setStoreTick((tick) => tick + 1);
    window.addEventListener('store_updated', handleStoreChange);
    return () => window.removeEventListener('store_updated', handleStoreChange);
  }, []);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Cart Handlers
  const handleQuickAdd = (product: Product, size: string) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    notify(`Added to bag: ${product.name} (Size ${size})`);
  };

  const handleAddToCartWithQuantity = (
    product: Product,
    size: string,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
    setSelectedProduct(null);
    notify(`Added ${quantity}x to bag: ${product.name} (${size})`);
  };

  const handleUpdateQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
    notify('Item removed from shopping bag');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // User Auth Handlers
  React.useEffect(() => {
    try {
      localStorage.setItem('yb_user_profile', JSON.stringify(currentUser));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  const handleSignInSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    notify(`Welcome, ${user.name}!`);
  };

  const handleSignOut = () => {
    authService.logout();
    setCurrentUser({
      name: 'Guest Client',
      email: '',
      isLoggedIn: false,
      memberTier: 'Guest',
      loyaltyPoints: 0,
    });
    notify('You have signed out from server session.');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        notify(`Removed from wishlist: ${product.name}`);
      } else {
        next.add(product.id);
        notify(`Saved to wishlist: ${product.name}`);
      }
      return next;
    });
  };

  const handleMoveToBag = (product: Product, size: string) => {
    handleQuickAdd(product, size);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
    notify(`Moved to bag: ${product.name} (${size})`);
  };

  const handleClearWishlist = () => {
    setWishlistIds(new Set());
    notify('Wishlist cleared');
  };

  const allTeensAdaptedProducts = useMemo(() => {
    return [
      ...INITIAL_TRENDING_PRODUCTS.map(adaptTeenToProduct),
      ...INITIAL_TRENDING_FITS.map(adaptTeenToProduct),
    ];
  }, []);

  const allAvailableProducts = useMemo(() => {
    const adminList = adminStore.getProducts();
    const map = new Map<string, Product>();
    PRODUCTS.forEach((p) => map.set(p.id, p));
    adminList.forEach((p) => map.set(p.id, p));
    allTeensAdaptedProducts.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [allTeensAdaptedProducts]);

  // Filtered lists
  const wishlistProducts = useMemo(() => {
    return allAvailableProducts.filter((p) => wishlistIds.has(p.id));
  }, [wishlistIds, allAvailableProducts]);

  const departmentProducts = useMemo(() => {
    if (currentDepartment === 'Man') {
      return PRODUCTS.filter((p) => p.department === 'Man');
    }
    return PRODUCTS.filter((p) => p.department === 'Woman');
  }, [currentDepartment]);

  const trendingFitsProducts = useMemo(() => {
    if (currentDepartment === 'Man') {
      return PRODUCTS.filter((p) => p.department === 'Man');
    }
    return PRODUCTS.filter(
      (p) => p.department === 'Woman' && (p.categorySlug === 'trending' || p.tab === 'trending')
    );
  }, [currentDepartment]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleShopCategory = (categoryName: string) => {
    notify(`Browsing collection: ${categoryName}`);
    const lower = categoryName.toLowerCase().trim();

    if (currentDepartment === 'Fragrance & Beauty') {
      setActiveCategoryFilter(categoryName);
      const elem = document.getElementById('beauty-products-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (currentDepartment === 'Teens') {
      setActiveCategoryFilter(categoryName);
      const elem = document.getElementById('trending');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (currentDepartment === 'Man') {
      if (lower === 'new in' || lower === 'new') {
        setTrendingTab('men_new');
        setActiveCategoryFilter(null);
      } else if (lower.includes('kameez') || lower.includes('shalwar')) {
        setTrendingTab('men_ks');
        setActiveCategoryFilter(null);
      } else if (lower.includes('trouser') || (lower.includes('kurta') && !lower.includes('formal'))) {
        setTrendingTab('men_kt');
        setActiveCategoryFilter(null);
      } else if (lower.includes('waistcoat')) {
        setTrendingTab('men_wc');
        setActiveCategoryFilter(null);
      } else if (lower.includes('unstitched') || lower.includes('boski') || lower.includes('latha')) {
        setTrendingTab('men_uns');
        setActiveCategoryFilter(null);
      } else if (lower.includes('formal') || lower.includes('sherwani') || lower.includes('prince')) {
        setTrendingTab('men_fk');
        setActiveCategoryFilter(null);
      } else if (
        lower.includes('footwear') ||
        lower.includes('shoe') ||
        lower.includes('chappal') ||
        lower.includes('kaptaan') ||
        lower.includes('peshawari') ||
        lower.includes('zalmi')
      ) {
        setTrendingTab('men_fw');
        setActiveCategoryFilter(null);
      } else if (lower === 'sale') {
        setTrendingTab('men_sale');
        setActiveCategoryFilter(null);
      } else {
        setActiveCategoryFilter(categoryName);
      }
    } else {
      if (lower === 'new in' || lower === 'new') {
        setTrendingTab('new');
        setActiveCategoryFilter(null);
      } else if (lower === 'ready to wear' || lower === 'rtw') {
        setTrendingTab('rtw');
        setActiveCategoryFilter(null);
      } else if (
        lower.includes('unstitched') ||
        lower.includes('boski') ||
        lower.includes('latha')
      ) {
        setTrendingTab('uns');
        setActiveCategoryFilter(null);
      } else if (lower.includes('formal') || lower.includes('peshwas') || lower.includes('gown')) {
        setTrendingTab('frm');
        setActiveCategoryFilter(null);
      } else if (
        lower.includes('footwear') ||
        lower.includes('shoe') ||
        lower.includes('khussa') ||
        lower.includes('kolhapuri') ||
        lower.includes('chappal') ||
        lower.includes('mule')
      ) {
        setTrendingTab('footwear');
        setActiveCategoryFilter(null);
      } else if (
        lower.includes('accessories') ||
        lower.includes('bag') ||
        lower.includes('jewel') ||
        lower.includes('clutch') ||
        lower.includes('scarf')
      ) {
        setTrendingTab('accessories');
        setActiveCategoryFilter(null);
      } else if (lower === 'trending') {
        setTrendingTab('trending');
        setActiveCategoryFilter(null);
      } else if (lower === 'sale') {
        setTrendingTab('sale');
        setActiveCategoryFilter(null);
      } else {
        setActiveCategoryFilter(categoryName);
      }
    }
    // Scroll smoothly to Trending section
    const elem = document.getElementById('trending-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentDepartment={currentDepartment}
        onSelectDepartment={(dept) => {
          setCurrentDepartment(dept);
          setActiveCategoryFilter(null);
          setTrendingTab(dept === 'Man' ? 'men_new' : 'new');
          notify(`Switched department to ${dept}`);
        }}
        currency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        currencies={CURRENCIES}
        wishlistCount={wishlistIds.size}
        cartCount={totalCartCount}
        currentUser={currentUser}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenServerTest={() => setServerTestOpen(true)}
        onSignOut={handleSignOut}
        onOpenTracking={() => setOrderTrackingOpen(true)}
        onOpenStoreLocator={() => setStoreLocatorOpen(true)}
        onFilterCategory={handleShopCategory}
        onNotify={notify}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentDepartment === 'Fragrance & Beauty' ? (
          <FragranceBeautyHomepage
            currency={selectedCurrency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onViewProduct={(p) => setSelectedProduct(p)}
            activeCategoryFilter={activeCategoryFilter}
            onFilterCategory={handleShopCategory}
            onNotify={notify}
            onOpenCheckout={() => setCheckoutOpen(true)}
          />
        ) : currentDepartment === 'Teens' ? (
          <TeensHomepage
            currency={selectedCurrency}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onViewProduct={(p) => setSelectedProduct(p)}
            activeCategoryFilter={activeCategoryFilter}
            onFilterCategory={handleShopCategory}
            onNotify={notify}
          />
        ) : (
          <>
            {/* Hero Carousel */}
            <HeroCarousel onShopClick={handleShopCategory} department={currentDepartment} />

            {/* Shop by Category Grid */}
            <CategoryGrid onSelectCategory={handleShopCategory} department={currentDepartment} />

            {/* Full-width Noya Collection Feature */}
            <FeaturedBanner onShopClick={handleShopCategory} department={currentDepartment} />

            {/* Trending Section (Ready to Wear, Unstitched, Formals) */}
            <div id="trending-section">
              <TrendingSection
                products={departmentProducts}
                department={currentDepartment}
                currency={selectedCurrency}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
                onViewProduct={(p) => setSelectedProduct(p)}
                onSeeAll={(tab) => {
                  setActiveCategoryFilter(null);
                  setTrendingTab(tab);
                  notify(`Showing all ${tab.toUpperCase()} items`);
                }}
                activeTab={trendingTab}
                onSelectTab={(tab) => {
                  setTrendingTab(tab);
                  setActiveCategoryFilter(null);
                }}
                categoryFilter={activeCategoryFilter}
                onClearFilter={() => setActiveCategoryFilter(null)}
              />
            </div>

            {/* 2-Column High-Impact Banners */}
            <TwoColumnBanners onBannerClick={handleShopCategory} department={currentDepartment} />

            {/* Horizontal Rail: Trending Fits */}
            <TrendingFitsRail
              products={trendingFitsProducts}
              currency={selectedCurrency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onViewProduct={(p) => setSelectedProduct(p)}
              onSeeAll={() => notify(currentDepartment === 'Man' ? "Viewing full Men's fits catalogue" : 'Viewing full Kurta fits catalogue')}
            />

            {/* 3-Column Visual Banners */}
            <ThreeColumnBanners onBannerClick={handleShopCategory} department={currentDepartment} />

            {/* Store Locator CTA Strip */}
            <StoreLocatorSection
              onOpenStoreLocator={() => setStoreLocatorOpen(true)}
              department={currentDepartment}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenStoreLocator={() => setStoreLocatorOpen(true)}
        onOpenTracking={() => setOrderTrackingOpen(true)}
        onNotify={notify}
      />

      {/* Slide-over Bag / Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        currency={selectedCurrency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={(discountPercent, promoCode) => {
          setCartDiscount({ percent: discountPercent || 0, code: promoCode || '' });
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onNotify={notify}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={selectedCurrency}
        onRemoveFromWishlist={handleToggleWishlist}
        onClearWishlist={handleClearWishlist}
        onQuickAdd={handleQuickAdd}
        onMoveToBag={handleMoveToBag}
        onViewProduct={(p) => setSelectedProduct(p)}
      />

      {/* Product Quick-View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        currency={selectedCurrency}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCartWithQuantity}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={allAvailableProducts}
        currency={selectedCurrency}
        onSelectProduct={(p) => setSelectedProduct(p)}
        department={currentDepartment}
      />

      {/* Store Locator Modal */}
      <StoreLocatorModal
        isOpen={storeLocatorOpen}
        onClose={() => setStoreLocatorOpen(false)}
        onNotify={notify}
        department={currentDepartment}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={orderTrackingOpen}
        onClose={() => setOrderTrackingOpen(false)}
        onNotify={notify}
      />

      {/* Customer VIP Account Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={currentUser}
        currency={selectedCurrency}
        wishlistCount={wishlistIds.size}
        cartCount={totalCartCount}
        onOpenWishlist={() => {
          setAccountOpen(false);
          setWishlistOpen(true);
        }}
        onOpenCart={() => {
          setAccountOpen(false);
          setCartOpen(true);
        }}
        onOpenTracking={() => {
          setAccountOpen(false);
          setOrderTrackingOpen(true);
        }}
        onUpdateProfile={handleUpdateProfile}
        onSignOut={handleSignOut}
        onNotify={notify}
      />

      {/* Customer Portal Sign In / Register Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onNotify={notify}
        onSignInSuccess={handleSignInSuccess}
        onOpenServerTest={() => setServerTestOpen(true)}
      />

      {/* Live Server-Side Authentication Test & Diagnostics Modal */}
      <ServerAuthTestModal
        isOpen={serverTestOpen}
        onClose={() => setServerTestOpen(false)}
        onNotify={notify}
      />

      {/* Express Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currency={selectedCurrency}
        appliedDiscount={cartDiscount.percent}
        promoCode={cartDiscount.code}
        currentUser={currentUser}
        onOrderSuccess={(orderId, orderDetails) => {
          handleClearCart();
          if (orderDetails && currentUser.isLoggedIn) {
            setCurrentUser((prev) => ({
              ...prev,
              orders: [orderDetails, ...(prev.orders || [])],
              loyaltyPoints: (prev.loyaltyPoints || 0) + Math.round(orderDetails.total / 100),
            }));
          }
          notify(`Order placed successfully: ${orderId}`);
        }}
      />

      {/* Floating Action Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
