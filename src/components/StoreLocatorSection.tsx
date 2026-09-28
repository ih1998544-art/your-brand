import React from 'react';
import { Department } from '../types';

interface StoreLocatorSectionProps {
  onOpenStoreLocator: () => void;
  department?: Department;
}

export const StoreLocatorSection: React.FC<StoreLocatorSectionProps> = ({
  onOpenStoreLocator,
  department = 'Woman',
}) => {
  return (
    <section className="relative w-full h-[360px] md:h-[400px] overflow-hidden bg-neutral-900 mt-12 md:mt-16 group">
      {/* Background artwork */}
      <div className="absolute inset-0 transform transition-transform duration-700 ease-out group-hover:scale-103">
        <img
          src={
            department === 'Man'
              ? '/src/assets/images/men_store_locator_1790620724764.jpg'
              : '/src/assets/images/women_store_locator_1790620957449.jpg'
          }
          alt={
            department === 'Man'
              ? 'Flagship Men Atelier & Boutique Store'
              : 'Flagship Women Couture Boutique Store'
          }
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40 pointer-events-none" />

      {/* Centered Caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-medium mb-2">
          Flagship Boutiques
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-wider mb-2">
          Store locator
        </h2>
        <p className="text-sm sm:text-base text-neutral-200 mb-6 font-light max-w-md">
          {department === 'Man'
            ? 'Discover our exclusive Men’s Atelier, Boski collections, and bespoke tailoring at our flagship stores.'
            : 'Your favourites, now just a visit away! Explore our boutique network across major cities in Pakistan & worldwide.'}
        </p>
        <button
          onClick={onOpenStoreLocator}
          className="inline-block bg-white text-neutral-950 hover:bg-neutral-100 px-8 py-3 text-xs font-semibold uppercase tracking-widest border border-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
        >
          Find a store
        </button>
      </div>
    </section>
  );
};
