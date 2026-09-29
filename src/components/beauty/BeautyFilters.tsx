import React from 'react';
import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';

export type BeautySortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

interface BeautyFiltersProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeSubcategory: string;
  onSelectSubcategory: (subcat: string) => void;
  subcategories: string[];
  sortBy: BeautySortOption;
  onSelectSort: (sort: BeautySortOption) => void;
  totalCount: number;
  gridCols: 4 | 3 | 2;
  onChangeGridCols: (cols: 4 | 3 | 2) => void;
  showSaleOnly: boolean;
  onToggleSaleOnly: () => void;
}

const CATEGORIES = [
  'All',
  'Fragrances',
  'Makeup',
  'Skin Care',
  'Body & Home',
];

export const BeautyFilters: React.FC<BeautyFiltersProps> = ({
  activeCategory,
  onSelectCategory,
  activeSubcategory,
  onSelectSubcategory,
  subcategories,
  sortBy,
  onSelectSort,
  totalCount,
  gridCols,
  onChangeGridCols,
  showSaleOnly,
  onToggleSaleOnly,
}) => {
  return (
    <div className="bg-white border-b border-neutral-200 sticky top-14 z-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col gap-3">
        {/* Top Filter Bar: Category Tabs & Grid/Sort Options */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Category Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onSelectSubcategory('All');
                }}
                className={`text-xs font-sans uppercase tracking-wider px-3.5 py-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-neutral-950 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Sale Filter Toggle */}
            <button
              onClick={onToggleSaleOnly}
              className={`text-xs font-sans uppercase tracking-wider px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap ml-1 ${
                showSaleOnly
                  ? 'bg-red-700 text-white font-semibold'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Offers & Sale
            </button>
          </div>

          {/* Right Controls: Sort & Grid Layout */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Total Results Counter */}
            <span className="text-xs text-neutral-500 font-light hidden md:inline">
              {totalCount} Articles
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
              <label htmlFor="beauty-sort" className="sr-only">
                Sort by
              </label>
              <select
                id="beauty-sort"
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value as BeautySortOption)}
                className="bg-transparent text-xs uppercase tracking-wider font-medium text-neutral-900 border border-neutral-300 px-2.5 py-1.5 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Grid Column Selector (Desktop) */}
            <div className="hidden lg:flex items-center border border-neutral-300 divide-x divide-neutral-300">
              <button
                onClick={() => onChangeGridCols(4)}
                className={`p-1.5 hover:bg-neutral-100 ${
                  gridCols === 4 ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                }`}
                title="4 Columns"
                aria-label="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onChangeGridCols(3)}
                className={`p-1.5 hover:bg-neutral-100 ${
                  gridCols === 3 ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                }`}
                title="3 Columns"
                aria-label="3 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subcategories Horizontal Bar (if available) */}
        {subcategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mr-1">
              Type:
            </span>
            {subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => onSelectSubcategory(subcat)}
                className={`text-[11px] font-sans px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer ${
                  activeSubcategory.toLowerCase() === subcat.toLowerCase()
                    ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-black'
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
