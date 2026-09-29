import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BEAUTY_CATEGORIES, MEGA_MENU_COLUMNS } from '../../data/fragranceBeautyData';

interface FragranceMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
}

export const FragranceMegaMenu: React.FC<FragranceMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-md border-b border-neutral-200 shadow-2xl z-50 transition-all duration-300 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Columns: Text Links Hierarchy */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-6">
            {MEGA_MENU_COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3">
                <button
                  onClick={() => {
                    onSelectCategory(col.title);
                    onClose();
                  }}
                  className="font-serif font-bold text-xs tracking-wider uppercase text-neutral-950 pb-1 border-b border-neutral-200 block w-full text-left hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  {col.title}
                </button>
                <ul className="space-y-2 text-xs">
                  {col.items.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          onSelectCategory(item.slug);
                          onClose();
                        }}
                        className="text-neutral-600 hover:text-neutral-950 transition-colors flex items-center justify-between w-full group py-0.5 text-left cursor-pointer"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {item.name}
                        </span>
                        {item.isHot && (
                          <span className="text-[9px] uppercase tracking-widest font-bold text-red-600 bg-red-50 px-1 py-0.2">
                            Hot
                          </span>
                        )}
                        {item.isNew && (
                          <span className="text-[9px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-1 py-0.2">
                            New
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Columns: 3 Visual Featured Cards */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            {BEAUTY_CATEGORIES.slice(0, 3).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  onClose();
                }}
                className="group relative cursor-pointer overflow-hidden border border-neutral-100 bg-neutral-50 flex flex-col"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider block">
                      {cat.name}
                    </span>
                    <span className="text-[9px] text-neutral-300 font-light flex items-center gap-1 group-hover:text-white transition-colors">
                      Shop Now
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <p>
            Complimentary luxury fragrance samples with every order above PKR 5,000.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onClose();
            }}
            className="font-medium text-neutral-900 hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
          >
            Explore Complete Beauty Catalog &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
