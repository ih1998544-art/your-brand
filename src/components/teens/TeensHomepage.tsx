import React, { useState, useEffect } from 'react';
import { teensCms } from '../../services/teensStore';
import {
  HeroSlide,
  CategoryCard,
  PromoBanner,
  TeenProduct,
} from '../../data/teensData';
import { Currency, Product } from '../../types';
import { TeensHeroSection } from './TeensHeroSection';
import { TeensCategoryGrid } from './TeensCategoryGrid';
import { TeensTrendingSection } from './TeensTrendingSection';
import { TeensPromoBanners } from './TeensPromoBanners';
import { TeensTrendingFits } from './TeensTrendingFits';
import { TeensCollectionBanners } from './TeensCollectionBanners';
import { TeensAdminDrawer } from './TeensAdminDrawer';
import { Sliders } from 'lucide-react';

interface TeensHomepageProps {
  currency: Currency;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onViewProduct?: (product: Product) => void;
  activeCategoryFilter?: string | null;
  onFilterCategory?: (category: string) => void;
  onNotify: (msg: string) => void;
}

export const TeensHomepage: React.FC<TeensHomepageProps> = ({
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onViewProduct,
  activeCategoryFilter,
  onFilterCategory,
  onNotify,
}) => {
  // CMS State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(teensCms.getHeroSlides());
  const [categories, setCategories] = useState<CategoryCard[]>(teensCms.getCategories());
  const [trendingProducts, setTrendingProducts] = useState<TeenProduct[]>(teensCms.getTrendingProducts());
  const [promoBanners4, setPromoBanners4] = useState<PromoBanner[]>(teensCms.getSection4Banners());
  const [trendingFits, setTrendingFits] = useState<TeenProduct[]>(teensCms.getTrendingFits());
  const [collectionBanners6, setCollectionBanners6] = useState<PromoBanner[]>(teensCms.getSection6Banners());

  // Active category selection
  const [selectedCategory, setSelectedCategory] = useState<string>("Summer '26");

  // CMS Admin Drawer
  const [cmsOpen, setCmsOpen] = useState(false);

  useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCategory(activeCategoryFilter);
    }
  }, [activeCategoryFilter]);

  useEffect(() => {
    const unsub = teensCms.subscribe(() => {
      setHeroSlides(teensCms.getHeroSlides());
      setCategories(teensCms.getCategories());
      setTrendingProducts(teensCms.getTrendingProducts());
      setPromoBanners4(teensCms.getSection4Banners());
      setTrendingFits(teensCms.getTrendingFits());
      setCollectionBanners6(teensCms.getSection6Banners());
    });
    return unsub;
  }, []);

  // Adapters for Product type
  const adaptToProduct = (p: TeenProduct): Product => {
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      categoryKey: 'coord',
      colorPalette: '#222222,#ffffff',
      tab: 'new',
      categorySlug: 'new',
      department: 'Teens',
      isNew: p.badge === 'New Arrival' || p.badge === 'Summer 26',
      fabric: p.fabric || 'Pure Cotton',
      details: p.description || '',
      sizes: p.sizes,
      sku: p.sku,
      imageUrl: p.imageUrl,
      images: [p.imageUrl, p.hoverImageUrl || p.imageUrl],
    };
  };

  const handleTeenToggleWishlist = (productId: string, productName: string) => {
    const product =
      trendingProducts.find((p) => p.id === productId) ||
      trendingFits.find((p) => p.id === productId);
    if (product) {
      onToggleWishlist(adaptToProduct(product));
    } else {
      onNotify(`Wishlist updated for ${productName}`);
    }
  };

  const handleTeenQuickAdd = (teenProd: TeenProduct, size: string) => {
    onQuickAdd(adaptToProduct(teenProd), size);
  };

  const handleTeenViewProduct = (teenProd: TeenProduct) => {
    onViewProduct?.(adaptToProduct(teenProd));
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    onNotify(`Showing ${catName} collection (15 articles)`);
    onFilterCategory?.(catName);
    // Smooth scroll directly to the trending products section
    const elem = document.getElementById('trending');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* 
        MAIN HOMEPAGE CONTENT — EXACTLY 6 SECTIONS
        1. Hero Carousel (5 Luxury Slides)
        2. Shop by Category (Interactive Cards)
        3. Trending (8 Categories with 15 products each, size selectors, slider/grid)
        4. Promotional Banners (Teen Boys, Teen Girls, Kid Boys)
        5. Trending Fits (Infant/Kids Focus, Sizes, Slider)
        6. Collection Promotional Banners (Kid Boys, Kid Girls, Infant)
      */}

      {/* SECTION 1 — HERO BANNER WITH 5 LUXURY SLIDES */}
      <TeensHeroSection
        slides={heroSlides}
        onSelectCategory={handleSelectCategory}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* SECTION 2 — SHOP BY CATEGORY */}
      <TeensCategoryGrid
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* SECTION 3 — TRENDING PRODUCTS (15 Items Per Category, Size Features, Click-to-view) */}
      <TeensTrendingSection
        activeCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        currency={currency}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleTeenToggleWishlist}
        onQuickAdd={handleTeenQuickAdd}
        onViewProduct={handleTeenViewProduct}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* SECTION 4 — PROMOTIONAL BANNERS (Teen Boys, Teen Girls, Kid Boys) */}
      <TeensPromoBanners
        banners={promoBanners4}
        onBannerClick={(link, cat) => handleSelectCategory(cat)}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* SECTION 5 — TRENDING FITS */}
      <TeensTrendingFits
        products={trendingFits}
        currency={currency}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleTeenToggleWishlist}
        onQuickAdd={handleTeenQuickAdd}
        onViewProduct={handleTeenViewProduct}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* SECTION 6 — COLLECTION PROMOTIONAL BANNERS (Kid Boys, Kid Girls, Infant) */}
      <TeensCollectionBanners
        banners={collectionBanners6}
        onBannerClick={(link, cat) => handleSelectCategory(cat)}
        onOpenCms={() => setCmsOpen(true)}
      />

      {/* FLOATING CMS LIVE EDITOR BUTTON */}
      <button
        onClick={() => setCmsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-neutral-950 text-white hover:bg-neutral-800 p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 transition-all hover:scale-105 cursor-pointer"
        title="Open Homepage CMS Editor"
      >
        <Sliders className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          Teens CMS Editor
        </span>
      </button>

      {/* ADMIN CMS DRAWER */}
      <TeensAdminDrawer
        isOpen={cmsOpen}
        onClose={() => setCmsOpen(false)}
        onNotify={onNotify}
      />
    </div>
  );
};
