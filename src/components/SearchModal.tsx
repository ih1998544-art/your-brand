import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, Currency, Department } from '../types';
import { VectorFashionArt } from './VectorFashionArt';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  department?: Department;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  department = 'Woman',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatPrice = (pkrAmount: number) => {
    const converted = pkrAmount * currency.rate;
    if (currency.code === 'PKR') {
      return `${currency.symbol} ${pkrAmount.toLocaleString('en-US')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.details.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.beautyCategory?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q) ||
        (p.fragranceNotes &&
          (p.fragranceNotes.top?.toLowerCase().includes(q) ||
            p.fragranceNotes.heart?.toLowerCase().includes(q) ||
            p.fragranceNotes.base?.toLowerCase().includes(q)))
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by product, fabric, collection (e.g. Lawn, Velvet, Kurta)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-neutral-400 hover:text-black uppercase"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black ml-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs text-neutral-600 scrollbar-none">
          <span className="text-[11px] text-neutral-400 uppercase font-medium">Trending:</span>
          {(department === 'Man'
            ? ['Boski', 'Kameez Shalwar', 'Waistcoat', 'Karandi', 'Latha', 'Peshawari']
            : department === 'Fragrance & Beauty'
            ? ['Oud', 'Eau De Parfum', 'Lipstick', 'Serum', 'Bakhoor', 'Candle', 'Rose']
            : ['Lawn', 'Co-Ords', 'Velvet', 'Organza', 'Raw Silk', 'Unstitched']
          ).map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-0.5 bg-white border border-neutral-200 rounded-xs hover:border-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
            {searchTerm ? `Results for "${searchTerm}" (${filtered.length})` : 'Popular Searches'}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              No matching pieces found. Try searching for &ldquo;Kurta&rdquo; or &ldquo;Lawn&rdquo;.
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 px-2 rounded-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-neutral-100 shrink-0 border border-neutral-200 overflow-hidden">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <VectorFashionArt
                        artKey={prod.categoryKey}
                        colorPalette={prod.colorPalette}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-black">
                      {prod.name}
                    </h4>
                    <span className="text-[11px] text-neutral-500">
                      {prod.fabric} &bull; {prod.department}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-950 block">
                    {formatPrice(prod.price)}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase flex items-center justify-end gap-1 group-hover:text-neutral-900 transition-colors">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
