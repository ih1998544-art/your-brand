import React, { useState } from 'react';
import { teensCms } from '../../services/teensStore';
import {
  HeroConfig,
  CategoryCard,
  PromoBanner,
  TeenProduct,
} from '../../data/teensData';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  Image,
  Layers,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface TeensAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const TeensAdminDrawer: React.FC<TeensAdminDrawerProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [activeSection, setActiveSection] = useState<
    'hero' | 'categories' | 'trending' | 'banners4' | 'fits' | 'banners6'
  >('hero');

  // Local state for editing
  const [hero, setHero] = useState<HeroConfig>(teensCms.getHero());
  const [categories, setCategories] = useState<CategoryCard[]>(teensCms.getCategories());
  const [trending, setTrending] = useState<TeenProduct[]>(teensCms.getTrendingProducts());
  const [banners4, setBanners4] = useState<PromoBanner[]>(teensCms.getSection4Banners());
  const [fits, setFits] = useState<TeenProduct[]>(teensCms.getTrendingFits());
  const [banners6, setBanners6] = useState<PromoBanner[]>(teensCms.getSection6Banners());

  // New product form in trending
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<any>('Teen Girls');
  const [newProdPrice, setNewProdPrice] = useState(4990);
  const [newProdSizes, setNewProdSizes] = useState('12Y, 14Y, 16Y, 18Y');
  const [newProdBadge, setNewProdBadge] = useState<any>('Summer 26');

  if (!isOpen) return null;

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    teensCms.saveHero(hero);
    onNotify('Section 1 (Hero Banner) updated successfully!');
  };

  const handleSaveCategory = (index: number, updated: CategoryCard) => {
    const next = [...categories];
    next[index] = updated;
    setCategories(next);
    teensCms.updateCategories(next);
    onNotify(`Category "${updated.name}" updated!`);
  };

  const handleSaveBanner4 = (index: number, updated: PromoBanner) => {
    const next = [...banners4];
    next[index] = updated;
    setBanners4(next);
    teensCms.saveSection4Banner(updated);
    onNotify(`Section 4 Banner "${updated.heading}" updated!`);
  };

  const handleSaveBanner6 = (index: number, updated: PromoBanner) => {
    const next = [...banners6];
    next[index] = updated;
    setBanners6(next);
    teensCms.saveSection6Banner(updated);
    onNotify(`Section 6 Banner "${updated.heading}" updated!`);
  };

  const handleAddTrendingProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const sizesArr = newProdSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const newProduct: TeenProduct = {
      id: `custom-trend-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      sizes: sizesArr.length > 0 ? sizesArr : ['12Y', '14Y', '16Y'],
      inStock: true,
      badge: newProdBadge || undefined,
      imageUrl: '/src/assets/images/cat_teen_girls_1790700298033.jpg',
      hoverImageUrl: '/src/assets/images/banner_teen_girls_1790700410797.jpg',
      tags: [newProdCategory],
      sku: `CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      fabric: 'Fine Cotton',
      description: 'Custom added article from live Admin CMS.',
    };

    teensCms.saveTrendingProduct(newProduct);
    setTrending(teensCms.getTrendingProducts());
    setNewProdName('');
    onNotify(`Added product "${newProduct.name}" to Trending!`);
  };

  const handleDeleteTrendingProduct = (id: string) => {
    teensCms.deleteTrendingProduct(id);
    setTrending(teensCms.getTrendingProducts());
    onNotify('Product removed from Trending');
  };

  const handleToggleStock = (id: string, current: boolean) => {
    const item = trending.find((p) => p.id === id);
    if (item) {
      const updated = { ...item, inStock: !current };
      teensCms.saveTrendingProduct(updated);
      setTrending(teensCms.getTrendingProducts());
      onNotify(`${item.name} marked as ${!current ? 'In Stock' : 'Out of Stock'}`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all 6 Teens homepage sections back to default seed?')) {
      teensCms.resetToDefaults();
      setHero(teensCms.getHero());
      setCategories(teensCms.getCategories());
      setTrending(teensCms.getTrendingProducts());
      setBanners4(teensCms.getSection4Banners());
      setFits(teensCms.getTrendingFits());
      setBanners6(teensCms.getSection6Banners());
      onNotify('All homepage sections reset to defaults!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-neutral-900 text-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-serif text-base font-bold uppercase tracking-wider text-white">
                Teens & Kids Homepage CMS
              </h2>
              <p className="text-[11px] text-neutral-400">
                Live editor for all 6 sections (Hero, Categories, Trending, Promo 4, Fits, Promo 6)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="text-neutral-400 hover:text-rose-400 p-1.5 transition-colors"
              title="Reset to Factory Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1.5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto scrollbar-none bg-neutral-950/70 border-b border-neutral-800 p-1.5 gap-1 text-[11px] font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveSection('hero')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'hero' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            1. Hero Banner
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'categories' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            2. Categories (5)
          </button>
          <button
            onClick={() => setActiveSection('trending')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'trending' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            3. Trending (~47)
          </button>
          <button
            onClick={() => setActiveSection('banners4')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'banners4' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            4. Promo Banners (3)
          </button>
          <button
            onClick={() => setActiveSection('fits')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'fits' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            5. Trending Fits (~23)
          </button>
          <button
            onClick={() => setActiveSection('banners6')}
            className={`px-3 py-2 rounded-xs whitespace-nowrap transition-colors ${
              activeSection === 'banners6' ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            6. Collections (3)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* SECTION 1: HERO */}
          {activeSection === 'hero' && (
            <form onSubmit={handleSaveHero} className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 1: Hero Banner Settings
              </h3>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Hero Heading</label>
                <input
                  type="text"
                  value={hero.heading}
                  onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Subtitle / Promotional Text</label>
                <textarea
                  rows={2}
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase">Button Text</label>
                  <input
                    type="text"
                    value={hero.buttonText}
                    onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold uppercase">Button Link</label>
                  <input
                    type="text"
                    value={hero.buttonLink}
                    onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Hero Image URL</label>
                <input
                  type="text"
                  value={hero.imageUrl}
                  onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-xs text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1 font-semibold uppercase">
                  <span>Overlay Darkness</span>
                  <span>{Math.round(hero.overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={hero.overlayOpacity}
                  onChange={(e) => setHero({ ...hero, overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-neutral-950 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-xs flex items-center justify-center gap-2 mt-4"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Banner</span>
              </button>
            </form>
          )}

          {/* SECTION 2: CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 2: 5 Category Cards (Summer '26)
              </h3>

              <div className="space-y-4">
                {categories.map((cat, i) => (
                  <div key={cat.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">#{cat.order} {cat.name}</span>
                      <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cat.isActive}
                          onChange={(e) => handleSaveCategory(i, { ...cat, isActive: e.target.checked })}
                          className="rounded-xs"
                        />
                        <span>Active</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Category Name</label>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleSaveCategory(i, { ...cat, name: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 uppercase">Subtitle</label>
                        <input
                          type="text"
                          value={cat.subtitle}
                          onChange={(e) => handleSaveCategory(i, { ...cat, subtitle: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase">Image URL</label>
                      <input
                        type="text"
                        value={cat.imageUrl}
                        onChange={(e) => handleSaveCategory(i, { ...cat, imageUrl: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white font-mono text-[10px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: TRENDING PRODUCTS */}
          {activeSection === 'trending' && (
            <div className="space-y-6">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 3: Trending Products ({trending.length} items)
              </h3>

              {/* Add New Product Form */}
              <form onSubmit={handleAddTrendingProduct} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xs space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                  Add New Trending Product
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bold Flora-5"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Category Tab</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                    >
                      <option value="Teen Girls">Teen Girls</option>
                      <option value="Teen Boys">Teen Boys</option>
                      <option value="Kid Girls">Kid Girls</option>
                      <option value="Kid Boys">Kid Boys</option>
                      <option value="Infant">Infant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Price (PKR)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Sizes (comma sep)</label>
                    <input
                      type="text"
                      value={newProdSizes}
                      onChange={(e) => setNewProdSizes(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Badge</label>
                    <select
                      value={newProdBadge}
                      onChange={(e) => setNewProdBadge(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                    >
                      <option value="Summer 26">Summer 26</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product to Catalog</span>
                </button>
              </form>

              {/* Existing Products List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {trending.slice(0, 47).map((p) => (
                  <div key={p.id} className="p-3 bg-neutral-950 border border-neutral-800 flex items-center justify-between rounded-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.imageUrl} alt="" className="w-8 h-10 object-cover bg-neutral-900 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate text-[11px]">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.category} • PKR {p.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p.id, p.inStock)}
                        className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase ${
                          p.inStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrendingProduct(p.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: PROMOTIONAL BANNERS */}
          {activeSection === 'banners4' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 4: 3 Promotional Banners (Teen Boys, Teen Girls, Kid Boys)
              </h3>

              {banners4.map((b, i) => (
                <div key={b.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Banner #{i + 1}: {b.category}</span>
                    <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={b.isActive}
                        onChange={(e) => handleSaveBanner4(i, { ...b, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase">Heading</label>
                      <input
                        type="text"
                        value={b.heading}
                        onChange={(e) => handleSaveBanner4(i, { ...b, heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase">Button Text</label>
                      <input
                        type="text"
                        value={b.buttonText}
                        onChange={(e) => handleSaveBanner4(i, { ...b, buttonText: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={b.description}
                      onChange={(e) => handleSaveBanner4(i, { ...b, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Image URL</label>
                    <input
                      type="text"
                      value={b.imageUrl}
                      onChange={(e) => handleSaveBanner4(i, { ...b, imageUrl: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white font-mono text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 5: TRENDING FITS */}
          {activeSection === 'fits' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 5: Trending Fits ({fits.length} Infant & Kid Articles)
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {fits.map((f) => (
                  <div key={f.id} className="p-3 bg-neutral-950 border border-neutral-800 flex items-center justify-between rounded-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={f.imageUrl} alt="" className="w-8 h-10 object-cover bg-neutral-900 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate text-[11px]">{f.name}</p>
                        <p className="text-[10px] text-neutral-400">
                          Sizes: {f.sizes.join(', ')} • PKR {f.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        teensCms.deleteTrendingFitProduct(f.id);
                        setFits(teensCms.getTrendingFits());
                        onNotify('Removed article from Trending Fits');
                      }}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: COLLECTION BANNERS */}
          {activeSection === 'banners6' && (
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-2">
                Section 6: 3 Collection Promotional Banners (Kid Boys, Kid Girls, Infant)
              </h3>

              {banners6.map((b, i) => (
                <div key={b.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Banner #{i + 1}: {b.category}</span>
                    <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={b.isActive}
                        onChange={(e) => handleSaveBanner6(i, { ...b, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase">Heading</label>
                      <input
                        type="text"
                        value={b.heading}
                        onChange={(e) => handleSaveBanner6(i, { ...b, heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 uppercase">Button Text</label>
                      <input
                        type="text"
                        value={b.buttonText}
                        onChange={(e) => handleSaveBanner6(i, { ...b, buttonText: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={b.description}
                      onChange={(e) => handleSaveBanner6(i, { ...b, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase">Image URL</label>
                    <input
                      type="text"
                      value={b.imageUrl}
                      onChange={(e) => handleSaveBanner6(i, { ...b, imageUrl: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-1.5 text-white font-mono text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
