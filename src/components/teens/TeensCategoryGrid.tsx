import React from 'react';
import { CategoryCard } from '../../data/teensData';
import { ArrowUpRight } from 'lucide-react';

interface TeensCategoryGridProps {
  categories: CategoryCard[];
  onSelectCategory: (categoryName: string) => void;
}

export const TeensCategoryGrid: React.FC<TeensCategoryGridProps> = ({
  categories,
  onSelectCategory,
}) => {
  const activeCategories = [...categories]
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 bg-white max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 border-b border-neutral-100 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
            Summer '26 Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-neutral-950">
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-neutral-500 font-light hidden sm:block">
            Curated silhouettes designed for ages 0 months to 18 years
          </p>
        </div>
      </div>

      {/* Premium Category Cards: Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-2">
        {activeCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className="group cursor-pointer flex flex-col overflow-hidden bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all duration-500 rounded-xs shadow-xs hover:shadow-md"
          >
            {/* Image Container with Zoom Effect */}
            <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-neutral-950/25 transition-colors duration-300" />

              {/* Top-Right Arrow badge */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-900 opacity-80 group-hover:opacity-100 group-hover:bg-neutral-950 group-hover:text-white transition-all duration-300 shadow-xs">
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Category Info */}
            <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white border-t border-neutral-100">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 uppercase tracking-wide group-hover:text-neutral-700 transition-colors">
                  {category.name}
                </h3>
                {category.subtitle && (
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {category.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-2.5 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                <span>View Collection</span>
                <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
