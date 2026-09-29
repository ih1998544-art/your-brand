import {
  HeroConfig,
  HeroSlide,
  CategoryCard,
  PromoBanner,
  TeenProduct,
  INITIAL_HERO,
  INITIAL_HERO_SLIDES,
  INITIAL_TEEN_CATEGORIES,
  INITIAL_SECTION4_BANNERS,
  INITIAL_TRENDING_PRODUCTS,
  INITIAL_TRENDING_FITS,
  INITIAL_SECTION6_BANNERS,
} from '../data/teensData';

class TeensStoreService {
  private listeners: (() => void)[] = [];

  constructor() {
    // Clear any obsolete cached keys that contained legacy adult photoshoot links
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('yb_teens_hero_v1');
        localStorage.removeItem('yb_teens_hero_slides_v2');
        localStorage.removeItem('yb_teens_categories_v1');
        localStorage.removeItem('yb_teens_trending_products_v1');
        localStorage.removeItem('yb_teens_promo4_v1');
        localStorage.removeItem('yb_teens_fits_v1');
        localStorage.removeItem('yb_teens_promo6_v1');
      } catch {
        // ignore storage errors
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getHeroSlides(): HeroSlide[] {
    return INITIAL_HERO_SLIDES;
  }

  public getHero(): HeroConfig {
    return INITIAL_HERO;
  }

  public getCategories(): CategoryCard[] {
    return INITIAL_TEEN_CATEGORIES;
  }

  public getTrendingProducts(): TeenProduct[] {
    return INITIAL_TRENDING_PRODUCTS;
  }

  public getSection4Banners(): PromoBanner[] {
    return INITIAL_SECTION4_BANNERS;
  }

  public getTrendingFits(): TeenProduct[] {
    return INITIAL_TRENDING_FITS;
  }

  public getSection6Banners(): PromoBanner[] {
    return INITIAL_SECTION6_BANNERS;
  }
}

export const teensCms = new TeensStoreService();
