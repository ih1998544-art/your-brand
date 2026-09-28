import React from 'react';
import { Department } from '../types';

interface ThreeColumnBannersProps {
  onBannerClick: (category: string) => void;
  department?: Department;
}

export const ThreeColumnBanners: React.FC<ThreeColumnBannersProps> = ({ onBannerClick, department = 'Woman' }) => {
  const isMan = department === 'Man';

  return (
    <section className="px-4 sm:px-8 md:px-12 max-w-7xl mx-auto my-6 md:my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Banner 1 */}
        <div
          onClick={() => onBannerClick(isMan ? 'Formal Kurta' : 'Artisanal')}
          className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
            <img
              src={isMan ? '/src/assets/images/men_formal_kurta_1790620174901.jpg' : '/src/assets/images/cat_artisanal_1790616270354.jpg'}
              alt={isMan ? 'Formal Kurta Collection' : 'Artisanal Jewellery'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 text-center text-white z-10 px-4">
            <h3 className="font-serif text-2xl font-normal mb-3">
              {isMan ? 'Formal Kurta' : 'Artisanal'}
            </h3>
            <span className="inline-block bg-white text-neutral-950 px-5 py-2 text-xs font-semibold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors">
              Shop now
            </span>
          </div>
        </div>

        {/* Banner 2 */}
        <div
          onClick={() => onBannerClick(isMan ? 'Kurta Trouser' : 'Kurta')}
          className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
            <img
              src={isMan ? '/src/assets/images/men_kurta_trouser_1790620159621.jpg' : '/src/assets/images/pk_girl_readytowear_1790618208513.jpg'}
              alt={isMan ? 'Kurta Trouser' : 'Kurta Collection'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 text-center text-white z-10 px-4">
            <h3 className="font-serif text-2xl font-normal mb-3">
              {isMan ? 'Kurta Trouser' : 'Kurta'}
            </h3>
            <span className="inline-block bg-white text-neutral-950 px-5 py-2 text-xs font-semibold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors">
              Shop now
            </span>
          </div>
        </div>

        {/* Banner 3 */}
        <div
          onClick={() => onBannerClick(isMan ? 'Footwear' : 'Bags')}
          className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
            <img
              src={isMan ? '/src/assets/images/men_peshawari_chappal_1790620226259.jpg' : '/src/assets/images/bag_luxury_only_1790618153318.jpg'}
              alt={isMan ? 'Peshawari Chappal' : 'Luxury Bags'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 text-center text-white z-10 px-4">
            <h3 className="font-serif text-2xl font-normal mb-3">
              {isMan ? 'Footwear' : 'Bags'}
            </h3>
            <span className="inline-block bg-white text-neutral-950 px-5 py-2 text-xs font-semibold uppercase tracking-wider group-hover:bg-neutral-100 transition-colors">
              Shop now
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
