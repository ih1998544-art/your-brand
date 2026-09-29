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

const STORAGE_KEYS = {
  HERO: 'yb_teens_hero_v1',
  HERO_SLIDES: 'yb_teens_hero_slides_v2',
  CATEGORIES: 'yb_teens_categories_v1',
  TRENDING_PRODUCTS: 'yb_teens_trending_products_v1',
  PROMO_SECTION4: 'yb_teens_promo4_v1',
  TRENDING_FITS: 'yb_teens_fits_v1',
  PROMO_SECTION6: 'yb_teens_promo6_v1',
};

class TeensCmsService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.HERO_SLIDES)) {
      localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HERO)) {
      localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(INITIAL_HERO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_TEEN_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRENDING_PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.TRENDING_PRODUCTS, JSON.stringify(INITIAL_TRENDING_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROMO_SECTION4)) {
      localStorage.setItem(STORAGE_KEYS.PROMO_SECTION4, JSON.stringify(INITIAL_SECTION4_BANNERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRENDING_FITS)) {
      localStorage.setItem(STORAGE_KEYS.TRENDING_FITS, JSON.stringify(INITIAL_TRENDING_FITS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROMO_SECTION6)) {
      localStorage.setItem(STORAGE_KEYS.PROMO_SECTION6, JSON.stringify(INITIAL_SECTION6_BANNERS));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Teens CMS notify error:', err);
      }
    });
  }

  // --- SECTION 1: HERO SLIDES & SINGLE HERO ---
  public getHeroSlides(): HeroSlide[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      return data ? JSON.parse(data) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  }

  public saveHeroSlides(slides: HeroSlide[]) {
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(slides));
    this.notify();
  }

  public getHero(): HeroConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HERO);
      return data ? JSON.parse(data) : INITIAL_HERO;
    } catch {
      return INITIAL_HERO;
    }
  }

  public saveHero(hero: Partial<HeroConfig>) {
    const current = this.getHero();
    const updated = { ...current, ...hero };
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(updated));
    this.notify();
  }

  // --- SECTION 2: CATEGORIES ---
  public getCategories(): CategoryCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : INITIAL_TEEN_CATEGORIES;
    } catch {
      return INITIAL_TEEN_CATEGORIES;
    }
  }

  public saveCategory(cat: CategoryCard) {
    const list = this.getCategories();
    const idx = list.findIndex((c) => c.id === cat.id);
    if (idx >= 0) {
      list[idx] = cat;
    } else {
      list.push(cat);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    this.notify();
  }

  public updateCategories(categories: CategoryCard[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notify();
  }

  // --- SECTION 3: TRENDING PRODUCTS ---
  public getTrendingProducts(): TeenProduct[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRENDING_PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_TRENDING_PRODUCTS;
    } catch {
      return INITIAL_TRENDING_PRODUCTS;
    }
  }

  public saveTrendingProduct(prod: TeenProduct) {
    const list = this.getTrendingProducts();
    const idx = list.findIndex((p) => p.id === prod.id);
    if (idx >= 0) {
      list[idx] = prod;
    } else {
      list.unshift(prod);
    }
    localStorage.setItem(STORAGE_KEYS.TRENDING_PRODUCTS, JSON.stringify(list));
    this.notify();
  }

  public deleteTrendingProduct(id: string) {
    const list = this.getTrendingProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRENDING_PRODUCTS, JSON.stringify(list));
    this.notify();
  }

  // --- SECTION 4: PROMOTIONAL BANNERS ---
  public getSection4Banners(): PromoBanner[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMO_SECTION4);
      return data ? JSON.parse(data) : INITIAL_SECTION4_BANNERS;
    } catch {
      return INITIAL_SECTION4_BANNERS;
    }
  }

  public saveSection4Banner(banner: PromoBanner) {
    const list = this.getSection4Banners();
    const idx = list.findIndex((b) => b.id === banner.id);
    if (idx >= 0) {
      list[idx] = banner;
    } else {
      list.push(banner);
    }
    localStorage.setItem(STORAGE_KEYS.PROMO_SECTION4, JSON.stringify(list));
    this.notify();
  }

  // --- SECTION 5: TRENDING FITS ---
  public getTrendingFits(): TeenProduct[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRENDING_FITS);
      return data ? JSON.parse(data) : INITIAL_TRENDING_FITS;
    } catch {
      return INITIAL_TRENDING_FITS;
    }
  }

  public saveTrendingFitProduct(prod: TeenProduct) {
    const list = this.getTrendingFits();
    const idx = list.findIndex((p) => p.id === prod.id);
    if (idx >= 0) {
      list[idx] = prod;
    } else {
      list.unshift(prod);
    }
    localStorage.setItem(STORAGE_KEYS.TRENDING_FITS, JSON.stringify(list));
    this.notify();
  }

  public deleteTrendingFitProduct(id: string) {
    const list = this.getTrendingFits().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRENDING_FITS, JSON.stringify(list));
    this.notify();
  }

  // --- SECTION 6: COLLECTION PROMOTIONAL BANNERS ---
  public getSection6Banners(): PromoBanner[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMO_SECTION6);
      return data ? JSON.parse(data) : INITIAL_SECTION6_BANNERS;
    } catch {
      return INITIAL_SECTION6_BANNERS;
    }
  }

  public saveSection6Banner(banner: PromoBanner) {
    const list = this.getSection6Banners();
    const idx = list.findIndex((b) => b.id === banner.id);
    if (idx >= 0) {
      list[idx] = banner;
    } else {
      list.push(banner);
    }
    localStorage.setItem(STORAGE_KEYS.PROMO_SECTION6, JSON.stringify(list));
    this.notify();
  }

  // Reset CMS
  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.HERO);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRENDING_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PROMO_SECTION4);
    localStorage.removeItem(STORAGE_KEYS.TRENDING_FITS);
    localStorage.removeItem(STORAGE_KEYS.PROMO_SECTION6);
    this.init();
    this.notify();
  }
}

export const teensCms = new TeensCmsService();
