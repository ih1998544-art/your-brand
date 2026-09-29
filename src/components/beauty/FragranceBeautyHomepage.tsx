import React, { useState, useMemo } from 'react';
import { Product, Currency } from '../../types';
import { FRAGRANCE_BEAUTY_PRODUCTS } from '../../data/fragranceBeautyData';
import { BeautyHeroSection } from './BeautyHeroSection';
import { BeautyCategoryDiscovery } from './BeautyCategoryDiscovery';
import { BeautySaleSection } from './BeautySaleSection';
import { BeautyFilters, BeautySortOption } from './BeautyFilters';
import { BeautyProductGrid } from './BeautyProductGrid';
import { BeautyQuickViewModal } from './BeautyQuickViewModal';

interface FragranceBeautyHomepageProps {
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct?: (product: Product) => void;
  activeCategoryFilter?: string | null;
  onFilterCategory?: (category: string) => void;
  onNotify: (msg: string) => void;
  onOpenCheckout?: () => void;
}

export const FragranceBeautyHomepage: React.FC<FragranceBeautyHomepageProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  activeCategoryFilter,
  onFilterCategory,
  onNotify,
  onOpenCheckout,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    activeCategoryFilter || 'All'
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<BeautySortOption>('featured');
  const [gridCols, setGridCols] = useState<4 | 3 | 2>(4);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync category if passed from navbar
  React.useEffect(() => {
    if (activeCategoryFilter) {
      if (
        activeCategoryFilter.toLowerCase() === 'sale' ||
        activeCategoryFilter.toLowerCase().includes('offer')
      ) {
        setShowSaleOnly(true);
        setActiveCategory('All');
      } else {
        setActiveCategory(activeCategoryFilter);
        setShowSaleOnly(false);
      }
      setActiveSubcategory('All');
    }
  }, [activeCategoryFilter]);

  // Derived subcategories for current category
  const availableSubcategories = useMemo(() => {
    if (activeCategory.toLowerCase() === 'all') {
      const allSubs = new Set<string>();
      FRAGRANCE_BEAUTY_PRODUCTS.forEach((p) => {
        if (p.subCategory) allSubs.add(p.subCategory);
      });
      return ['All', ...Array.from(allSubs)];
    }

    const filteredSubs = new Set<string>();
    FRAGRANCE_BEAUTY_PRODUCTS.filter(
      (p) => p.beautyCategory?.toLowerCase() === activeCategory.toLowerCase()
    ).forEach((p) => {
      if (p.subCategory) filteredSubs.add(p.subCategory);
    });

    return ['All', ...Array.from(filteredSubs)];
  }, [activeCategory]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let prods = [...FRAGRANCE_BEAUTY_PRODUCTS];

    // Filter by major category
    if (activeCategory.toLowerCase() !== 'all') {
      prods = prods.filter(
        (p) =>
          p.beautyCategory?.toLowerCase() === activeCategory.toLowerCase() ||
          p.subCategory?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by subcategory
    if (activeSubcategory.toLowerCase() !== 'all') {
      prods = prods.filter(
        (p) => p.subCategory?.toLowerCase() === activeSubcategory.toLowerCase()
      );
    }

    // Filter by sale
    if (showSaleOnly) {
      prods = prods.filter(
        (p) => p.originalPrice && p.originalPrice > p.price
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        prods.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        prods.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        prods.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        prods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // maintain curated order
        break;
    }

    return prods;
  }, [activeCategory, activeSubcategory, showSaleOnly, sortBy]);

  const handleSelectCategory = (cat: string) => {
    if (cat.toLowerCase() === 'sale' || cat.toLowerCase().includes('offer')) {
      setShowSaleOnly(true);
      setActiveCategory('All');
      setActiveSubcategory('All');
      onFilterCategory?.('Sale');
      onNotify('Viewing Fragrance & Beauty Top Sale Offers');
    } else {
      setActiveCategory(cat);
      setActiveSubcategory('All');
      setShowSaleOnly(false);
      onFilterCategory?.(cat);
      onNotify(`Viewing ${cat} portfolio`);
    }

    const elem = document.getElementById('beauty-products-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyNow = (product: Product, size: string, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      onQuickAdd(product, size);
    }
    setQuickViewProduct(null);
    onNotify(`Proceeding to checkout with ${product.name}`);
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Campaign Section */}
      <BeautyHeroSection
        onShopFragrances={() => handleSelectCategory('Fragrances')}
        onShopBeauty={() => handleSelectCategory('Makeup')}
      />

      {/* 2. Category Discovery Cards (Explore Fragrance & Beauty) */}
      <BeautyCategoryDiscovery onSelectCategory={handleSelectCategory} />

      {/* 3. Top 10 Curated Sale Collection */}
      <BeautySaleSection
        currency={currency}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onQuickAdd}
        onQuickView={(p) => {
          if (onViewProduct) {
            onViewProduct(p);
          } else {
            setQuickViewProduct(p);
          }
        }}
        onViewAllSale={() => {
          setShowSaleOnly(true);
          setActiveCategory('All');
          setActiveSubcategory('All');
          onNotify('Browsing complete Sale collection');
          const elem = document.getElementById('beauty-products-section');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4. Sticky Filter & Sorting Bar */}
      <div id="beauty-products-section" className="scroll-mt-16">
        <BeautyFilters
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          activeSubcategory={activeSubcategory}
          onSelectSubcategory={setActiveSubcategory}
          subcategories={availableSubcategories}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={filteredProducts.length}
          gridCols={gridCols}
          onChangeGridCols={setGridCols}
          showSaleOnly={showSaleOnly}
          onToggleSaleOnly={() => setShowSaleOnly(!showSaleOnly)}
        />
      </div>

      {/* 4. Products Grid */}
      <BeautyProductGrid
        products={filteredProducts}
        currency={currency}
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onQuickAdd}
        onQuickView={(p) => {
          if (onViewProduct) {
            onViewProduct(p);
          } else {
            setQuickViewProduct(p);
          }
        }}
        activeCategory={activeCategory}
        gridCols={gridCols}
      />

      {/* 5. Quick View Modal */}
      {quickViewProduct && (
        <BeautyQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          currency={currency}
          isWishlisted={wishlistIds.has(quickViewProduct.id)}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={(p, sz, qty) => {
            for (let i = 0; i < qty; i++) {
              onQuickAdd(p, sz);
            }
            setQuickViewProduct(null);
          }}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
};
