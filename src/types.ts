export type CategoryKey = 'coord' | 'dupatta' | 'kurta' | 'dress' | 'gown' | 'bag' | 'jewel' | 'hero';

export type ProductTab = 'rtw' | 'uns' | 'frm';

export type Department = 'Woman' | 'Man' | 'Teens' | 'Fragrance & Beauty' | 'Anniversary B1G1';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  categoryKey: CategoryKey;
  colorPalette: string;
  tab: ProductTab;
  department: Department;
  isNew?: boolean;
  fabric: string;
  details: string;
  sizes: string[];
  sku: string;
  imageUrl?: string;
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
