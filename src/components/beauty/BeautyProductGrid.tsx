import React from 'react';
import { Product, Currency } from '../../types';
import { BeautyProductCard } from './BeautyProductCard';

interface BeautyProductGridProps {
  products: Product[];
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
  activeCategory: string;
  gridCols: 4 | 3 | 2;
}

export const BeautyProductGrid: React.FC<BeautyProductGridProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onQuickView,
  activeCategory,
  gridCols,
}) => {
  // If specific category selected, render filtered grid
  if (activeCategory.toLowerCase() !== 'all') {
    return (
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
            Collection
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal uppercase tracking-tight">
            {activeCategory}
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-sm font-light">
            No products match the selected criteria.
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 ${
              gridCols === 4
                ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'sm:grid-cols-2 md:grid-cols-3'
            } gap-4 sm:gap-6`}
          >
            {products.map((prod) => (
              <BeautyProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.has(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Group into curated sections for "All" view
  const fragranceProds = products.filter((p) => p.beautyCategory === 'Fragrances');
  const makeupProds = products.filter((p) => p.beautyCategory === 'Makeup');
  const skincareProds = products.filter((p) => p.beautyCategory === 'Skin Care');
  const bodyHomeProds = products.filter((p) => p.beautyCategory === 'Body & Home');

  const gridClass =
    gridCols === 4
      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6';

  return (
    <div className="py-8 space-y-20 max-w-7xl mx-auto px-4 sm:px-8">
      {/* SECTION 1: SIGNATURE FRAGRANCES */}
      {fragranceProds.length > 0 && (
        <section id="signature-fragrances" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
                Haute Parfumerie
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal uppercase tracking-tight">
                SIGNATURE FRAGRANCES
              </h2>
              <p className="text-xs text-neutral-600 font-light mt-1">
                Discover iconic and contemporary fragrances for every mood and occasion.
              </p>
            </div>
          </div>

          <div className={gridClass}>
            {fragranceProds.map((prod) => (
              <BeautyProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.has(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: BEAUTY ESSENTIALS (MAKEUP) */}
      {makeupProds.length > 0 && (
        <section id="beauty-essentials" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
                Cosmetics Collection
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal uppercase tracking-tight">
                BEAUTY ESSENTIALS
              </h2>
              <p className="text-xs text-neutral-600 font-light mt-1">
                Velvety long-wear lipsticks, radiant serum foundations, and micro-milled mineral blushes.
              </p>
            </div>
          </div>

          <div className={gridClass}>
            {makeupProds.map((prod) => (
              <BeautyProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.has(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: SKIN CARE RITUAL */}
      {skincareProds.length > 0 && (
        <section id="skincare-ritual" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
                Botanical Skincare
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal uppercase tracking-tight">
                SKIN CARE RITUAL
              </h2>
              <p className="text-xs text-neutral-600 font-light mt-1">
                Cellular restorative botanical elixirs, steam-distilled rose mists, and barrier repair creams.
              </p>
            </div>
          </div>

          <div className={gridClass}>
            {skincareProds.map((prod) => (
              <BeautyProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.has(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: BODY & HOME */}
      {bodyHomeProds.length > 0 && (
        <section id="body-and-home" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-neutral-500 block mb-1">
                Sanctuary & Ambiance
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-950 font-normal uppercase tracking-tight">
                BODY & HOME
              </h2>
              <p className="text-xs text-neutral-600 font-light mt-1">
                Artisanal royal bakhoor, crackling soy candles, and continuous luxury reed diffusers.
              </p>
            </div>
          </div>

          <div className={gridClass}>
            {bodyHomeProds.map((prod) => (
              <BeautyProductCard
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.has(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
