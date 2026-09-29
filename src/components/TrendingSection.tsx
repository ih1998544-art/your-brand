import React, { useState, useMemo } from 'react';
import { Product, ProductTab, Currency, Department } from '../types';
import { ProductCard } from './ProductCard';
import { X, Filter, ArrowUpDown } from 'lucide-react';

interface TrendingSectionProps {
  products: Product[];
  department?: Department;
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct: (product: Product) => void;
  onSeeAll?: (tab: ProductTab) => void;
  activeTab?: ProductTab;
  onSelectTab?: (tab: ProductTab) => void;
  categoryFilter?: string | null;
  onClearFilter?: () => void;
}

const WOMEN_CATEGORY_TABS: { key: ProductTab; label: string; badge?: string }[] = [
  { key: 'new', label: 'New in', badge: 'New' },
  { key: 'rtw', label: 'Ready to wear' },
  { key: 'uns', label: 'Unstitched' },
  { key: 'frm', label: 'Formals' },
  { key: 'footwear', label: 'Footwear', badge: '10 Styles' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'trending', label: 'Trending' },
  { key: 'sale', label: 'Sale', badge: 'Sale' },
];

const MEN_CATEGORY_TABS: { key: ProductTab; label: string; badge?: string }[] = [
  { key: 'men_new', label: 'New in', badge: 'New' },
  { key: 'men_ks', label: 'Kameez Shalwar' },
  { key: 'men_kt', label: 'Kurta Trouser' },
  { key: 'men_wc', label: 'Waistcoat' },
  { key: 'men_uns', label: 'Unstitched' },
  { key: 'men_fk', label: 'Formal Kurta' },
  { key: 'men_fw', label: 'Footwear', badge: '10 Styles' },
  { key: 'men_sale', label: 'Sale', badge: 'Sale' },
];

const WOMEN_CATEGORY_DESCRIPTIONS: Record<string, { subtitle: string; tagline: string }> = {
  new: {
    subtitle: 'Spring/Summer Seasonal Drop',
    tagline: 'Fresh luxury releases showcasing bespoke neckline embroidery, organza embellishments, and artisanal crafts.',
  },
  rtw: {
    subtitle: 'Ready to Wear Collection',
    tagline: 'Effortless luxury ready-to-wear featuring premium pima lawn co-ords, chic kurtas, and tailored ensembles.',
  },
  uns: {
    subtitle: 'Unstitched Fabric Edit',
    tagline: 'Signature 80s lawn, textured winter karandi, and spun khaddar with hand-embroidered patches and printed shawls.',
  },
  frm: {
    subtitle: 'Couture & Festive Formals',
    tagline: 'Regal velvet peshwas, floor-sweeping festive gowns, tissue sets, and zardozi handcrafts for memorable celebrations.',
  },
  footwear: {
    subtitle: 'Artisanal Footwear Atelier',
    tagline: 'Handcrafted leather khussas, braided kolhapuris, block heel sandals, pointed velvet mules & ethnic slides with unlimited styles.',
  },
  accessories: {
    subtitle: 'Luxury Accessories & Bags',
    tagline: 'Architectural leather totes, fluted pleated bucket bags, raw silk box clutches, kundan jewellery, and hand-rolled silk scarves.',
  },
  trending: {
    subtitle: 'Most Coveted Fits',
    tagline: 'The most popular, sought-after articles across all departments trending right now.',
  },
  sale: {
    subtitle: 'Seasonal Reductions',
    tagline: 'Exclusive markdowns and promotional savings on luxury ready-to-wear, footwear, unstitched fabrics, and formal couture.',
  },
};

const MEN_CATEGORY_DESCRIPTIONS: Record<string, { subtitle: string; tagline: string }> = {
  men_new: {
    subtitle: 'Seasonal Menswear Releases',
    tagline: 'Fresh luxury drops in structured Egyptian cotton, tone-on-tone embroidery, and refined silhouette cuts.',
  },
  men_ks: {
    subtitle: 'Signature Kameez Shalwar Atelier',
    tagline: 'Tailored band collar and classic spread placket suits in breathable pima cotton, latha, and fine linen.',
  },
  men_kt: {
    subtitle: 'Contemporary Kurta Trouser Ensembles',
    tagline: 'Sleek straight-cut kurtas paired with tailored cigarette trousers in jacquard, textured slub, and linen.',
  },
  men_wc: {
    subtitle: 'Artisanal & Festive Waistcoats',
    tagline: 'Regal raw silk jamawar, velvet embroidered, and textured wool waistcoats featuring metallic embossed buttons.',
  },
  men_uns: {
    subtitle: 'Luxury Unstitched Fabric Yardage',
    tagline: 'Authentic 8-pound imported Chinese Mulberry Boski silk, premium mercerized Latha, and winter Karandi fabrics.',
  },
  men_fk: {
    subtitle: 'Festive & Ceremonial Formal Kurtas',
    tagline: 'Handcrafted zardozi, resham threadwork, and tonal geometric embroidery on pure cotton silk and raw silk.',
  },
  men_fw: {
    subtitle: 'Handcrafted Heritage Footwear',
    tagline: 'Charsadda full-grain leather, Kaptaan double-sole, Zalmi brass-studded, and Norozi Peshawari chappals.',
  },
  men_sale: {
    subtitle: 'Seasonal Menswear Savings',
    tagline: 'Exclusive markdowns and promotional pricing on luxury kurtas, waistcoats, shalwar suits, and artisan footwear.',
  },
};

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  products,
  department = 'Woman',
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  activeTab: controlledTab,
  onSelectTab,
  categoryFilter,
  onClearFilter,
}) => {
  const currentTabs = department === 'Man' ? MEN_CATEGORY_TABS : WOMEN_CATEGORY_TABS;
  const currentDescriptions = department === 'Man' ? MEN_CATEGORY_DESCRIPTIONS : WOMEN_CATEGORY_DESCRIPTIONS;

  const [internalTab, setInternalTab] = useState<ProductTab>(department === 'Man' ? 'men_new' : 'rtw');

  // Resolve activeTab safely for the current department
  const activeTab: ProductTab = useMemo(() => {
    const candidate = controlledTab ?? internalTab;
    if (department === 'Man') {
      if (candidate && candidate.startsWith('men_')) return candidate;
      return 'men_new';
    } else {
      if (candidate && !candidate.startsWith('men_')) return candidate;
      return 'rtw';
    }
  }, [controlledTab, internalTab, department]);

  // Local filter states
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const handleTabChange = (tab: ProductTab) => {
    setSelectedSize(null);
    if (categoryFilter && onClearFilter) {
      onClearFilter();
    }
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Base products from the catalog for the active category
  const baseCategoryProducts = useMemo(() => {
    if (categoryFilter) {
      const q = categoryFilter.trim().toLowerCase();
      if (department === 'Man') {
        if (q === 'new in' || q === 'new') {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_new' || p.tab === 'men_new' || p.isNew));
        }
        if (q.includes('kameez') || q.includes('shalwar')) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_ks' || p.tab === 'men_ks'));
        }
        if (q.includes('trouser') || (q.includes('kurta') && !q.includes('formal'))) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_kt' || p.tab === 'men_kt'));
        }
        if (q.includes('waistcoat')) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_wc' || p.tab === 'men_wc'));
        }
        if (q.includes('unstitched') || q.includes('boski') || q.includes('latha')) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_uns' || p.tab === 'men_uns'));
        }
        if (q.includes('formal') || q.includes('sherwani')) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_fk' || p.tab === 'men_fk'));
        }
        if (q.includes('footwear') || q.includes('chappal') || q.includes('kaptaan') || q.includes('peshawari')) {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_fw' || p.tab === 'men_fw'));
        }
        if (q === 'sale') {
          return products.filter((p) => p.department === 'Man' && (p.categorySlug === 'men_sale' || p.tab === 'men_sale'));
        }
      } else {
        if (q === 'footwear' || q.includes('chappal') || q.includes('khussa') || q.includes('kolhapuri') || q.includes('shoe')) {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'footwear' || p.tab === 'footwear' || p.categoryKey === 'footwear'));
        }
        if (q === 'accessories' || q.includes('bag') || q.includes('jewel') || q.includes('scarf') || q.includes('clutch')) {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'accessories' || p.tab === 'accessories' || p.categoryKey === 'accessories'));
        }
        if (q === 'new in' || q === 'new') {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'new' || p.tab === 'new' || p.isNew));
        }
        if (q === 'ready to wear' || q === 'rtw' || q.includes('co-ord') || q.includes('kurta')) {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'rtw' || p.tab === 'rtw'));
        }
        if (q === 'unstitched' || q.includes('boski') || q.includes('latha')) {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'uns' || p.tab === 'uns'));
        }
        if (q === 'formals' || q.includes('formal') || q.includes('gown') || q.includes('peshwas') || q.includes('couture')) {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'frm' || p.tab === 'frm'));
        }
        if (q === 'trending') {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'trending' || p.tab === 'trending'));
        }
        if (q === 'sale') {
          return products.filter((p) => p.department === 'Woman' && (p.categorySlug === 'sale' || p.tab === 'sale' || (p.originalPrice && p.originalPrice > p.price)));
        }
      }

      const matching = products.filter(
        (p) =>
          p.department === department &&
          (p.name.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.details.toLowerCase().includes(q))
      );
      if (matching.length > 0) return matching;
    }

    return products.filter((p) => {
      if (p.department !== department) return false;
      if (p.categorySlug) {
        return p.categorySlug === activeTab;
      }
      return p.tab === activeTab;
    });
  }, [categoryFilter, products, activeTab, department]);

  // Available sizes across items in this category
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    baseCategoryProducts.forEach((p) => {
      p.sizes.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [baseCategoryProducts]);

  // Filtered & Sorted products
  const displayedProducts = useMemo(() => {
    let result = [...baseCategoryProducts];

    // Filter by selected size if set
    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Sort by price or featured
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [baseCategoryProducts, selectedSize, sortBy]);

  const activeCategoryInfo = currentDescriptions[activeTab] || {
    subtitle: `${department}'s Collection`,
    tagline: 'Discover our luxury collection with bespoke designs, fine fabrics, and timeless styling.',
  };

  return (
    <section id="trending-section" className="py-12 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Category Tabs Bar */}
      <div className="border-b border-neutral-200 mb-8">
        <div className="flex gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-none pb-1">
          {currentTabs.map((tab) => {
            const isActive = !categoryFilter && activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`relative px-3 sm:px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-neutral-950 text-neutral-950 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-xs uppercase font-bold tracking-tight ${
                      tab.key === 'sale' || tab.key === 'men_sale'
                        ? 'bg-red-700 text-white'
                        : tab.key === 'new' || tab.key === 'men_new'
                        ? 'bg-amber-600 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Header Banner */}
      <div className="bg-neutral-50 border border-neutral-200/80 p-6 md:p-8 mb-8 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
              {activeCategoryInfo.subtitle}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-700">
              {displayedProducts.length} Articles
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 capitalize mb-2">
            {categoryFilter || currentTabs.find((t) => t.key === activeTab)?.label}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {activeCategoryInfo.tagline}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          {/* Active Filter Pill */}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold rounded-xs">
              Filter: {categoryFilter}
              <button
                onClick={onClearFilter}
                aria-label="Clear category filter"
                className="hover:text-red-300 ml-1 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Size Filter Dropdown */}
          {availableSizes.length > 0 && (
            <div className="flex items-center gap-1 text-xs border border-neutral-300 bg-white px-2.5 py-1.5 rounded-xs shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <select
                aria-label="Filter by size"
                value={selectedSize || ''}
                onChange={(e) => setSelectedSize(e.target.value || null)}
                className="bg-transparent text-xs font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="">All Sizes ({availableSizes.length})</option>
                {availableSizes.map((sz) => (
                  <option key={sz} value={sz}>
                    Size: {sz}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 text-xs border border-neutral-300 bg-white px-2.5 py-1.5 rounded-xs shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {(selectedSize || categoryFilter) && (
            <button
              onClick={() => {
                setSelectedSize(null);
                if (onClearFilter) onClearFilter();
              }}
              className="text-xs text-neutral-500 hover:text-black underline uppercase tracking-wider px-1 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Products Grid: 4 columns on desktop, 2 on mobile */}
      {displayedProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-300 rounded-xs bg-neutral-50 p-8">
          <p className="text-sm font-medium text-neutral-700 mb-1">
            No items match the selected size in this category.
          </p>
          <p className="text-xs text-neutral-500 mb-4">
            Try choosing a different size or reset the filters to view all {baseCategoryProducts.length} articles.
          </p>
          <button
            onClick={() => setSelectedSize(null)}
            className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Show All Sizes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((prod) => (
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

      {/* Category Footer Bar */}
      <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <span>
          Category: <strong className="text-neutral-900">{currentTabs.find((t) => t.key === activeTab)?.label}</strong> (Showing {displayedProducts.length} articles)
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('trending-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors underline cursor-pointer"
          >
            Back to Category Top &uarr;
          </button>
        </div>
      </div>
    </section>
  );
};
