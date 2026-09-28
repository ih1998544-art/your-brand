import React from 'react';
import { VectorFashionArt } from './VectorFashionArt';
import { CategoryKey, Department } from '../types';

interface CategoryGridProps {
  onSelectCategory: (name: string) => void;
  department?: Department;
}

interface CategoryItem {
  id: string;
  name: string;
  artKey: CategoryKey;
  colors: string;
  imageUrl?: string;
}

const WOMEN_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Pre-Winter Couture',
    artKey: 'gown',
    colors: '#3a2f4a,#7d5a86,#e9c9f0',
    imageUrl: '/src/assets/images/women_velvet_peshwas_couture_1790621946851.jpg',
  },
  {
    id: 'cat-2',
    name: 'Ready to wear',
    artKey: 'kurta',
    colors: '#2f5d50,#8fb9a0,#f2efe4',
    imageUrl: '/src/assets/images/pk_girl_readytowear_1790618208513.jpg',
  },
  {
    id: 'cat-3',
    name: 'Unstitched',
    artKey: 'dupatta',
    colors: '#7a2e3b,#d98a8a,#ffe4d6',
    imageUrl: '/src/assets/images/pk_girl_unstitched_1790618224088.jpg',
  },
  {
    id: 'cat-4',
    name: 'Formals',
    artKey: 'gown',
    colors: '#1d2b4a,#4d6fae,#dfe8ff',
    imageUrl: '/src/assets/images/pk_girl_formals_1790618240981.jpg',
  },
  {
    id: 'cat-5',
    name: 'Footwear',
    artKey: 'bag',
    colors: '#831843,#d4af37,#fdf2f8',
    imageUrl: '/src/assets/images/women_khussa_footwear_1790621932657.jpg',
  },
  {
    id: 'cat-6',
    name: 'Accessories',
    artKey: 'bag',
    colors: '#5b4636,#c8a27a,#fff3e2',
    imageUrl: '/src/assets/images/bag_luxury_only_1790618153318.jpg',
  },
];

const MEN_CATEGORIES: CategoryItem[] = [
  {
    id: 'men-cat-1',
    name: 'KAMEEZ SHALWAR',
    artKey: 'kurta',
    colors: '#1b1b1f,#09090b,#e4e4e7',
    imageUrl: '/src/assets/images/men_kameez_shalwar_1790620146599.jpg',
  },
  {
    id: 'men-cat-2',
    name: 'KURTA TROUSER',
    artKey: 'kurta',
    colors: '#f8fafc,#cbd5e1,#ffffff',
    imageUrl: '/src/assets/images/men_grey_kurta_trouser_1790621986404.jpg',
  },
  {
    id: 'men-cat-3',
    name: 'WAISTCOAT',
    artKey: 'coord',
    colors: '#1e3a8a,#172554,#dbeafe',
    imageUrl: '/src/assets/images/men_emerald_waistcoat_1790621972279.jpg',
  },
  {
    id: 'men-cat-4',
    name: 'UNSTITCHED (BOSKI)',
    artKey: 'dupatta',
    colors: '#ca8a04,#854d0e,#fef9c3',
    imageUrl: '/src/assets/images/men_unstitched_boski_1790620213843.jpg',
  },
  {
    id: 'men-cat-5',
    name: 'FORMAL KURTA',
    artKey: 'gown',
    colors: '#9a3412,#c2410c,#ffedd5',
    imageUrl: '/src/assets/images/men_ceremonial_sherwani_1790621243663.jpg',
  },
  {
    id: 'men-cat-6',
    name: 'FOOTWEAR',
    artKey: 'bag',
    colors: '#78350f,#451a03,#fef3c7',
    imageUrl: '/src/assets/images/men_kaptaan_footwear_1790621961000.jpg',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, department = 'Woman' }) => {
  const categories = department === 'Man' ? MEN_CATEGORIES : WOMEN_CATEGORIES;

  return (
    <section className="py-12 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-baseline mb-6 md:mb-8">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-900 tracking-wide uppercase font-normal">
          Shop by category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-100 flex flex-col justify-end text-left focus:outline-hidden focus:ring-2 focus:ring-neutral-900 shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Image or SVG Artwork */}
            <div className="absolute inset-0 transform transition-transform duration-500 ease-out group-hover:scale-105">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <VectorFashionArt artKey={cat.artKey} colorPalette={cat.colors} />
              )}
            </div>

            {/* Gradient Scrim & Label */}
            <div className="relative z-10 w-full pt-10 pb-4 px-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-center">
              <span className="block text-white text-xs sm:text-[13px] font-medium uppercase tracking-wider group-hover:text-amber-200 transition-colors">
                {cat.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
