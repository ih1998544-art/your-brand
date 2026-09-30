import { Product, Department, Currency } from '../types';
import { PRODUCTS } from '../data/products';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Credit Card' | 'Bank Transfer' | 'EasyPaisa';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  shippingStatus: 'Processing' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  courier: string;
  trackingNumber: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'Blocked';
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  department: Department;
  slug: string;
  imageUrl: string;
  productCount: number;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Catalog Manager' | 'Order Fulfillment' | 'Customer Support';
  permissions: string[];
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface FrontendContentConfig {
  logoText: string;
  promoBarText: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  heroImageUrl: string;
  announcementActive: boolean;
  supportPhone: string;
  supportEmail: string;
  storeAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
}

class AdminStoreService {
  private products: Product[] = [];
  private orders: AdminOrder[] = [];
  private customers: AdminCustomer[] = [];
  private coupons: AdminCoupon[] = [];
  private categories: AdminCategory[] = [];
  private reviews: AdminReview[] = [];
  private adminUsers: AdminUser[] = [];
  private frontendContent: FrontendContentConfig = {
    logoText: 'IH',
    promoBarText: 'Complimentary luxury gift packaging on all orders',
    heroHeading: 'LUXURY COUTURE & SIGNATURE FRAGRANCES',
    heroSubheading: 'Explore the newly unveiled festive and pret collections.',
    heroCtaText: 'Shop New Arrivals',
    heroImageUrl: '/src/assets/images/hero_formals_1790615905526.jpg',
    announcementActive: true,
    supportPhone: '+92 21 111 112 114',
    supportEmail: 'care@yourbrand.com',
    storeAddress: 'Dolmen Mall Clifton, Karachi, Pakistan',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    youtubeUrl: 'https://youtube.com',
  };

  constructor() {
    this.initData();
  }

  private initData() {
    // 1. Initialize products: copy from PRODUCTS and apply any saved overrides
    this.products = [...PRODUCTS];

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedProducts = localStorage.getItem('yb_admin_products_v3');
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.products = parsed;
            // Also sync in-place to global PRODUCTS array for the frontend
            PRODUCTS.length = 0;
            PRODUCTS.push(...this.products);
          }
        } else {
          // Remove legacy v2 storage that might hold duplicate keys
          localStorage.removeItem('yb_admin_products_v2');
          // Initialize mock stock on products
          this.products = this.products.map((p, i) => ({
            ...p,
            stock: p.stock ?? (i === 3 ? 2 : i === 7 ? 0 : 15 + ((i * 7) % 35)),
            active: p.active ?? true,
            featured: p.featured ?? (i % 4 === 0),
          }));
        }

        const savedOrders = localStorage.getItem('yb_admin_orders_v1');
        if (savedOrders) {
          this.orders = JSON.parse(savedOrders);
        } else {
          this.orders = this.getDefaultOrders();
        }

        const savedCustomers = localStorage.getItem('yb_admin_customers_v1');
        if (savedCustomers) {
          this.customers = JSON.parse(savedCustomers);
        } else {
          this.customers = this.getDefaultCustomers();
        }

        const savedCoupons = localStorage.getItem('yb_admin_coupons_v1');
        if (savedCoupons) {
          this.coupons = JSON.parse(savedCoupons);
        } else {
          this.coupons = this.getDefaultCoupons();
        }

        const savedCategories = localStorage.getItem('yb_admin_categories_v1');
        if (savedCategories) {
          this.categories = JSON.parse(savedCategories);
        } else {
          this.categories = this.getDefaultCategories();
        }

        const savedReviews = localStorage.getItem('yb_admin_reviews_v1');
        if (savedReviews) {
          this.reviews = JSON.parse(savedReviews);
        } else {
          this.reviews = this.getDefaultReviews();
        }

        const savedAdmins = localStorage.getItem('yb_admin_users_v1');
        if (savedAdmins) {
          this.adminUsers = JSON.parse(savedAdmins);
        } else {
          this.adminUsers = this.getDefaultAdminUsers();
        }

        const savedFrontend = localStorage.getItem('yb_admin_frontend_config_v1');
        if (savedFrontend) {
          this.frontendContent = { ...this.frontendContent, ...JSON.parse(savedFrontend) };
        }
      } catch (e) {
        console.warn('Error loading admin data from localStorage', e);
      }
    } else {
      this.orders = this.getDefaultOrders();
      this.customers = this.getDefaultCustomers();
      this.coupons = this.getDefaultCoupons();
      this.categories = this.getDefaultCategories();
      this.reviews = this.getDefaultReviews();
      this.adminUsers = this.getDefaultAdminUsers();
    }
  }

  private persistProducts() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('yb_admin_products_v3', JSON.stringify(this.products));
      } catch (e) {
        console.warn('Failed to save products to localStorage', e);
      }
    }
    // Synchronize global PRODUCTS array in place so customer frontend updates automatically
    PRODUCTS.length = 0;
    PRODUCTS.push(...this.products);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('store_updated'));
    }
  }

  private persist(key: string, data: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn(`Failed to save ${key}`, e);
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('store_updated'));
    }
  }

  // ==========================================
  // 1. PRODUCTS MANAGEMENT
  // ==========================================
  public getProducts(): Product[] {
    return this.products;
  }

  public addProduct(product: Partial<Product>): Product {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: product.name || 'Untitled Article',
      price: product.price || 4990,
      originalPrice: product.originalPrice,
      categoryKey: product.categoryKey || 'coord',
      colorPalette: product.colorPalette || '#1a1a1a,#ffffff',
      tab: product.tab || 'rtw',
      categorySlug: product.categorySlug || product.tab || 'rtw',
      department: product.department || 'Woman',
      isNew: product.isNew ?? true,
      fabric: product.fabric || 'Pure Cotton Silk',
      details: product.details || 'Artisanal collection design with delicate hand-finished detailing.',
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'],
      sku: product.sku || `YB-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: product.imageUrl || '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg',
      images: product.images && product.images.length > 0 ? product.images : [product.imageUrl || '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg'],
      stock: product.stock ?? 25,
      active: product.active ?? true,
      featured: product.featured ?? false,
    };

    this.products.unshift(newProduct);
    this.persistProducts();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      images: updates.imageUrl
        ? [updates.imageUrl, ...(this.products[idx].images || []).filter((img) => img !== updates.imageUrl)]
        : this.products[idx].images,
    };
    this.persistProducts();
    return this.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length !== prevLen) {
      this.persistProducts();
      return true;
    }
    return false;
  }

  public adjustStock(id: string, delta: number): number {
    const p = this.products.find((prod) => prod.id === id);
    if (!p) return 0;
    const current = p.stock ?? 10;
    const nextStock = Math.max(0, current + delta);
    p.stock = nextStock;
    this.persistProducts();
    return nextStock;
  }

  public setStock(id: string, newStock: number): void {
    const p = this.products.find((prod) => prod.id === id);
    if (!p) return;
    p.stock = Math.max(0, newStock);
    this.persistProducts();
  }

  public toggleProductActive(id: string): boolean {
    const p = this.products.find((prod) => prod.id === id);
    if (!p) return false;
    p.active = p.active === false ? true : false;
    this.persistProducts();
    return p.active;
  }

  public duplicateProduct(id: string): Product | null {
    const orig = this.products.find((p) => p.id === id);
    if (!orig) return null;
    const duplicated: Product = {
      ...orig,
      id: `prod-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      sku: `${orig.sku}-CP`,
      stock: orig.stock ?? 15,
      isNew: true,
    };
    this.products.unshift(duplicated);
    this.persistProducts();
    return duplicated;
  }

  public bulkUpdatePrices(ids: string[], percentageDelta: number): void {
    if (!ids || ids.length === 0) return;
    const factor = 1 + percentageDelta / 100;
    this.products = this.products.map((p) => {
      if (ids.includes(p.id)) {
        const newPrice = Math.max(100, Math.round((p.price * factor) / 10) * 10);
        return {
          ...p,
          originalPrice: p.originalPrice ? Math.max(newPrice, Math.round((p.originalPrice * factor) / 10) * 10) : p.price,
          price: newPrice,
        };
      }
      return p;
    });
    this.persistProducts();
  }

  public bulkToggleActive(ids: string[], active: boolean): void {
    if (!ids || ids.length === 0) return;
    this.products = this.products.map((p) => {
      if (ids.includes(p.id)) {
        return { ...p, active };
      }
      return p;
    });
    this.persistProducts();
  }

  public bulkSetFeatured(ids: string[], featured: boolean): void {
    if (!ids || ids.length === 0) return;
    this.products = this.products.map((p) => {
      if (ids.includes(p.id)) {
        return { ...p, featured };
      }
      return p;
    });
    this.persistProducts();
  }

  public bulkDelete(ids: string[]): void {
    if (!ids || ids.length === 0) return;
    this.products = this.products.filter((p) => !ids.includes(p.id));
    this.persistProducts();
  }

  // ==========================================
  // 2. ORDERS MANAGEMENT
  // ==========================================
  public getOrders(): AdminOrder[] {
    return this.orders;
  }

  public updateOrderStatus(orderId: string, status: AdminOrder['shippingStatus']): void {
    const ord = this.orders.find((o) => o.id === orderId);
    if (ord) {
      ord.shippingStatus = status;
      this.persist('yb_admin_orders_v1', this.orders);
    }
  }

  public updateOrderPaymentStatus(orderId: string, status: AdminOrder['paymentStatus']): void {
    const ord = this.orders.find((o) => o.id === orderId);
    if (ord) {
      ord.paymentStatus = status;
      this.persist('yb_admin_orders_v1', this.orders);
    }
  }

  // ==========================================
  // 3. CUSTOMERS
  // ==========================================
  public getCustomers(): AdminCustomer[] {
    return this.customers;
  }

  public toggleCustomerStatus(id: string): void {
    const c = this.customers.find((cust) => cust.id === id);
    if (c) {
      c.status = c.status === 'Active' ? 'Blocked' : 'Active';
      this.persist('yb_admin_customers_v1', this.customers);
    }
  }

  // ==========================================
  // 4. COUPONS
  // ==========================================
  public getCoupons(): AdminCoupon[] {
    return this.coupons;
  }

  public addCoupon(coupon: Omit<AdminCoupon, 'id' | 'timesUsed'>): AdminCoupon {
    const newCoupon: AdminCoupon = {
      ...coupon,
      id: `cpn-${Date.now()}`,
      timesUsed: 0,
    };
    this.coupons.unshift(newCoupon);
    this.persist('yb_admin_coupons_v1', this.coupons);
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<AdminCoupon>): void {
    const idx = this.coupons.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.coupons[idx] = { ...this.coupons[idx], ...updates };
      this.persist('yb_admin_coupons_v1', this.coupons);
    }
  }

  public deleteCoupon(id: string): void {
    this.coupons = this.coupons.filter((c) => c.id !== id);
    this.persist('yb_admin_coupons_v1', this.coupons);
  }

  // ==========================================
  // 5. CATEGORIES
  // ==========================================
  public getCategories(): AdminCategory[] {
    return this.categories;
  }

  public addCategory(cat: Omit<AdminCategory, 'id' | 'productCount'>): AdminCategory {
    const newCat: AdminCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    this.categories.unshift(newCat);
    this.persist('yb_admin_categories_v1', this.categories);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<AdminCategory>): void {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      this.persist('yb_admin_categories_v1', this.categories);
    }
  }

  public deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.persist('yb_admin_categories_v1', this.categories);
  }

  // ==========================================
  // 6. REVIEWS
  // ==========================================
  public getReviews(): AdminReview[] {
    return this.reviews;
  }

  public updateReviewStatus(id: string, status: AdminReview['status']): void {
    const rev = this.reviews.find((r) => r.id === id);
    if (rev) {
      rev.status = status;
      this.persist('yb_admin_reviews_v1', this.reviews);
    }
  }

  public deleteReview(id: string): void {
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.persist('yb_admin_reviews_v1', this.reviews);
  }

  // ==========================================
  // 7. FRONTEND CONTENT CONFIG
  // ==========================================
  public getFrontendContent(): FrontendContentConfig {
    return this.frontendContent;
  }

  public updateFrontendContent(updates: Partial<FrontendContentConfig>): void {
    this.frontendContent = { ...this.frontendContent, ...updates };
    this.persist('yb_admin_frontend_config_v1', this.frontendContent);
  }

  // ==========================================
  // 8. ADMIN USERS
  // ==========================================
  public getAdminUsers(): AdminUser[] {
    return this.adminUsers;
  }

  public addAdminUser(user: Omit<AdminUser, 'id' | 'lastLogin'>): AdminUser {
    const newAdmin: AdminUser = {
      ...user,
      id: `adm-${Date.now()}`,
      lastLogin: 'Just now',
    };
    this.adminUsers.push(newAdmin);
    this.persist('yb_admin_users_v1', this.adminUsers);
    return newAdmin;
  }

  public updateAdminUser(id: string, updates: Partial<AdminUser>): void {
    const idx = this.adminUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.adminUsers[idx] = { ...this.adminUsers[idx], ...updates };
      this.persist('yb_admin_users_v1', this.adminUsers);
    }
  }

  public deleteAdminUser(id: string): void {
    this.adminUsers = this.adminUsers.filter((u) => u.id !== id);
    this.persist('yb_admin_users_v1', this.adminUsers);
  }

  // ==========================================
  // MOCK DEFAULTS
  // ==========================================
  private getDefaultOrders(): AdminOrder[] {
    return [
      {
        id: 'ord-1001',
        orderNumber: 'YB-94821',
        date: '2026-09-29 11:34 AM',
        customerName: 'Ayesha Siddiqui',
        customerEmail: 'ayesha.siddiqui@gmail.com',
        customerPhone: '+92 300 2345678',
        shippingAddress: 'House 42, Street 8, Phase 6, DHA',
        city: 'Karachi',
        totalAmount: 18450,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        shippingStatus: 'Processing',
        courier: 'TCS Express',
        trackingNumber: 'TCS-90241829',
        items: [
          {
            productId: 'new-1',
            productName: 'Plum Magenta Embroidered Kurta Set',
            size: 'M',
            color: 'Plum',
            quantity: 1,
            price: 8490,
            imageUrl: '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg',
          },
          {
            productId: 'new-2',
            productName: 'Turquoise Teal Lawn Palazzo Suit',
            size: 'L',
            color: 'Teal',
            quantity: 1,
            price: 9960,
            imageUrl: '/src/assets/images/mannequin_turquoise_palazzo_1790645182047.jpg',
          },
        ],
      },
      {
        id: 'ord-1002',
        orderNumber: 'YB-94820',
        date: '2026-09-29 09:15 AM',
        customerName: 'Bilal Khan Niazi',
        customerEmail: 'bilal.niazi@live.com',
        customerPhone: '+92 321 8899123',
        shippingAddress: 'Apartment 4B, Gulberg Heights, Gulberg III',
        city: 'Lahore',
        totalAmount: 12950,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        shippingStatus: 'Confirmed',
        courier: 'Leopard Courier',
        trackingNumber: 'LPD-5829104',
        items: [
          {
            productId: 'men-ks-1',
            productName: 'Charcoal Linen Kameez Shalwar',
            size: 'L',
            color: 'Charcoal',
            quantity: 1,
            price: 12950,
            imageUrl: '/src/assets/images/men_charcoal_kameez_shalwar_1790647739906.jpg',
          },
        ],
      },
      {
        id: 'ord-1003',
        orderNumber: 'YB-94819',
        date: '2026-09-28 04:45 PM',
        customerName: 'Zainab Fatima',
        customerEmail: 'zainab.f@yahoo.com',
        customerPhone: '+92 333 4567890',
        shippingAddress: 'Villa 12, Street 3, Sector F-7/2',
        city: 'Islamabad',
        totalAmount: 22800,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        shippingStatus: 'Shipped',
        courier: 'TCS Express',
        trackingNumber: 'TCS-90241770',
        items: [
          {
            productId: 'frag-1',
            productName: 'Amber Royale Extrait De Parfum',
            size: '100ml',
            color: 'Amber',
            quantity: 2,
            price: 11400,
            imageUrl: '/src/assets/images/prod_amber_oud_1790706213426.jpg',
          },
        ],
      },
      {
        id: 'ord-1004',
        orderNumber: 'YB-94818',
        date: '2026-09-28 01:20 PM',
        customerName: 'Hamza Tariq',
        customerEmail: 'hamza.tariq@outlook.com',
        customerPhone: '+92 345 6789012',
        shippingAddress: 'Plot 88, University Town',
        city: 'Peshawar',
        totalAmount: 6490,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        courier: 'Call Courier',
        trackingNumber: 'CC-3392019',
        items: [
          {
            productId: 'new-3',
            productName: 'Dusty Sage Jaal Printed Lawn Kurta',
            size: 'XL',
            color: 'Sage',
            quantity: 1,
            price: 6490,
            imageUrl: '/src/assets/images/mannequin_sage_lawn_1790645319560.jpg',
          },
        ],
      },
      {
        id: 'ord-1005',
        orderNumber: 'YB-94817',
        date: '2026-09-27 10:11 AM',
        customerName: 'Sara Mehreen',
        customerEmail: 'sara.mehreen@gmail.com',
        customerPhone: '+92 312 9988776',
        shippingAddress: 'House 19, Cavalry Ground',
        city: 'Lahore',
        totalAmount: 14500,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'Refunded',
        shippingStatus: 'Returned',
        courier: 'TCS Express',
        trackingNumber: 'TCS-90241612',
        items: [
          {
            productId: 'new-4',
            productName: 'Blush Pink Embroidered Anarkali',
            size: 'S',
            color: 'Blush',
            quantity: 1,
            price: 14500,
            imageUrl: '/src/assets/images/mannequin_blush_anarkali_1790645341734.jpg',
          },
        ],
      },
    ];
  }

  private getDefaultCustomers(): AdminCustomer[] {
    return [
      {
        id: 'cust-1',
        name: 'Ayesha Siddiqui',
        email: 'ayesha.siddiqui@gmail.com',
        phone: '+92 300 2345678',
        city: 'Karachi',
        address: 'House 42, Street 8, Phase 6, DHA',
        totalOrders: 6,
        totalSpent: 86400,
        joinedDate: '2025-11-12',
        status: 'Active',
      },
      {
        id: 'cust-2',
        name: 'Bilal Khan Niazi',
        email: 'bilal.niazi@live.com',
        phone: '+92 321 8899123',
        city: 'Lahore',
        address: 'Apartment 4B, Gulberg Heights, Gulberg III',
        totalOrders: 4,
        totalSpent: 52300,
        joinedDate: '2026-01-08',
        status: 'Active',
      },
      {
        id: 'cust-3',
        name: 'Zainab Fatima',
        email: 'zainab.f@yahoo.com',
        phone: '+92 333 4567890',
        city: 'Islamabad',
        address: 'Villa 12, Street 3, Sector F-7/2',
        totalOrders: 9,
        totalSpent: 142000,
        joinedDate: '2025-08-20',
        status: 'Active',
      },
      {
        id: 'cust-4',
        name: 'Hamza Tariq',
        email: 'hamza.tariq@outlook.com',
        phone: '+92 345 6789012',
        city: 'Peshawar',
        address: 'Plot 88, University Town',
        totalOrders: 2,
        totalSpent: 12980,
        joinedDate: '2026-03-15',
        status: 'Active',
      },
      {
        id: 'cust-5',
        name: 'Sara Mehreen',
        email: 'sara.mehreen@gmail.com',
        phone: '+92 312 9988776',
        city: 'Lahore',
        address: 'House 19, Cavalry Ground',
        totalOrders: 3,
        totalSpent: 29500,
        joinedDate: '2026-02-01',
        status: 'Active',
      },
    ];
  }

  private getDefaultCoupons(): AdminCoupon[] {
    return [
      {
        id: 'cpn-1',
        code: 'LUXE25',
        type: 'percentage',
        value: 25,
        minPurchase: 5000,
        expiryDate: '2026-12-31',
        usageLimit: 500,
        timesUsed: 142,
        isActive: true,
      },
      {
        id: 'cpn-2',
        code: 'FIRST1000',
        type: 'fixed',
        value: 1000,
        minPurchase: 8000,
        expiryDate: '2026-10-31',
        usageLimit: 200,
        timesUsed: 89,
        isActive: true,
      },
      {
        id: 'cpn-3',
        code: 'FREESHIP',
        type: 'fixed',
        value: 250,
        minPurchase: 3000,
        expiryDate: '2026-11-15',
        usageLimit: 1000,
        timesUsed: 431,
        isActive: true,
      },
      {
        id: 'cpn-4',
        code: 'VIP50',
        type: 'percentage',
        value: 50,
        minPurchase: 15000,
        expiryDate: '2026-09-30',
        usageLimit: 50,
        timesUsed: 48,
        isActive: false,
      },
    ];
  }

  private getDefaultCategories(): AdminCategory[] {
    return [
      { id: 'cat-w-rtw', name: 'Ready to Wear', department: 'Woman', slug: 'rtw', imageUrl: '/src/assets/images/cat_readytowear_1790616255122.jpg', productCount: 28, isActive: true },
      { id: 'cat-w-uns', name: 'Unstitched', department: 'Woman', slug: 'uns', imageUrl: '/src/assets/images/cat_unstitched_1790616238017.jpg', productCount: 22, isActive: true },
      { id: 'cat-w-frm', name: 'Formals', department: 'Woman', slug: 'frm', imageUrl: '/src/assets/images/cat_formals_1790616220486.jpg', productCount: 16, isActive: true },
      { id: 'cat-m-ks', name: 'Kameez Shalwar', department: 'Man', slug: 'men_ks', imageUrl: '/src/assets/images/men_kameez_shalwar_1790620146599.jpg', productCount: 18, isActive: true },
      { id: 'cat-m-kt', name: 'Kurta Trouser', department: 'Man', slug: 'men_kt', imageUrl: '/src/assets/images/men_kurta_trouser_1790620159621.jpg', productCount: 14, isActive: true },
      { id: 'cat-t-girls', name: 'Teen Girls', department: 'Teens', slug: 'teens_girls', imageUrl: '/src/assets/images/cat_teen_girls_1790700298033.jpg', productCount: 15, isActive: true },
      { id: 'cat-t-boys', name: 'Teen Boys', department: 'Teens', slug: 'teens_boys', imageUrl: '/src/assets/images/cat_teen_boys_1790700316738.jpg', productCount: 15, isActive: true },
      { id: 'cat-f-perfume', name: 'Fragrances', department: 'Fragrance & Beauty', slug: 'fragrance', imageUrl: '/src/assets/images/cat_fragrance_luxe_1790706160651.jpg', productCount: 24, isActive: true },
      { id: 'cat-f-makeup', name: 'Makeup & Beauty', department: 'Fragrance & Beauty', slug: 'makeup', imageUrl: '/src/assets/images/cat_makeup_luxe_1790706173292.jpg', productCount: 20, isActive: true },
    ];
  }

  private getDefaultReviews(): AdminReview[] {
    return [
      { id: 'rev-1', productName: 'Plum Magenta Embroidered Kurta Set', customerName: 'Farah Naz', rating: 5, comment: 'Exceptional craftsmanship. The pure cotton slub fabric feels luxurious and breathable.', date: '2026-09-28', status: 'Approved' },
      { id: 'rev-2', productName: 'Amber Royale Extrait De Parfum', customerName: 'Omer Farooq', rating: 5, comment: 'A captivating sillage with warm oud and taif rose. Lasts 14+ hours easily.', date: '2026-09-27', status: 'Approved' },
      { id: 'rev-3', productName: 'Charcoal Linen Kameez Shalwar', customerName: 'Zubair Shah', rating: 4, comment: 'Clean cut and stiff collar. Very comfortable for Friday ceremonies.', date: '2026-09-26', status: 'Approved' },
      { id: 'rev-4', productName: 'Turquoise Teal Lawn Palazzo Suit', customerName: 'Mahnur Ali', rating: 3, comment: 'Embroidery was nice but palazzo length was 1 inch longer than expected.', date: '2026-09-25', status: 'Pending' },
      { id: 'rev-5', productName: 'Velvet Evening Shawl Suit', customerName: 'Anonymous', rating: 1, comment: 'Duplicate order by mistake.', date: '2026-09-24', status: 'Hidden' },
    ];
  }

  private getDefaultAdminUsers(): AdminUser[] {
    return [
      { id: 'adm-1', name: 'Super Administrator', email: 'admin@yourbrand.com', role: 'Super Admin', permissions: ['All Access'], status: 'Active', lastLogin: 'Active Now' },
      { id: 'adm-2', name: 'Kashif Mehmood', email: 'kashif.m@yourbrand.com', role: 'Catalog Manager', permissions: ['Products', 'Inventory', 'Categories'], status: 'Active', lastLogin: '2 hours ago' },
      { id: 'adm-3', name: 'Saima Rauf', email: 'saima.r@yourbrand.com', role: 'Order Fulfillment', permissions: ['Orders', 'Shipping', 'Customers'], status: 'Active', lastLogin: 'Yesterday' },
      { id: 'adm-4', name: 'Tariq Jamil', email: 'tariq.j@yourbrand.com', role: 'Customer Support', permissions: ['Orders', 'Reviews'], status: 'Active', lastLogin: '3 days ago' },
    ];
  }
}

export const adminStore = new AdminStoreService();
