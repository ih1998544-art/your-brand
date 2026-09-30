import React, { useState, useMemo } from 'react';
import {
  X,
  Menu,
  Shield,
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  Palette,
  CreditCard,
  Truck,
  BarChart3,
  UserCheck,
  Settings,
  Search,
  Plus,
  Edit2,
  Edit3,
  Sliders,
  Trash2,
  Eye,
  Check,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Filter,
  Upload,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Minus,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Lock,
  Percent,
  CheckSquare,
  Square,
  ArrowUpDown,
} from 'lucide-react';
import { Department, Currency, Product, CategoryKey, ProductTab } from '../types';
import { ProductCustomizerModal } from './admin/ProductCustomizerModal';
import {
  adminStore,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminCategory,
  AdminReview,
  AdminUser,
  FrontendContentConfig,
} from '../services/adminStore';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
  currency: Currency;
  onNotify: (msg: string) => void;
}

type AdminSection =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'reviews'
  | 'customize'
  | 'payments'
  | 'shipping'
  | 'reports'
  | 'admins'
  | 'settings';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentDepartment,
  onSelectDepartment,
  currency,
  onNotify,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states from adminStore
  const [products, setProducts] = useState<Product[]>(() => adminStore.getProducts());
  const [orders, setOrders] = useState<AdminOrder[]>(() => adminStore.getOrders());
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => adminStore.getCustomers());
  const [coupons, setCoupons] = useState<AdminCoupon[]>(() => adminStore.getCoupons());
  const [categories, setCategories] = useState<AdminCategory[]>(() => adminStore.getCategories());
  const [reviews, setReviews] = useState<AdminReview[]>(() => adminStore.getReviews());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => adminStore.getAdminUsers());
  const [frontendContent, setFrontendContent] = useState<FrontendContentConfig>(() =>
    adminStore.getFrontendContent()
  );

  // Modals & form dialog states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // In-line Quick Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<{
    name: string;
    price: number;
    originalPrice?: number;
    stock: number;
  }>({ name: '', price: 0, stock: 10 });

  // Bulk Product Actions State
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [bulkPricePct, setBulkPricePct] = useState<number>(10);

  const [orderDetailModal, setOrderDetailModal] = useState<AdminOrder | null>(null);
  const [customerDetailModal, setCustomerDetailModal] = useState<AdminCustomer | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<AdminCategory>>({});

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<AdminCoupon>>({});

  const [adminUserModalOpen, setAdminUserModalOpen] = useState(false);
  const [adminUserForm, setAdminUserForm] = useState<Partial<AdminUser>>({});

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'category' | 'coupon' | 'review' | 'admin';
    id: string;
    title: string;
  } | null>(null);

  // Filters & searches
  const [productSearch, setProductSearch] = useState('');
  const [productDeptFilter, setProductDeptFilter] = useState<string>('All');
  const [productStockFilter, setProductStockFilter] = useState<'All' | 'Low' | 'Out'>('All');
  const [productSortBy, setProductSortBy] = useState<
    'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'stock-asc'
  >('default');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  const [customerSearch, setCustomerSearch] = useState('');

  // Toast inside admin
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    onNotify(msg);
    setTimeout(() => {
      setAdminToast((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const refreshAll = () => {
    setProducts([...adminStore.getProducts()]);
    setOrders([...adminStore.getOrders()]);
    setCustomers([...adminStore.getCustomers()]);
    setCoupons([...adminStore.getCoupons()]);
    setCategories([...adminStore.getCategories()]);
    setReviews([...adminStore.getReviews()]);
    setAdminUsers([...adminStore.getAdminUsers()]);
    setFrontendContent({ ...adminStore.getFrontendContent() });
  };

  // KPI Calculations
  const totalSalesRevenue = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.shippingStatus === 'Processing' || o.shippingStatus === 'Confirmed')
      .length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stock ?? 10) > 0 && (p.stock ?? 10) <= 5).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => (p.stock ?? 10) === 0).length;
  }, [products]);

  // ==========================================
  // HANDLERS FOR PRODUCTS & CUSTOMIZATION
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleSaveProductCustomizer = (productData: Partial<Product>) => {
    if (editingProduct) {
      adminStore.updateProduct(editingProduct.id, productData);
      triggerToast(`Customized article: ${productData.name || editingProduct.name}`);
    } else {
      const created = adminStore.addProduct(productData);
      triggerToast(`Created new article: ${created.name}`);
    }
    setProductModalOpen(false);
    refreshAll();
  };

  const handleDuplicateProduct = (id: string) => {
    const duplicated = adminStore.duplicateProduct(id);
    if (duplicated) {
      refreshAll();
      triggerToast(`Duplicated: ${duplicated.name}`);
    }
  };

  // In-line Quick Edit Handlers
  const handleStartInlineEdit = (p: Product) => {
    setInlineEditingId(p.id);
    setInlineForm({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock ?? 10,
    });
  };

  const handleSaveInlineEdit = (id: string) => {
    if (!inlineForm.name?.trim()) {
      triggerToast('Article title cannot be empty');
      return;
    }
    adminStore.updateProduct(id, {
      name: inlineForm.name.trim(),
      price: Number(inlineForm.price),
      originalPrice: inlineForm.originalPrice ? Number(inlineForm.originalPrice) : undefined,
      stock: Number(inlineForm.stock),
    });
    setInlineEditingId(null);
    refreshAll();
    triggerToast(`Quick saved: ${inlineForm.name} (₨ ${inlineForm.price.toLocaleString()})`);
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingId(null);
  };

  // Bulk Product Handlers
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllProducts = (filteredIds: string[]) => {
    if (selectedProductIds.size === filteredIds.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredIds));
    }
  };

  const handleApplyBulkPrices = (percentageDelta: number) => {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;
    adminStore.bulkUpdatePrices(ids, percentageDelta);
    setSelectedProductIds(new Set());
    setBulkPriceModalOpen(false);
    refreshAll();
    triggerToast(
      `Adjusted prices by ${percentageDelta > 0 ? `+${percentageDelta}` : percentageDelta}% for ${ids.length} articles`
    );
  };

  const handleBulkToggleActive = (active: boolean) => {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;
    adminStore.bulkToggleActive(ids, active);
    setSelectedProductIds(new Set());
    refreshAll();
    triggerToast(`Updated storefront visibility for ${ids.length} articles`);
  };

  const handleBulkSetFeatured = (featured: boolean) => {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;
    adminStore.bulkSetFeatured(ids, featured);
    setSelectedProductIds(new Set());
    refreshAll();
    triggerToast(`Marked ${ids.length} articles as ${featured ? 'Featured' : 'Standard'}`);
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;
    adminStore.bulkDelete(ids);
    setSelectedProductIds(new Set());
    refreshAll();
    triggerToast(`Deleted ${ids.length} articles`);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;

    if (type === 'product') {
      adminStore.deleteProduct(id);
      triggerToast(`Product deleted: ${title}`);
    } else if (type === 'category') {
      adminStore.deleteCategory(id);
      triggerToast(`Category deleted: ${title}`);
    } else if (type === 'coupon') {
      adminStore.deleteCoupon(id);
      triggerToast(`Coupon removed: ${title}`);
    } else if (type === 'review') {
      adminStore.deleteReview(id);
      triggerToast(`Review deleted`);
    } else if (type === 'admin') {
      adminStore.deleteAdminUser(id);
      triggerToast(`Admin user removed`);
    }

    setDeleteConfirm(null);
    refreshAll();
  };

  const handleQuickStock = (id: string, delta: number) => {
    const nextStock = adminStore.adjustStock(id, delta);
    refreshAll();
    triggerToast(`Stock updated to ${nextStock}`);
  };

  const handleToggleProductStatus = (id: string) => {
    const active = adminStore.toggleProductActive(id);
    refreshAll();
    triggerToast(`Product is now ${active ? 'Active' : 'Inactive'}`);
  };

  // ==========================================
  // HANDLERS FOR CATEGORIES
  // ==========================================
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    if (categoryForm.id) {
      adminStore.updateCategory(categoryForm.id, categoryForm);
      triggerToast(`Category updated: ${categoryForm.name}`);
    } else {
      adminStore.addCategory({
        name: categoryForm.name,
        department: categoryForm.department || 'Woman',
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: categoryForm.imageUrl || '/src/assets/images/cat_readytowear_1790616255122.jpg',
        isActive: categoryForm.isActive ?? true,
      });
      triggerToast(`Added category: ${categoryForm.name}`);
    }
    setCategoryModalOpen(false);
    refreshAll();
  };

  // ==========================================
  // HANDLERS FOR COUPONS
  // ==========================================
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.value) return;

    if (couponForm.id) {
      adminStore.updateCoupon(couponForm.id, couponForm);
      triggerToast(`Coupon updated: ${couponForm.code}`);
    } else {
      adminStore.addCoupon({
        code: couponForm.code.toUpperCase(),
        type: couponForm.type || 'percentage',
        value: Number(couponForm.value),
        minPurchase: Number(couponForm.minPurchase || 3000),
        expiryDate: couponForm.expiryDate || '2026-12-31',
        usageLimit: Number(couponForm.usageLimit || 100),
        isActive: couponForm.isActive ?? true,
      });
      triggerToast(`Coupon created: ${couponForm.code.toUpperCase()}`);
    }
    setCouponModalOpen(false);
    refreshAll();
  };

  // ==========================================
  // HANDLERS FOR FRONTEND CONTENT
  // ==========================================
  const handleSaveFrontendConfig = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateFrontendContent(frontendContent);
    triggerToast('Frontend content changes applied & saved!');
  };

  // Filtered product list
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchDept =
        productDeptFilter === 'All' || p.department.toLowerCase() === productDeptFilter.toLowerCase();
      let matchStock = true;
      if (productStockFilter === 'Low') {
        matchStock = (p.stock ?? 10) > 0 && (p.stock ?? 10) <= 5;
      } else if (productStockFilter === 'Out') {
        matchStock = (p.stock ?? 10) === 0;
      }
      return matchSearch && matchDept && matchStock;
    });

    if (productSortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (productSortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (productSortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (productSortBy === 'stock-asc') list.sort((a, b) => (a.stock ?? 10) - (b.stock ?? 10));

    return list;
  }, [products, productSearch, productDeptFilter, productStockFilter, productSortBy]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus =
        orderStatusFilter === 'All' || o.shippingStatus.toLowerCase() === orderStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs font-sans text-neutral-900 animate-fadeIn">
      {/* Container: Fullscreen High-Performance Workspace */}
      <div className="relative w-full h-full sm:h-[96vh] sm:w-[98vw] max-w-7xl bg-neutral-900 text-neutral-100 sm:rounded-xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden">
        {/* ======================================================== */}
        {/* TOP BAR                                                  */}
        {/* ======================================================== */}
        <header className="h-14 px-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white p-1 flex items-center justify-center shadow-xs">
                <img
                  src="/src/assets/images/brand_logo.jpg"
                  alt="IH"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold tracking-wider text-base uppercase text-white">
                IH <span className="text-amber-400 font-sans text-xs font-normal">ADMIN</span>
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Store Engine
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={refreshAll}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
              title="Refresh Store Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer border border-neutral-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Back to Storefront</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Exit Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* WORKSPACE: SIDEBAR + MAIN CONTENT AREA                   */}
        {/* ======================================================== */}
        <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <aside
            className={`${
              sidebarOpen ? 'w-60' : 'w-16'
            } bg-neutral-950 border-r border-neutral-800 transition-all duration-200 flex flex-col shrink-0 overflow-y-auto scrollbar-none select-none`}
          >
            <div className="p-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'products', label: 'Products', icon: Package, badge: products.length },
                { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-red-500/20 text-red-400' },
                { id: 'categories', label: 'Categories', icon: Layers, badge: categories.length },
                { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length },
                { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
                { id: 'coupons', label: 'Discounts & Promo', icon: Ticket },
                { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: reviews.filter((r) => r.status === 'Pending').length || undefined },
                { id: 'customize', label: 'Customize Frontend', icon: Palette },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
                { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
                { id: 'admins', label: 'Admin Users', icon: UserCheck },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-300 font-semibold border-l-2 border-amber-400'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          item.badgeColor || 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {sidebarOpen && (
              <div className="mt-auto p-4 border-t border-neutral-800 text-xs text-neutral-500">
                <div className="flex items-center gap-2 mb-1 text-neutral-300 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>Admin Session</span>
                </div>
                <div className="text-[11px] truncate">admin@yourbrand.com</div>
                <div className="text-[10px] text-neutral-500 mt-1">Super Administrator</div>
              </div>
            )}
          </aside>

          {/* MAIN CONTENT CANVAS */}
          <main className="flex-1 bg-neutral-900/60 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Admin Internal Toast Notification */}
            {adminToast && (
              <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-neutral-700 flex items-center gap-2 text-xs animate-slideUp">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{adminToast}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* 1. DASHBOARD OVERVIEW                                    */}
            {/* ======================================================== */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Commerce Overview</h1>
                  <p className="text-xs text-neutral-400">Real-time performance metrics, orders, inventory and revenue telemetry.</p>
                </div>

                {/* 6 Top Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Total Products</span>
                    <div className="text-2xl font-bold text-white font-serif mt-1">{products.length}</div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> Live catalog
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Total Orders</span>
                    <div className="text-2xl font-bold text-white font-serif mt-1">{orders.length}</div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +12% this week
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Total Customers</span>
                    <div className="text-2xl font-bold text-white font-serif mt-1">{customers.length}</div>
                    <span className="text-[10px] text-neutral-400 mt-1">Registered</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Total Sales</span>
                    <div className="text-xl font-bold text-white font-serif mt-1">
                      ₨ {(totalSalesRevenue).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1">Collected</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Pending Orders</span>
                    <div className="text-2xl font-bold text-amber-400 font-serif mt-1">{pendingOrdersCount}</div>
                    <span className="text-[10px] text-amber-400 mt-1">Awaiting dispatch</span>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400">Low Stock</span>
                    <div className="text-2xl font-bold text-red-400 font-serif mt-1">{lowStockCount}</div>
                    <span className="text-[10px] text-red-400 mt-1">&le; 5 units remaining</span>
                  </div>
                </div>

                {/* Sales Overview Chart (SVG) & Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Chart */}
                  <div className="lg:col-span-2 p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Sales & Revenue Trend</h3>
                        <p className="text-xs text-neutral-400">Gross transaction values over the past 7 days</p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                        ₨ 284,500 7d Total
                      </span>
                    </div>

                    <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 border-b border-neutral-800 pb-2">
                      {[
                        { day: 'Wed', val: 32000, height: '45%' },
                        { day: 'Thu', val: 41000, height: '58%' },
                        { day: 'Fri', val: 68000, height: '92%' },
                        { day: 'Sat', val: 54000, height: '74%' },
                        { day: 'Sun', val: 61000, height: '82%' },
                        { day: 'Mon', val: 39000, height: '52%' },
                        { day: 'Today', val: 49500, height: '68%', active: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            ₨{(item.val / 1000).toFixed(0)}k
                          </span>
                          <div
                            style={{ height: item.height }}
                            className={`w-full max-w-[42px] rounded-t transition-all ${
                              item.active
                                ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                                : 'bg-neutral-800 hover:bg-neutral-700'
                            }`}
                          ></div>
                          <span className="text-[11px] font-medium text-neutral-400">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock & Operational Alerts */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Inventory Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-400">Healthy Stock (&gt;10 units)</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {products.filter((p) => (p.stock ?? 10) > 10).length} items
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-400">Critical Stock (&le;5 units)</span>
                        <span className="font-bold text-amber-400 font-mono">{lowStockCount} items</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-400">Out of Stock (0 units)</span>
                        <span className="font-bold text-red-400 font-mono">{outOfStockCount} items</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection('inventory')}
                      className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded text-white transition-colors cursor-pointer"
                    >
                      Manage Inventory &rarr;
                    </button>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      View all {orders.length} orders &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Order #</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">City</th>
                          <th className="py-2.5 px-3">Items</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Payment</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-neutral-900/60">
                            <td className="py-3 px-3 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                            <td className="py-3 px-3 font-medium text-white">{ord.customerName}</td>
                            <td className="py-3 px-3 text-neutral-400">{ord.city}</td>
                            <td className="py-3 px-3">{ord.items.length} items</td>
                            <td className="py-3 px-3 font-semibold text-white">
                              ₨ {ord.totalAmount.toLocaleString()}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  ord.paymentStatus === 'Paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : ord.paymentStatus === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-neutral-800 text-neutral-300">
                                {ord.shippingStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setOrderDetailModal(ord)}
                                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. PRODUCTS MANAGEMENT                                   */}
            {/* ======================================================== */}
            {activeSection === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Products Management & Customizer</h1>
                    <p className="text-xs text-neutral-400">
                      Customize titles, regular & promotional prices, inventory, size allocations and photoshoot media. Updates apply instantly across the storefront.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/20 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Add New Product</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Actions Floating / Top Bar (appears when items are selected) */}
                {selectedProductIds.size > 0 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-slideDown">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <CheckSquare className="w-4 h-4" />
                      <span>{selectedProductIds.size} article(s) selected</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkPriceModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>Adjust Prices %</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBulkToggleActive(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-semibold text-[11px] cursor-pointer"
                      >
                        Activate All
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBulkToggleActive(false)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-[11px] cursor-pointer"
                      >
                        Deactivate All
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBulkSetFeatured(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold text-[11px] cursor-pointer"
                      >
                        Mark Featured
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkDelete}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 font-semibold text-[11px] cursor-pointer"
                      >
                        Delete Selected
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProductIds(new Set())}
                        className="px-2.5 py-1.5 text-neutral-400 hover:text-white text-[11px] underline cursor-pointer"
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                )}

                {/* Search, Filter & Sort Toolbar */}
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search article name, SKU or fabric..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-neutral-400">Department:</span>
                    <select
                      value={productDeptFilter}
                      onChange={(e) => setProductDeptFilter(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Departments</option>
                      <option value="Woman">Woman</option>
                      <option value="Man">Man</option>
                      <option value="Teens">Teens</option>
                      <option value="Fragrance & Beauty">Fragrance & Beauty</option>
                    </select>

                    <span className="text-neutral-400 ml-1">Stock:</span>
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Levels</option>
                      <option value="Low">Low Stock (&le;5)</option>
                      <option value="Out">Out of Stock (0)</option>
                    </select>

                    <span className="text-neutral-400 ml-1">Sort:</span>
                    <select
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="default">Default Curated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="stock-asc">Stock: Low to High</option>
                    </select>
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3 w-8">
                            <input
                              type="checkbox"
                              checked={
                                filteredProducts.length > 0 &&
                                selectedProductIds.size === filteredProducts.length
                              }
                              onChange={() =>
                                handleSelectAllProducts(filteredProducts.map((p) => p.id))
                              }
                              className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                              title="Select all filtered articles"
                            />
                          </th>
                          <th className="py-3 px-3">Item / Name</th>
                          <th className="py-3 px-3">SKU</th>
                          <th className="py-3 px-3">Dept</th>
                          <th className="py-3 px-3">Price (PKR)</th>
                          <th className="py-3 px-3">Stock</th>
                          <th className="py-3 px-3">Badges</th>
                          <th className="py-3 px-3">Active</th>
                          <th className="py-3 px-3 text-right">Customize & Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {filteredProducts.map((p) => {
                          const stock = p.stock ?? 10;
                          const discountPercent =
                            p.originalPrice && p.originalPrice > p.price
                              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                              : 0;
                          const isSelected = selectedProductIds.has(p.id);
                          const isInlineEditing = inlineEditingId === p.id;

                          return (
                            <tr
                              key={p.id}
                              className={`transition-colors ${
                                isSelected
                                  ? 'bg-amber-500/5'
                                  : isInlineEditing
                                  ? 'bg-neutral-900'
                                  : 'hover:bg-neutral-900/60'
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-3 px-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectProduct(p.id)}
                                  className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                                />
                              </td>

                              {/* Item & Name */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-10 h-12 object-cover rounded bg-neutral-800 border border-neutral-700 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    {isInlineEditing ? (
                                      <input
                                        type="text"
                                        value={inlineForm.name}
                                        onChange={(e) =>
                                          setInlineForm({ ...inlineForm, name: e.target.value })
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveInlineEdit(p.id);
                                          if (e.key === 'Escape') handleCancelInlineEdit();
                                        }}
                                        className="w-full bg-neutral-950 border border-amber-400 rounded px-2 py-1 text-white text-xs font-semibold focus:outline-none"
                                        autoFocus
                                      />
                                    ) : (
                                      <div
                                        onClick={() => handleStartInlineEdit(p)}
                                        className="font-semibold text-white truncate max-w-[200px] sm:max-w-[240px] hover:text-amber-300 cursor-pointer"
                                        title="Click to quick-edit name"
                                      >
                                        {p.name}
                                      </div>
                                    )}
                                    <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                                      {p.fabric || 'Luxury Pret'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* SKU */}
                              <td className="py-3 px-3 font-mono text-[11px] text-neutral-400">{p.sku}</td>

                              {/* Department */}
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-neutral-800 rounded text-[11px] text-neutral-300 font-medium whitespace-nowrap">
                                  {p.department}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-3 px-3">
                                {isInlineEditing ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] text-neutral-500 font-mono">₨</span>
                                      <input
                                        type="number"
                                        value={inlineForm.price}
                                        onChange={(e) =>
                                          setInlineForm({
                                            ...inlineForm,
                                            price: Number(e.target.value),
                                          })
                                        }
                                        className="w-24 bg-neutral-950 border border-amber-400 rounded px-1.5 py-0.5 text-white font-mono text-xs font-bold focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] text-neutral-500">Was:</span>
                                      <input
                                        type="number"
                                        value={inlineForm.originalPrice || ''}
                                        onChange={(e) =>
                                          setInlineForm({
                                            ...inlineForm,
                                            originalPrice: e.target.value
                                              ? Number(e.target.value)
                                              : undefined,
                                          })
                                        }
                                        placeholder="Original"
                                        className="w-20 bg-neutral-950 border border-neutral-700 rounded px-1.5 py-0.5 text-neutral-300 font-mono text-[10px] focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => handleStartInlineEdit(p)}
                                    className="cursor-pointer group"
                                    title="Click to quick-edit price"
                                  >
                                    <div className="font-semibold text-white group-hover:text-amber-300 flex items-center gap-1">
                                      <span>₨ {p.price.toLocaleString()}</span>
                                      <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity" />
                                    </div>
                                    {p.originalPrice && p.originalPrice > p.price && (
                                      <div className="text-[10px] text-neutral-500 line-through">
                                        ₨ {p.originalPrice.toLocaleString()} (-{discountPercent}%)
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Stock */}
                              <td className="py-3 px-3">
                                {isInlineEditing ? (
                                  <input
                                    type="number"
                                    min={0}
                                    value={inlineForm.stock}
                                    onChange={(e) =>
                                      setInlineForm({ ...inlineForm, stock: Number(e.target.value) })
                                    }
                                    className="w-16 bg-neutral-950 border border-neutral-700 rounded px-1.5 py-1 text-white font-mono text-xs focus:outline-none"
                                  />
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                      stock === 0
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : stock <= 5
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-emerald-500/10 text-emerald-400'
                                    }`}
                                  >
                                    {stock} in stock
                                  </span>
                                )}
                              </td>

                              {/* Badges */}
                              <td className="py-3 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {p.featured && (
                                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase">
                                      Featured
                                    </span>
                                  )}
                                  {p.isNew && (
                                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase">
                                      New
                                    </span>
                                  )}
                                  {discountPercent > 0 && (
                                    <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold uppercase">
                                      Sale
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Active Toggle */}
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => handleToggleProductStatus(p.id)}
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                                    p.active !== false
                                      ? 'bg-emerald-500 justify-end'
                                      : 'bg-neutral-700 justify-start'
                                  }`}
                                  title="Toggle Storefront Visibility"
                                >
                                  <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                                </button>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3 px-3 text-right">
                                {isInlineEditing ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleSaveInlineEdit(p.id)}
                                      className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded cursor-pointer transition-colors shadow-xs"
                                      title="Save Quick Edit"
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                    <button
                                      onClick={handleCancelInlineEdit}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded cursor-pointer transition-colors"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleStartInlineEdit(p)}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 rounded cursor-pointer transition-colors"
                                      title="Quick In-line Edit Price & Name"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenEditProduct(p)}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded cursor-pointer transition-colors"
                                      title="Full Product Customizer (Media, Sizes, Details)"
                                    >
                                      <Sliders className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDuplicateProduct(p.id)}
                                      className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded cursor-pointer transition-colors"
                                      title="Duplicate Article"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: 'product',
                                          id: p.id,
                                          title: p.name,
                                        })
                                      }
                                      className="p-1.5 bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded cursor-pointer transition-colors"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 3. INVENTORY MANAGEMENT                                  */}
            {/* ======================================================== */}
            {activeSection === 'inventory' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Inventory & Stock Tracking</h1>
                  <p className="text-xs text-neutral-400">
                    Real-time stock controls, size-wise allocations, low-stock warnings, and rapid restock adjustments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400">Total Units in Stock</span>
                      <div className="text-2xl font-bold font-serif text-white mt-1">
                        {products.reduce((acc, p) => acc + (p.stock ?? 10), 0)}
                      </div>
                    </div>
                    <Boxes className="w-8 h-8 text-neutral-700" />
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-400">Low Stock Alert (&le;5 units)</span>
                      <div className="text-2xl font-bold font-serif text-amber-400 mt-1">{lowStockCount} items</div>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-500/40" />
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-red-400">Out of Stock (0 units)</span>
                      <div className="text-2xl font-bold font-serif text-red-400 mt-1">{outOfStockCount} items</div>
                    </div>
                    <X className="w-8 h-8 text-red-500/40" />
                  </div>
                </div>

                {/* Stock Controls Table */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Stock Adjustment Table</h3>
                    <span className="text-xs text-neutral-400">Click + / - to adjust quantity directly</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3">Article</th>
                          <th className="py-3 px-3">SKU</th>
                          <th className="py-3 px-3">Sizes Available</th>
                          <th className="py-3 px-3">Current Stock</th>
                          <th className="py-3 px-3 text-right">Quick Stock Adjust</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {products.map((p) => {
                          const stock = p.stock ?? 10;
                          return (
                            <tr key={p.id} className="hover:bg-neutral-900/60">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-9 h-11 object-cover rounded bg-neutral-800 shrink-0"
                                  />
                                  <span className="font-semibold text-white">{p.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-neutral-400">{p.sku}</td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1 flex-wrap">
                                  {(p.sizes || ['S', 'M', 'L']).map((s) => (
                                    <span key={s} className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono">
                                <span
                                  className={`px-2.5 py-1 rounded font-bold ${
                                    stock === 0
                                      ? 'bg-red-500/20 text-red-400'
                                      : stock <= 5
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : 'bg-emerald-500/20 text-emerald-400'
                                  }`}
                                >
                                  {stock} units
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="inline-flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                                  <button
                                    onClick={() => handleQuickStock(p.id, -5)}
                                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-mono text-[10px] cursor-pointer"
                                    title="Deduct 5"
                                  >
                                    -5
                                  </button>
                                  <button
                                    onClick={() => handleQuickStock(p.id, -1)}
                                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-mono text-[10px] cursor-pointer"
                                    title="Deduct 1"
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() => handleQuickStock(p.id, +1)}
                                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded font-mono text-[10px] cursor-pointer"
                                    title="Add 1"
                                  >
                                    +1
                                  </button>
                                  <button
                                    onClick={() => handleQuickStock(p.id, +5)}
                                    className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-mono text-[10px] cursor-pointer"
                                    title="Add 5"
                                  >
                                    +5
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 4. CATEGORIES                                            */}
            {/* ======================================================== */}
            {activeSection === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Categories Management</h1>
                    <p className="text-xs text-neutral-400">Configure storefront categories, department links, images and visibility.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCategoryForm({ name: '', department: 'Woman', slug: '', isActive: true });
                      setCategoryModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-14 h-16 object-cover rounded bg-neutral-800 border border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                          <span className="text-[11px] text-neutral-500">{cat.department}</span>
                          <div className="text-[10px] text-amber-400 font-mono mt-1">/{cat.slug}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setCategoryForm({ ...cat });
                            setCategoryModalOpen(true);
                          }}
                          className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'category',
                              id: cat.id,
                              title: cat.name,
                            })
                          }
                          className="p-1.5 bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. ORDERS MANAGEMENT                                     */}
            {/* ======================================================== */}
            {activeSection === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Orders & Fulfillment</h1>
                  <p className="text-xs text-neutral-400">
                    Track shipments, customer delivery addresses, change lifecycle statuses (Processing, Shipped, Delivered).
                  </p>
                </div>

                {/* Orders Filter Toolbar */}
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search by Order #, Customer, or Tracking #..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3">Order Number</th>
                          <th className="py-3 px-3">Customer</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Amount</th>
                          <th className="py-3 px-3">Payment</th>
                          <th className="py-3 px-3">Courier / Tracking</th>
                          <th className="py-3 px-3">Shipping Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-neutral-900/60 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-amber-400">{ord.orderNumber}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-white">{ord.customerName}</div>
                              <div className="text-[10px] text-neutral-500">{ord.city}</div>
                            </td>
                            <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">{ord.date}</td>
                            <td className="py-3 px-3 font-bold text-white">₨ {ord.totalAmount.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  ord.paymentStatus === 'Paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : ord.paymentStatus === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {ord.paymentMethod} ({ord.paymentStatus})
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-white font-medium">{ord.courier}</div>
                              <div className="font-mono text-[10px] text-neutral-500">{ord.trackingNumber}</div>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={ord.shippingStatus}
                                onChange={(e) => {
                                  adminStore.updateOrderStatus(ord.id, e.target.value as any);
                                  refreshAll();
                                  triggerToast(`Order status updated to: ${e.target.value}`);
                                }}
                                className="bg-neutral-900 border border-neutral-700 text-white text-[11px] font-semibold rounded px-2 py-1 focus:outline-none cursor-pointer"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setOrderDetailModal(ord)}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. CUSTOMERS                                             */}
            {/* ======================================================== */}
            {activeSection === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Customers Directory</h1>
                  <p className="text-xs text-neutral-400">View customer lifetime value, order history, addresses and status.</p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 max-w-sm w-full">
                    <Search className="w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search customer name or email..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <span className="text-xs text-neutral-400">{customers.length} total registered accounts</span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">City & Address</th>
                        <th className="py-3 px-3">Orders</th>
                        <th className="py-3 px-3">Total Spent</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {customers
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            c.email.toLowerCase().includes(customerSearch.toLowerCase())
                        )
                        .map((cust) => (
                          <tr key={cust.id} className="hover:bg-neutral-900/60">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{cust.name}</div>
                              <div className="text-[11px] text-neutral-500">Member since {cust.joinedDate}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div>{cust.email}</div>
                              <div className="font-mono text-neutral-500 text-[11px]">{cust.phone}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-white">{cust.city}</div>
                              <div className="text-[10px] text-neutral-500 truncate max-w-[200px]">{cust.address}</div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-amber-400">{cust.totalOrders}</td>
                            <td className="py-3 px-3 font-bold text-white">₨ {cust.totalSpent.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  cust.status === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {cust.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setCustomerDetailModal(cust)}
                                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold cursor-pointer"
                              >
                                Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 7. DISCOUNTS & COUPONS                                   */}
            {/* ======================================================== */}
            {activeSection === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Discounts & Coupons</h1>
                    <p className="text-xs text-neutral-400">
                      Create percentage or flat discount promo vouchers, set expiry limits and monitor redemptions.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCouponForm({
                        code: '',
                        type: 'percentage',
                        value: 20,
                        minPurchase: 4000,
                        expiryDate: '2026-12-31',
                        usageLimit: 250,
                        isActive: true,
                      });
                      setCouponModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coupons.map((cpn) => (
                    <div
                      key={cpn.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-lg text-amber-400 tracking-wider">
                          {cpn.code}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            cpn.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {cpn.isActive ? 'Active' : 'Expired'}
                        </span>
                      </div>

                      <div className="text-2xl font-bold font-serif text-white">
                        {cpn.type === 'percentage' ? `${cpn.value}% OFF` : `₨ ${cpn.value} OFF`}
                      </div>

                      <div className="text-xs text-neutral-400 space-y-1">
                        <div>Min. spend: ₨ {cpn.minPurchase.toLocaleString()}</div>
                        <div>Expires: {cpn.expiryDate}</div>
                        <div className="font-mono text-[11px] text-neutral-500">
                          Used: {cpn.timesUsed} / {cpn.usageLimit}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cpn.code);
                            triggerToast(`Copied code: ${cpn.code}`);
                          }}
                          className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'coupon',
                              id: cpn.id,
                              title: cpn.code,
                            })
                          }
                          className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 8. REVIEWS MODERATION                                    */}
            {/* ======================================================== */}
            {activeSection === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Customer Reviews & Ratings</h1>
                  <p className="text-xs text-neutral-400">Moderate product testimonials, approve genuine buyer feedback, hide or remove spam.</p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-white text-xs">{rev.productName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                              rev.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : rev.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 italic">"{rev.comment}"</p>
                        <div className="text-[11px] text-neutral-500">
                          By <strong className="text-neutral-400">{rev.customerName}</strong> on {rev.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rev.status !== 'Approved' && (
                          <button
                            onClick={() => {
                              adminStore.updateReviewStatus(rev.id, 'Approved');
                              refreshAll();
                              triggerToast('Review approved');
                            }}
                            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded text-xs font-semibold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== 'Hidden' && (
                          <button
                            onClick={() => {
                              adminStore.updateReviewStatus(rev.id, 'Hidden');
                              refreshAll();
                              triggerToast('Review hidden');
                            }}
                            className="px-2.5 py-1 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 rounded text-xs font-semibold cursor-pointer"
                          >
                            Hide
                          </button>
                        )}
                        <button
                          onClick={() => {
                            adminStore.deleteReview(rev.id);
                            refreshAll();
                            triggerToast('Review deleted');
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 9. CUSTOMIZE FRONTEND CONTENT (Non-Invasive Content Only) */}
            {/* ======================================================== */}
            {activeSection === 'customize' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Customize Frontend Content</h1>
                  <p className="text-xs text-neutral-400">
                    Controls customer-facing headlines, banners, announcements and contact copy without altering website layout or design.
                  </p>
                </div>

                <form onSubmit={handleSaveFrontendConfig} className="space-y-6">
                  {/* Branding & Logo */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Store Branding</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Header Brand Logo Text</label>
                        <input
                          type="text"
                          value={frontendContent.logoText}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, logoText: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-serif"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Top Announcement Bar Text</label>
                        <input
                          type="text"
                          value={frontendContent.promoBarText}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, promoBarText: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Campaign Banner */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Hero Campaign Headline & Media</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Hero Main Heading</label>
                        <input
                          type="text"
                          value={frontendContent.heroHeading}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, heroHeading: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Hero Subheading</label>
                        <input
                          type="text"
                          value={frontendContent.heroSubheading}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, heroSubheading: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-neutral-400 mb-1">Hero Image Asset URL</label>
                        <input
                          type="text"
                          value={frontendContent.heroImageUrl}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, heroImageUrl: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Care & Social */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Footer Information & Socials</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Support Hotline</label>
                        <input
                          type="text"
                          value={frontendContent.supportPhone}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, supportPhone: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Support Email</label>
                        <input
                          type="email"
                          value={frontendContent.supportEmail}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, supportEmail: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">Instagram Link</label>
                        <input
                          type="text"
                          value={frontendContent.instagramUrl}
                          onChange={(e) =>
                            setFrontendContent({ ...frontendContent, instagramUrl: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer transition-colors"
                    >
                      Save Frontend Content
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* 10. PAYMENTS                                             */}
            {/* ======================================================== */}
            {activeSection === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Payment Gateways & Transactions</h1>
                  <p className="text-xs text-neutral-400">Configure enabled checkout payment methods and audit recent transaction settlements.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Cash on Delivery (COD)', desc: 'Nationwide in 150+ cities', active: true, fee: 'Free' },
                    { name: 'Credit / Debit Card', desc: 'Visa, MasterCard, PayFast Gateway', active: true, fee: '2.5% MDR' },
                    { name: 'Direct Bank Transfer', desc: 'Meezan, HBL, Alfalah Accounts', active: true, fee: '0%' },
                    { name: 'Mobile Wallets', desc: 'JazzCash, EasyPaisa, Nayapay', active: true, fee: '1.5%' },
                  ].map((pay, i) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <CreditCard className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-400">
                          Active
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{pay.name}</h4>
                      <p className="text-xs text-neutral-400">{pay.desc}</p>
                      <div className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-800">
                        Fee: {pay.fee}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transactions Table */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-neutral-800 font-bold uppercase tracking-wider text-xs text-white">
                    Recent Customer Transactions
                  </div>
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Transaction ID</th>
                        <th className="py-2.5 px-3">Order</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-900/60">
                          <td className="py-2.5 px-3 font-mono text-neutral-400">TXN-{o.orderNumber.replace('YB-', '')}89</td>
                          <td className="py-2.5 px-3 font-semibold text-white">{o.orderNumber}</td>
                          <td className="py-2.5 px-3">{o.paymentMethod}</td>
                          <td className="py-2.5 px-3 font-bold text-white">₨ {o.totalAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                o.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : o.paymentStatus === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 11. SHIPPING                                             */}
            {/* ======================================================== */}
            {activeSection === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Shipping & Couriers</h1>
                  <p className="text-xs text-neutral-400">Configure logistics rates, delivery thresholds, courier integrations and coverage.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="text-xs text-neutral-400">Standard Delivery</span>
                    <div className="text-xl font-bold text-white">₨ 250 Flat Rate</div>
                    <p className="text-xs text-neutral-500">2-4 business days across Pakistan</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="text-xs text-neutral-400">Free Shipping Threshold</span>
                    <div className="text-xl font-bold text-emerald-400">Orders &ge; ₨ 3,000</div>
                    <p className="text-xs text-neutral-500">Automatic complimentary shipping</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="text-xs text-neutral-400">Express Same-Day</span>
                    <div className="text-xl font-bold text-amber-400">₨ 500</div>
                    <p className="text-xs text-neutral-500">Available in Karachi, Lahore, Islamabad</p>
                  </div>
                </div>

                {/* Couriers */}
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Logistics Courier Partners</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {[
                      { name: 'TCS Express', tracking: 'tcs.com.pk/track', status: 'Active' },
                      { name: 'Leopards Courier', tracking: 'leopardscourier.com', status: 'Active' },
                      { name: 'Call Courier', tracking: 'callcourier.com.pk', status: 'Active' },
                      { name: 'DHL International', tracking: 'dhl.com/track', status: 'Active' },
                    ].map((c, i) => (
                      <div key={i} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{c.tracking}</div>
                        <span className="inline-block mt-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 12. REPORTS & ANALYTICS                                  */}
            {/* ======================================================== */}
            {activeSection === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Reports & Intelligence</h1>
                  <p className="text-xs text-neutral-400">Revenue breakdowns, top selling articles, order volume and fulfillment velocity.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Selling Products */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Top 5 Best-Selling Products</h3>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded bg-neutral-900">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-amber-400 font-bold w-4">#{i + 1}</span>
                            <span className="font-medium text-white truncate max-w-[200px]">{p.name}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-white">₨ {(p.price * (24 - i * 3)).toLocaleString()}</div>
                            <div className="text-[10px] text-neutral-500">{24 - i * 3} units sold</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Summary */}
                  <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Revenue Performance Summary</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between p-2.5 rounded bg-neutral-900">
                        <span className="text-neutral-400">Gross Sales (This Month)</span>
                        <span className="font-mono font-bold text-white">₨ 1,842,500</span>
                      </div>
                      <div className="flex justify-between p-2.5 rounded bg-neutral-900">
                        <span className="text-neutral-400">Discounts & Promos Given</span>
                        <span className="font-mono font-bold text-red-400">-₨ 124,000</span>
                      </div>
                      <div className="flex justify-between p-2.5 rounded bg-neutral-900">
                        <span className="text-neutral-400">Net Processed Revenue</span>
                        <span className="font-mono font-bold text-emerald-400">₨ 1,718,500</span>
                      </div>
                      <div className="flex justify-between p-2.5 rounded bg-neutral-900">
                        <span className="text-neutral-400">Average Order Value (AOV)</span>
                        <span className="font-mono font-bold text-amber-400">₨ 14,750</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 13. ADMIN USERS                                          */}
            {/* ======================================================== */}
            {activeSection === 'admins' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Admin Users & Access Control</h1>
                    <p className="text-xs text-neutral-400">Manage administrator accounts, assign operational roles, and set module permissions.</p>
                  </div>
                  <button
                    onClick={() => {
                      setAdminUserForm({
                        name: '',
                        email: '',
                        role: 'Catalog Manager',
                        permissions: ['Products', 'Inventory'],
                        status: 'Active',
                      });
                      setAdminUserModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Admin User</span>
                  </button>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900 text-neutral-400 font-semibold uppercase">
                      <tr>
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Permissions</th>
                        <th className="py-3 px-3">Last Login</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-900/60">
                          <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                          <td className="py-3 px-3 text-neutral-400">{u.email}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-neutral-400">{u.permissions.join(', ')}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">{u.lastLogin}</td>
                          <td className="py-3 px-3 text-right">
                            {u.role !== 'Super Admin' && (
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'admin',
                                    id: u.id,
                                    title: u.name,
                                  })
                                }
                                className="p-1.5 text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 14. SETTINGS                                             */}
            {/* ======================================================== */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Store Settings</h1>
                  <p className="text-xs text-neutral-400">Configure core brand details, legal entity information, tax numbers and contact profiles.</p>
                </div>

                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Store Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1">Company Registered Name</label>
                      <input
                        type="text"
                        defaultValue="IH Luxury Retail (Pvt) Ltd."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">NTN / Sales Tax Registration #</label>
                      <input
                        type="text"
                        defaultValue="NTN-8492019-3"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Default Base Currency</label>
                      <input
                        type="text"
                        defaultValue="PKR (₨)"
                        disabled
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Store Timezone</label>
                      <input
                        type="text"
                        defaultValue="Asia/Karachi (GMT+5)"
                        disabled
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex justify-end">
                    <button
                      onClick={() => triggerToast('Store settings saved successfully')}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADVANCED PRODUCT CUSTOMIZER STUDIO                */}
      {/* ======================================================== */}
      <ProductCustomizerModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={editingProduct}
        defaultDepartment={currentDepartment === 'Anniversary B1G1' ? 'Woman' : currentDepartment}
        onSave={handleSaveProductCustomizer}
        onDuplicate={handleDuplicateProduct}
        onNotify={triggerToast}
      />

      {/* ======================================================== */}
      {/* MODAL: BULK PRICE ADJUSTMENT                             */}
      {/* ======================================================== */}
      {bulkPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs font-sans text-xs">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Bulk Price Adjustment ({selectedProductIds.size} articles)
                </h3>
              </div>
              <button
                onClick={() => setBulkPriceModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-neutral-400">
              Apply a percentage promotional discount or cost markup across all {selectedProductIds.size} selected articles.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Adjustment Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bulkPricePct}
                    onChange={(e) => setBulkPricePct(Number(e.target.value))}
                    className="w-32 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-neutral-400">
                    {bulkPricePct < 0
                      ? `(${Math.abs(bulkPricePct)}% discount sale)`
                      : `(+${bulkPricePct}% price adjustment)`}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 text-[11px] block mb-1.5">Quick Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[-50, -30, -20, -15, -10, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkPricePct(pct)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                        bulkPricePct === pct
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setBulkPriceModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyBulkPrices(bulkPricePct)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase rounded-lg cursor-pointer"
              >
                Apply Price Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ORDER DETAILS                                     */}
      {/* ======================================================== */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {orderDetailModal.orderNumber}
                </span>
                <span className="text-neutral-400">Order Details</span>
              </div>
              <button onClick={() => setOrderDetailModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="p-3 bg-neutral-950 rounded-lg space-y-1">
                <div className="font-bold text-white text-sm">{orderDetailModal.customerName}</div>
                <div className="text-neutral-400">{orderDetailModal.customerEmail} • {orderDetailModal.customerPhone}</div>
                <div className="text-neutral-300 pt-1">{orderDetailModal.shippingAddress}, {orderDetailModal.city}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-neutral-400 text-[11px]">Ordered Articles</h4>
                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-lg overflow-hidden">
                  {orderDetailModal.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-neutral-950">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="w-9 h-11 object-cover rounded bg-neutral-800" />
                        )}
                        <div>
                          <div className="font-bold text-white">{item.productName}</div>
                          <div className="text-[11px] text-neutral-400">Size: {item.size} • Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-white font-mono">
                        ₨ {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400">Total Order Amount</div>
                  <div className="text-lg font-bold font-serif text-white">₨ {orderDetailModal.totalAmount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-400">
                    {orderDetailModal.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setOrderDetailModal(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CUSTOMER PROFILE                                  */}
      {/* ======================================================== */}
      {customerDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 text-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Customer Profile</h3>
              <button onClick={() => setCustomerDetailModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-base font-bold text-white">{customerDetailModal.name}</div>
              <div className="text-neutral-400">{customerDetailModal.email}</div>
              <div className="text-neutral-400">{customerDetailModal.phone}</div>
              <div className="text-neutral-300">{customerDetailModal.address}, {customerDetailModal.city}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 rounded-lg">
              <div>
                <span className="text-neutral-500 text-[10px]">Total Orders</span>
                <div className="text-lg font-bold text-white">{customerDetailModal.totalOrders}</div>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px]">Lifetime Spend</span>
                <div className="text-lg font-bold text-amber-400">₨ {customerDetailModal.totalSpent.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  adminStore.toggleCustomerStatus(customerDetailModal.id);
                  setCustomerDetailModal(null);
                  refreshAll();
                  triggerToast('Customer status updated');
                }}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-semibold cursor-pointer"
              >
                {customerDetailModal.status === 'Active' ? 'Block Customer' : 'Activate Customer'}
              </button>
              <button
                onClick={() => setCustomerDetailModal(null)}
                className="px-4 py-1.5 bg-neutral-800 text-white rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY                               */}
      {/* ======================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 text-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {categoryForm.id ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Velvet Shawls"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Department</label>
                <select
                  value={categoryForm.department || 'Woman'}
                  onChange={(e) => setCategoryForm({ ...categoryForm, department: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Woman">Woman</option>
                  <option value="Man">Man</option>
                  <option value="Teens">Teens</option>
                  <option value="Fragrance & Beauty">Fragrance & Beauty</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Category Image URL</label>
                <input
                  type="text"
                  value={categoryForm.imageUrl || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                  placeholder="/src/assets/images/..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-800 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE COUPON                                     */}
      {/* ======================================================== */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 text-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Create Discount Voucher</h3>
              <button onClick={() => setCouponModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code || ''}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE30"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={couponForm.type || 'percentage'}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.value || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Min. Purchase (PKR)</label>
                  <input
                    type="number"
                    value={couponForm.minPurchase || 3000}
                    onChange={(e) => setCouponForm({ ...couponForm, minPurchase: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.expiryDate || '2026-12-31'}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-800 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD ADMIN USER                                    */}
      {/* ======================================================== */}
      {adminUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 text-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add Staff Administrator</h3>
              <button onClick={() => setAdminUserModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminUserForm.name || !adminUserForm.email) return;
                adminStore.addAdminUser({
                  name: adminUserForm.name,
                  email: adminUserForm.email,
                  role: adminUserForm.role || 'Catalog Manager',
                  permissions: adminUserForm.permissions || ['Products', 'Inventory'],
                  status: 'Active',
                });
                setAdminUserModalOpen(false);
                refreshAll();
                triggerToast('Admin staff account created');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-neutral-400 mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={adminUserForm.name || ''}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, name: e.target.value })}
                  placeholder="e.g. Asad Raza"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={adminUserForm.email || ''}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, email: e.target.value })}
                  placeholder="asad@yourbrand.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Administrative Role</label>
                <select
                  value={adminUserForm.role || 'Catalog Manager'}
                  onChange={(e) => setAdminUserForm({ ...adminUserForm, role: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Catalog Manager">Catalog Manager</option>
                  <option value="Order Fulfillment">Order Fulfillment</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setAdminUserModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-800 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION DIALOG                                      */}
      {/* ======================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
          <div
            className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-xl p-5 text-xs space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-white text-sm">Confirm Deletion</h4>
            </div>
            <p className="text-neutral-300">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.title}"</strong>? This
              action will immediately remove it from the system.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded cursor-pointer"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
