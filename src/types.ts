export type CategoryKey =
  | 'coord'
  | 'dupatta'
  | 'kurta'
  | 'dress'
  | 'gown'
  | 'bag'
  | 'jewel'
  | 'hero'
  | 'footwear'
  | 'accessories'
  | 'fragrance'
  | 'beauty'
  | 'skincare';

export type ProductTab =
  | 'new'
  | 'rtw'
  | 'uns'
  | 'frm'
  | 'footwear'
  | 'accessories'
  | 'trending'
  | 'sale'
  | 'men_new'
  | 'men_ks'
  | 'men_kt'
  | 'men_wc'
  | 'men_uns'
  | 'men_fk'
  | 'men_fw'
  | 'men_sale'
  | 'fragrance_all'
  | 'fragrance_perfume'
  | 'beauty_makeup'
  | 'beauty_skincare'
  | 'beauty_bodyhome';

export type Department = 'Woman' | 'Man' | 'Teens' | 'Fragrance & Beauty' | 'Anniversary B1G1';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  categoryKey: CategoryKey;
  colorPalette: string;
  tab: ProductTab;
  categorySlug?: ProductTab;
  department: Department;
  isNew?: boolean;
  fabric: string;
  details: string;
  sizes: string[];
  sku: string;
  imageUrl?: string;
  images?: string[];
  // Fragrance & Beauty specific rich metadata
  beautyCategory?: 'Fragrances' | 'Makeup' | 'Skin Care' | 'Body & Home';
  subCategory?: string;
  fragranceNotes?: {
    top?: string;
    heart?: string;
    base?: string;
  };
  ingredients?: string;
  howToUse?: string;
  volume?: string;
  shade?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // multiplier relative to PKR
}

export interface StoreLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  type: string;
}
