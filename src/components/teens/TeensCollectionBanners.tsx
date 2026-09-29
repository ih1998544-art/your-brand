import React from 'react';
import { PromoBanner } from '../../data/teensData';
import { ArrowRight } from 'lucide-react';

interface TeensCollectionBannersProps {
  banners: PromoBanner[];
  onBannerClick: (link: string, category: string) => void;
}

export const TeensCollectionBanners: React.FC<TeensCollectionBannersProps> = ({
  banners,
  onBannerClick,
}) => {
  const activeBanners = [...banners]
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 bg-neutral-50/60 max-w-7xl mx-auto relative border-b border-neutral-200/60">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
            Little Icons Edition
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-950">
            Collection Features
          </h2>
        </div>
      </div>

      {/* 3 Collection Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {activeBanners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => onBannerClick(banner.link, banner.category)}
            className="group relative cursor-pointer overflow-hidden rounded-xs bg-neutral-950 aspect-4/5 sm:aspect-3/4 flex flex-col justify-end p-6 sm:p-8 shadow-md"
          >
            {/* Background Image with Zoom */}
            <img
              src={banner.imageUrl}
              alt={banner.heading}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
            <div className="absolute inset-0 bg-neutral-950/15 group-hover:bg-neutral-950/30 transition-colors duration-300" />

            {/* Banner Content */}
            <div className="relative z-10 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 block">
                {banner.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                {banner.heading}
              </h3>
              <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-2 max-w-xs">
                {banner.description}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  className="bg-white text-neutral-950 group-hover:bg-neutral-100 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 flex items-center gap-2 rounded-xs shadow-md"
                >
                  <span>{banner.buttonText || 'Shop Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
