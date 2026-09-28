import React from 'react';
import { Department } from '../types';

interface TwoColumnBannersProps {
  onBannerClick: (category: string) => void;
  department?: Department;
}

export const TwoColumnBanners: React.FC<TwoColumnBannersProps> = ({ onBannerClick, department = 'Woman' }) => {
  const isMan = department === 'Man';

  return (
    <section className="px-4 sm:px-8 md:px-12 max-w-7xl mx-auto my-6 md:my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Banner 1 */}
        <div
          onClick={() => onBannerClick(isMan ? 'Waistcoat' : 'Co-ords')}
          className="group relative aspect-[4/5] max-h-[600px] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
            <img
              src={isMan ? '/src/assets/images/men_waistcoat_1790620187397.jpg' : '/src/assets/images/coords_olive_linen_1790617801415.jpg'}
              alt={isMan ? 'Waistcoat Collection' : 'Co-ords Ready to wear'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 sm:bottom-12 text-center text-white z-10 px-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-1">
              {isMan ? 'Waistcoat' : 'Co-ords'}
            </h3>
            <small className="block text-xs uppercase tracking-[0.2em] text-neutral-200 mb-4 font-light">
              Ready to wear
            </small>
            <span className="inline-block bg-white text-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors">
              Shop now
            </span>
          </div>
        </div>

        {/* Banner 2 */}
        <div
          onClick={() => onBannerClick('Unstitched')}
          className="group relative aspect-[4/5] max-h-[600px] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
            <img
              src={isMan ? '/src/assets/images/men_unstitched_boski_1790620213843.jpg' : '/src/assets/images/noya_luxury_unstitched_1790617815906.jpg'}
              alt={isMan ? 'Platinum Unstitched' : '3 Piece Unstitched'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 sm:bottom-12 text-center text-white z-10 px-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-1">
              {isMan ? 'Platinum Boski' : '3 Piece'}
            </h3>
            <small className="block text-xs uppercase tracking-[0.2em] text-neutral-200 mb-4 font-light">
              Unstitched
            </small>
            <span className="inline-block bg-white text-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors">
              Shop now
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
