import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { STORES } from '../data/products';
import { Department } from '../types';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  department?: Department;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  department = 'Woman',
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  if (!isOpen) return null;

  const cities = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Dubai', 'London'];

  const filteredStores =
    selectedCity === 'All'
      ? STORES
      : STORES.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              Store Locator &amp; Boutiques
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flagship Store Visual Banner */}
        <div className="relative h-28 sm:h-36 overflow-hidden bg-neutral-950 shrink-0">
          <img
            src={
              department === 'Man'
                ? '/src/assets/images/men_store_locator_1790620724764.jpg'
                : '/src/assets/images/women_store_locator_1790620957449.jpg'
            }
            alt={department === 'Man' ? 'Men Flagship Boutique Store' : 'Women Flagship Boutique Store'}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-4">
            <p className="text-white text-xs sm:text-sm font-medium tracking-wide">
              {department === 'Man'
                ? 'Bespoke Tailoring & Luxury Men’s Atelier Flagships Across Pakistan'
                : 'Luxury Haute Couture & Ready-to-Wear Flagships Across Pakistan & Worldwide'}
            </p>
          </div>
        </div>

        {/* City Filter Tabs */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex gap-2 overflow-x-auto scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedCity === city
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Store Listings */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-neutral-200 space-y-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="pt-4 first:pt-0">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 inline-block mb-1">
                    {store.type}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">
                    {store.name}
                  </h3>
                </div>
                <button
                  onClick={() => onNotify(`Opening directions to ${store.name}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-medium uppercase tracking-wider self-start transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-600 mt-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <a href={`tel:${store.phone}`} className="hover:underline text-neutral-800">
                    {store.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
