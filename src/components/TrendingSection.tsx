import React, { useState } from 'react';
import { Product, ProductTab, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { X } from 'lucide-react';

interface TrendingSectionProps {
  products: Product[];
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  onSeeAll: (tab: ProductTab) => void;
  activeTab?: ProductTab;
  onSelectTab?: (tab: ProductTab) => void;
  categoryFilter?: string | null;
  onClearFilter?: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  onSeeAll,
  activeTab: controlledTab,
  onSelectTab,
  categoryFilter,
  onClearFilter,
}) => {
  const [internalTab, setInternalTab] = useState<ProductTab>('rtw');
  const activeTab = controlledTab ?? internalTab;

  const handleTabChange = (tab: ProductTab) => {
    if (categoryFilter && onClearFilter) {
      onClearFilter();
    }
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const tabs: { key: ProductTab; label: string }[] = [
    { key: 'rtw', label: 'Ready to wear' },
    { key: 'uns', label: 'Unstitched' },
    { key: 'frm', label: 'Formals' },
  ];

  const filteredProducts = React.useMemo(() => {
    if (categoryFilter) {
      const q = categoryFilter.trim().toLowerCase();
      if (q === 'sale') {
        return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
      }
      if (q === 'new in') {
        return products.filter((p) => p.isNew);
      }
      if (
        q.includes('pre-winter') ||
        q.includes('couture') ||
        q.includes('peshwas') ||
        q.includes('velvet')
      ) {
        return products.filter(
          (p) =>
            p.id.includes('couture') ||
            p.name.toLowerCase().includes('peshwas') ||
            p.name.toLowerCase().includes('velvet') ||
            p.name.toLowerCase().includes('couture') ||
            p.fabric.toLowerCase().includes('velvet')
        );
      }
      if (
        q.includes('footwear') ||
        q.includes('chappal') ||
        q.includes('khussa') ||
        q.includes('kolhapuri') ||
        q.includes('jutti') ||
        q.includes('mule')
      ) {
        return products.filter(
          (p) =>
            p.sku.includes('FW') ||
            p.name.toLowerCase().includes('chappal') ||
            p.name.toLowerCase().includes('khussa') ||
            p.name.toLowerCase().includes('kolhapuri') ||
            p.name.toLowerCase().includes('jutti') ||
            p.name.toLowerCase().includes('mule')
        );
      }
      if (
        q.includes('accessori') ||
        q.includes('artisanal') ||
        q.includes('jewel') ||
        q.includes('bag') ||
        q.includes('clutch')
      ) {
        return products.filter(
          (p) =>
            p.categoryKey === 'jewel' ||
            p.sku.includes('ACC') ||
            p.name.toLowerCase().includes('bag') ||
            p.name.toLowerCase().includes('clutch') ||
            p.name.toLowerCase().includes('choker') ||
            p.name.toLowerCase().includes('chandbali')
        );
      }
      if (q.includes('waistcoat')) {
        return products.filter((p) => p.name.toLowerCase().includes('waistcoat'));
      }
      if (q.includes('trouser')) {
        return products.filter((p) => p.name.toLowerCase().includes('trouser'));
      }
      if (q.includes('kameez')) {
        return products.filter((p) => p.name.toLowerCase().includes('kameez'));
      }
      if (q.includes('unstitched') || q.includes('boski') || q.includes('latha')) {
        return products.filter((p) => p.tab === 'uns');
      }
      if (q.includes('formal') || q.includes('ceremonial')) {
        return products.filter((p) => p.tab === 'frm');
      }
      if (q.includes('co-ord')) {
        return products.filter((p) => p.categoryKey === 'coord');
      }
      if (q.includes('kurta')) {
        return products.filter(
          (p) =>
            p.categoryKey === 'kurta' ||
            p.name.toLowerCase().includes('kurta')
        );
      }
      // General text fallback
      const matching = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.details.toLowerCase().includes(q)
      );
      if (matching.length > 0) return matching;
    }
    return products.filter((p) => p.tab === activeTab);
  }, [categoryFilter, products, activeTab]);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-4 sm:mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-900 tracking-wide uppercase font-normal">
            Trending
          </h2>
          {categoryFilter && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold rounded-full">
                Filtered: {categoryFilter}
                <button
                  onClick={onClearFilter}
                  aria-label="Clear filter"
                  className="hover:text-red-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
              <button
                onClick={onClearFilter}
                className="text-xs text-neutral-500 hover:text-black underline uppercase tracking-wider"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (categoryFilter && onClearFilter) onClearFilter();
            onSeeAll(activeTab);
          }}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
        >
          See all
        </button>
      </div>

      {/* Segmented Tabs */}
      <div className="flex gap-6 sm:gap-8 border-b border-neutral-200 mb-8 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = !categoryFilter && activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-neutral-950 text-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4-Column Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">
          <p className="text-sm">No items found matching this filter in this department.</p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="mt-3 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
            >
              Show All
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              currency={currency}
              isWishlisted={wishlistIds.has(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
};
