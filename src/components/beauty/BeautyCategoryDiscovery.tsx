import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BEAUTY_CATEGORIES } from '../../data/fragranceBeautyData';

interface BeautyCategoryDiscoveryProps {
  onSelectCategory: (categoryName: string) => void;
}

export const BeautyCategoryDiscovery: React.FC<BeautyCategoryDiscoveryProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center mb-12 sm:mb-14">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-neutral-500 block mb-2">
          Curated Portfolios
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-normal uppercase tracking-tight">
          EXPLORE FRAGRANCE & BEAUTY
        </h2>
        <div className="w-12 h-0.5 bg-neutral-900 mx-auto mt-4" />
      </div>

      {/* 4 Large Editorial Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEAUTY_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="group cursor-pointer flex flex-col bg-white border border-neutral-100 hover:border-neutral-300 transition-all duration-300"
          >
            {/* Image Container with Subtle Zoom */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

              {/* Bottom Overlaid Label & Link */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] uppercase tracking-widest text-neutral-300 block mb-1 font-sans">
                  {cat.itemCount} Curated Articles
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider mb-2">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-white group-hover:text-amber-200 transition-colors">
                  <span>SHOP NOW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* Subtitle / Description beneath */}
            <div className="p-4 bg-white flex items-center justify-between border-t border-neutral-100">
              <p className="text-xs text-neutral-600 font-light truncate">
                {cat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
