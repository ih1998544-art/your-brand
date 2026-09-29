import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  DollarSign,
  Tag,
  Boxes,
  Image as ImageIcon,
  Check,
  Eye,
  Copy,
  RefreshCw,
  Plus,
  Percent,
  Sliders,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Product, Department, Currency } from '../../types';
import { LuxuryAssetPickerModal } from './LuxuryAssetPickerModal';

export interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  defaultDepartment?: Department;
  onSave: (product: Partial<Product>) => void;
  onDuplicate?: (productId: string) => void;
  onNotify: (msg: string) => void;
}

type TabType = 'general' | 'pricing' | 'inventory' | 'visuals' | 'badges';

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  isOpen,
  onClose,
  product,
  defaultDepartment = 'Woman',
  onSave,
  onDuplicate,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'primary' | 'secondary'>('primary');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [newSizeInput, setNewSizeInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sizes: product.sizes && product.sizes.length > 0 ? [...product.sizes] : ['XS', 'S', 'M', 'L', 'XL'],
      });
    } else {
      // Default new product state
      setFormData({
        name: '',
        price: 5990,
        originalPrice: 7990,
        department: defaultDepartment === 'Anniversary B1G1' ? 'Woman' : defaultDepartment,
        categoryKey: 'coord',
        tab: 'rtw',
        categorySlug: 'rtw',
        fabric: 'Fine Cotton Slub / Lawn',
        details: 'Tailored luxury silhouette with artisanal finishing and handcrafted details.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        sku: `YB-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: 25,
        active: true,
        featured: false,
        isNew: true,
        imageUrl: '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg',
        images: ['/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg'],
      });
    }
    setActiveTab('general');
  }, [product, defaultDepartment, isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const price = formData.price || 0;
  const originalPrice = formData.originalPrice;
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const savingsAmount = originalPrice && originalPrice > price ? originalPrice - price : 0;

  // Preset Template Loader
  const loadTemplate = (templateType: 'woman' | 'man' | 'perfume' | 'beauty' | 'teen') => {
    switch (templateType) {
      case 'woman':
        setFormData((prev) => ({
          ...prev,
          name: 'Royal Emerald Embroidered Kurta Set',
          department: 'Woman',
          price: 8490,
          originalPrice: 10990,
          fabric: 'Mercerized Pima Lawn',
          categoryKey: 'kurta',
          tab: 'rtw',
          categorySlug: 'rtw',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          imageUrl: '/src/assets/images/mannequin_turquoise_palazzo_1790645182047.jpg',
          details: 'Handcrafted floral embroidery along neckline with matching wide-leg trousers.',
        }));
        onNotify('Loaded Woman Pret Template');
        break;
      case 'man':
        setFormData((prev) => ({
          ...prev,
          name: 'Imperial Charcoal Linen Kameez Shalwar',
          department: 'Man',
          price: 12950,
          originalPrice: 15500,
          fabric: 'Pure Irish Linen Blend',
          categoryKey: 'kurta',
          tab: 'men_ks',
          categorySlug: 'men_ks',
          sizes: ['S', 'M', 'L', 'XL'],
          imageUrl: '/src/assets/images/men_charcoal_kameez_shalwar_1790647739906.jpg',
          details: 'Classic band collar with concealed placket and crease-resistant drape.',
        }));
        onNotify('Loaded Men Kameez Shalwar Template');
        break;
      case 'perfume':
        setFormData((prev) => ({
          ...prev,
          name: 'Amber Royale Extrait De Parfum (100ml)',
          department: 'Fragrance & Beauty',
          price: 11400,
          originalPrice: 14000,
          fabric: '30% Extrait Concentration',
          categoryKey: 'fragrance',
          tab: 'fragrance_perfume',
          categorySlug: 'fragrance_perfume',
          sizes: ['50ml', '100ml'],
          imageUrl: '/src/assets/images/prod_amber_oud_1790706213426.jpg',
          details: 'Top notes of Sicilian bergamot, taif rose, and rich agarwood base. Lasts 14+ hours.',
        }));
        onNotify('Loaded Luxury Fragrance Template');
        break;
      case 'beauty':
        setFormData((prev) => ({
          ...prev,
          name: 'Rosewood Velvet Cashmere Lipstick',
          department: 'Fragrance & Beauty',
          price: 2490,
          originalPrice: 3200,
          fabric: 'Enriched with Vitamin E & Jojoba Oil',
          categoryKey: 'beauty',
          tab: 'beauty_makeup',
          categorySlug: 'beauty_makeup',
          sizes: ['One Size'],
          imageUrl: '/src/assets/images/prod_matte_lipstick_1790706239058.jpg',
          details: 'Non-drying velvet matte texture delivering weightless intense color in one swipe.',
        }));
        onNotify('Loaded Beauty Essential Template');
        break;
      case 'teen':
        setFormData((prev) => ({
          ...prev,
          name: 'Teens Summer Breeze Printed Kurta',
          department: 'Teens',
          price: 4490,
          originalPrice: 5990,
          fabric: '100% Breathable Cotton',
          categoryKey: 'coord',
          tab: 'new',
          categorySlug: 'new',
          sizes: ['11-12Y', '13-14Y', '15-16Y'],
          imageUrl: '/src/assets/images/teen_summer_peach_1790704536166.jpg',
          details: 'Playful pastel hues tailored for effortless everyday summer festive comfort.',
        }));
        onNotify('Loaded Teens Outfit Template');
        break;
    }
  };

  // Quick Price Modifiers
  const applyPriceDiscount = (pct: number) => {
    const base = formData.originalPrice || formData.price || 5000;
    const discounted = Math.max(100, Math.round((base * (1 - pct / 100)) / 10) * 10);
    setFormData((prev) => ({
      ...prev,
      originalPrice: base,
      price: discounted,
    }));
    onNotify(`Applied -${pct}% discount (₨ ${discounted.toLocaleString()})`);
  };

  const applyPriceAdjustment = (pct: number) => {
    const curr = formData.price || 5000;
    const nextPrice = Math.max(100, Math.round((curr * (1 + pct / 100)) / 10) * 10);
    setFormData((prev) => ({
      ...prev,
      price: nextPrice,
    }));
    onNotify(`Updated price to ₨ ${nextPrice.toLocaleString()}`);
  };

  const roundToCharmPricing = (endWith: 990 | 490) => {
    const curr = formData.price || 5000;
    const thousands = Math.floor(curr / 1000);
    const rounded = thousands * 1000 + endWith;
    setFormData((prev) => ({
      ...prev,
      price: rounded,
    }));
    onNotify(`Rounded price to ₨ ${rounded.toLocaleString()}`);
  };

  // Size Tag Management
  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter((s) => s !== sizeToRemove),
    }));
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    const upper = newSizeInput.trim().toUpperCase();
    if (!formData.sizes?.includes(upper)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), upper],
      }));
    }
    setNewSizeInput('');
  };

  const handleSetPresetSizes = (preset: string[]) => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...preset],
    }));
    onNotify(`Applied size preset: ${preset.join(', ')}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      onNotify('Please enter a product title / name.');
      setActiveTab('general');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      onNotify('Please specify a valid price.');
      setActiveTab('pricing');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs font-sans text-neutral-900 animate-fadeIn">
        <div
          className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-xs text-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                    {product ? 'Customize Product Article' : 'Create & Customize New Product'}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 font-bold">
                    {formData.sku || 'NEW-SKU'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Update article title, sale pricing, discounts, media gallery, sizes and storefront visibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {product && onDuplicate && (
                <button
                  type="button"
                  onClick={() => {
                    onDuplicate(product.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                  title="Clone this product to create a variation"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Starting Template Bar (shown only when creating new article) */}
          {!product && (
            <div className="px-5 py-2.5 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center gap-2 text-[11px] shrink-0">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Templates:
              </span>
              <button
                type="button"
                onClick={() => loadTemplate('woman')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
              >
                Woman Pret / Kurta
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('man')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
              >
                Men Kameez Shalwar
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('perfume')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
              >
                Extrait De Parfum
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('beauty')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
              >
                Velvet Beauty Tint
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('teen')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
              >
                Teens / Kids Outfit
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-5 shrink-0 overflow-x-auto scrollbar-none">
            {[
              { id: 'general', label: '1. General & Info', icon: Tag },
              { id: 'pricing', label: '2. Pricing & Discounts', icon: DollarSign, badge: discountPercent > 0 ? `-${discountPercent}%` : undefined },
              { id: 'inventory', label: '3. Inventory & Sizes', icon: Boxes, badge: `${formData.sizes?.length || 0} sizes` },
              { id: 'visuals', label: '4. Visuals & Media', icon: ImageIcon },
              { id: 'badges', label: '5. Badges & Storefront', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-amber-400 text-amber-300 font-bold bg-amber-500/5'
                      : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Body: Form Canvas + Live Preview Card */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Form Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Product Name / Title <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Royal Emerald Embroidered Kurta Set"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <div className="text-[11px] text-neutral-500 mt-1 flex justify-between">
                      <span>Displayed prominently on storefront cards and checkout receipts.</span>
                      <span>{formData.name?.length || 0} characters</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">Department *</label>
                      <select
                        value={formData.department || 'Woman'}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="Woman">Woman</option>
                        <option value="Man">Man</option>
                        <option value="Teens">Teens</option>
                        <option value="Fragrance & Beauty">Fragrance & Beauty</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">SKU Code *</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          required
                          value={formData.sku || ''}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400 uppercase"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              sku: `YB-${Math.floor(1000 + Math.random() * 9000)}`,
                            })
                          }
                          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 cursor-pointer"
                          title="Generate Random SKU"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">Fabric / Material</label>
                      <input
                        type="text"
                        value={formData.fabric || ''}
                        onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                        placeholder="e.g. Pure Cotton Lawn / Extrait"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Article Details & Description</label>
                    <textarea
                      rows={3}
                      value={formData.details || ''}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Describe the silhouette, embroidery technique, neckline cuts, or fragrance notes..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & DISCOUNTS */}
              {activeTab === 'pricing' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                      <label className="block text-neutral-300 font-semibold text-xs">
                        Current Selling Price (PKR) <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-neutral-500 font-serif">₨</span>
                        <input
                          type="number"
                          min={1}
                          required
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-8 pr-3 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <span className="text-[11px] text-neutral-500">The amount charged at checkout.</span>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                      <label className="block text-neutral-300 font-semibold text-xs">
                        Original / Compare-At Price (PKR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-neutral-500 font-serif">₨</span>
                        <input
                          type="number"
                          min={0}
                          value={formData.originalPrice || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          placeholder="Optional (shows strikethrough)"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-8 pr-3 py-2.5 text-white font-mono text-base focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <span className="text-[11px] text-neutral-500">Leave blank if this item is not on sale.</span>
                    </div>
                  </div>

                  {/* Dynamic Discount Calculator Display */}
                  {discountPercent > 0 && (
                    <div className="p-3.5 bg-gradient-to-r from-red-950/40 to-neutral-950 border border-red-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded font-bold font-mono text-xs bg-red-500 text-white">
                          -{discountPercent}% OFF
                        </span>
                        <span className="text-white font-semibold">
                          Customer saves ₨ {savingsAmount.toLocaleString()} on this article
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, originalPrice: undefined })}
                        className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Remove Discount
                      </button>
                    </div>
                  )}

                  {/* Quick Price Action Helpers */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <h4 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      Quick Price & Discount Helpers
                    </h4>

                    <div>
                      <span className="text-[11px] text-neutral-400 block mb-1.5">Apply Seasonal Promotional Sale:</span>
                      <div className="flex flex-wrap gap-2">
                        {[10, 15, 20, 25, 30, 50].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => applyPriceDiscount(pct)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 font-semibold font-mono text-xs text-neutral-200 transition-colors cursor-pointer"
                          >
                            -{pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400">Retail Formatting:</span>
                        <button
                          type="button"
                          onClick={() => roundToCharmPricing(990)}
                          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 font-mono text-[11px] cursor-pointer"
                        >
                          End with .990
                        </button>
                        <button
                          type="button"
                          onClick={() => roundToCharmPricing(490)}
                          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 font-mono text-[11px] cursor-pointer"
                        >
                          End with .490
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400">Price Adjust:</span>
                        <button
                          type="button"
                          onClick={() => applyPriceAdjustment(10)}
                          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[11px] cursor-pointer"
                        >
                          +10%
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPriceAdjustment(-10)}
                          className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[11px] cursor-pointer"
                        >
                          -10%
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY & SIZES */}
              {activeTab === 'inventory' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                    <label className="block text-neutral-300 font-semibold text-xs">
                      Total Available Stock Units <span className="text-amber-400">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        required
                        value={formData.stock ?? 25}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        className="w-48 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                      />
                      <span
                        className={`px-3 py-1 rounded-full font-mono font-bold text-xs ${
                          (formData.stock ?? 25) === 0
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : (formData.stock ?? 25) <= 5
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {(formData.stock ?? 25) === 0
                          ? 'Out of Stock'
                          : (formData.stock ?? 25) <= 5
                          ? 'Low Stock Warning'
                          : 'Healthy Inventory'}
                      </span>
                    </div>
                  </div>

                  {/* Size Customizer */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-300 font-semibold text-xs">
                        Configured Available Sizes ({formData.sizes?.length || 0})
                      </label>
                      <span className="text-[11px] text-neutral-500">Click any size to remove it</span>
                    </div>

                    {/* Size Chips */}
                    <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                      {formData.sizes && formData.sizes.length > 0 ? (
                        formData.sizes.map((sz) => (
                          <span
                            key={sz}
                            onClick={() => handleRemoveSize(sz)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-red-900/60 hover:text-red-200 border border-neutral-700 rounded-lg text-white font-mono text-xs font-semibold cursor-pointer transition-colors group"
                            title="Click to remove size"
                          >
                            <span>{sz}</span>
                            <X className="w-3 h-3 text-neutral-400 group-hover:text-red-300" />
                          </span>
                        ))
                      ) : (
                        <span className="text-neutral-500 text-xs italic self-center">No sizes configured yet.</span>
                      )}
                    </div>

                    {/* Add Custom Size */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new size (e.g. XXL, 100ml, One Size)..."
                        value={newSizeInput}
                        onChange={(e) => setNewSizeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSize();
                          }
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Size</span>
                      </button>
                    </div>

                    {/* Size Presets */}
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[11px] text-neutral-400 block mb-1.5">Apply Standard Size Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPresetSizes(['XS', 'S', 'M', 'L', 'XL'])}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-[11px] cursor-pointer"
                        >
                          Apparel (XS - XL)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'])}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-[11px] cursor-pointer"
                        >
                          Extended (XS - 3XL)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetSizes(['50ml', '100ml'])}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-[11px] cursor-pointer"
                        >
                          Fragrance (50ml, 100ml)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetSizes(['36', '37', '38', '39', '40', '41'])}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-[11px] cursor-pointer"
                        >
                          Footwear (EU 36-41)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetSizes(['One Size'])}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-[11px] cursor-pointer"
                        >
                          One Size Only
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VISUALS & MEDIA */}
              {activeTab === 'visuals' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-300 font-semibold text-xs">
                        Primary Cover Image <span className="text-amber-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPickerTarget('primary');
                          setAssetPickerOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Choose From Luxury Photoshoot Gallery</span>
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        required
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="/src/assets/images/... or https://..."
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500 block">
                      You can paste any custom image path/URL or click the button above to pick from 60+ real photoshoot assets.
                    </span>
                  </div>

                  {/* Secondary Image for Hover & Gallery */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-300 font-semibold text-xs">
                        Secondary / Hover Gallery Image
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPickerTarget('secondary');
                          setAssetPickerOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        <span>Browse Catalog</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={formData.images?.[1] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          images: [prev.imageUrl || '', val].filter(Boolean),
                        }));
                      }}
                      placeholder="Optional alternate angle or detail image..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: BADGES & STOREFRONT VISIBILITY */}
              {activeTab === 'badges' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
                    <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
                      Storefront Visibility & Merchandising
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.active !== false}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          className="mt-0.5 rounded text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">Active on Live Store</span>
                          <span className="text-[11px] text-neutral-400">
                            When unchecked, the article will be hidden from category grids and search results.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.featured ?? false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="mt-0.5 rounded text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">Mark as Featured Collection Article</span>
                          <span className="text-[11px] text-neutral-400">
                            Promotes the item to prime positions in homepage carousels and trending rails.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isNew ?? true}
                          onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                          className="mt-0.5 rounded text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">Show "NEW ARRIVAL" Badge</span>
                          <span className="text-[11px] text-neutral-400">
                            Displays a distinctive luxury new arrival badge on product cards.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Customer Preview Card */}
            <div className="w-full md:w-80 p-5 bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col justify-between shrink-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-neutral-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Live Storefront Card Preview
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
                </div>

                {/* Simulated Customer Product Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-neutral-200 text-neutral-900">
                  <div className="aspect-[3/4] w-full bg-neutral-100 relative overflow-hidden">
                    <img
                      src={formData.imageUrl || '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      {formData.isNew && (
                        <span className="bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                          New
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                          -{discountPercent}%
                        </span>
                      )}
                      {formData.featured && (
                        <span className="bg-amber-500 text-neutral-950 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    {formData.active === false && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                        <span className="bg-red-500 text-white font-bold uppercase text-xs px-3 py-1 rounded">
                          Inactive (Hidden)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      {formData.department || 'Woman'} • {formData.fabric || 'Luxury Pret'}
                    </div>
                    <h5 className="font-serif font-bold text-xs line-clamp-1 text-neutral-900">
                      {formData.name || 'Untitled Article'}
                    </h5>

                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-bold text-sm font-serif text-neutral-950">
                        ₨ {(formData.price || 0).toLocaleString()}
                      </span>
                      {formData.originalPrice && formData.originalPrice > (formData.price || 0) && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          ₨ {formData.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {formData.sizes && formData.sizes.length > 0 && (
                      <div className="flex gap-1 pt-1.5 overflow-x-auto scrollbar-none">
                        {formData.sizes.slice(0, 5).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 border border-neutral-300 rounded text-[9px] font-mono">
                            {s}
                          </span>
                        ))}
                        {formData.sizes.length > 5 && (
                          <span className="text-[9px] text-neutral-400 self-center">+{formData.sizes.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Submit Actions */}
              <div className="pt-4 border-t border-neutral-800 space-y-2 mt-4">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{product ? 'Save & Publish Changes' : 'Create Article'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Luxury Photo Picker Modal */}
      <LuxuryAssetPickerModal
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        selectedUrl={pickerTarget === 'primary' ? formData.imageUrl : formData.images?.[1]}
        onSelectImage={(url) => {
          if (pickerTarget === 'primary') {
            setFormData((prev) => ({
              ...prev,
              imageUrl: url,
              images: [url, ...(prev.images || []).filter((i) => i !== url)],
            }));
            onNotify('Selected primary image');
          } else {
            setFormData((prev) => ({
              ...prev,
              images: [prev.imageUrl || '', url].filter(Boolean),
            }));
            onNotify('Selected secondary image');
          }
        }}
      />
    </>
  );
};
