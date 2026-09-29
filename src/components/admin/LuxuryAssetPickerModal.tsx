import React, { useState } from 'react';
import { X, Search, Check, Image as ImageIcon } from 'lucide-react';

export interface GalleryAsset {
  label: string;
  url: string;
  category: 'Women' | 'Men' | 'Fragrance & Beauty' | 'Teens' | 'Footwear & Bags';
}

export const LUXURY_ASSET_GALLERY: GalleryAsset[] = [
  // Women Pret & Couture
  { label: 'Plum Magenta Embroidered Kurta', url: '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg', category: 'Women' },
  { label: 'Turquoise Teal Lawn Palazzo Suit', url: '/src/assets/images/mannequin_turquoise_palazzo_1790645182047.jpg', category: 'Women' },
  { label: 'Dusty Sage Jaal Lawn Kurta', url: '/src/assets/images/mannequin_sage_lawn_1790645319560.jpg', category: 'Women' },
  { label: 'Maroon Velvet Regal Peshwas', url: '/src/assets/images/mannequin_maroon_velvet_1790645307280.jpg', category: 'Women' },
  { label: 'Black Chiffon Evening Suit', url: '/src/assets/images/mannequin_black_chiffon_1790645331056.jpg', category: 'Women' },
  { label: 'Blush Pink Embroidered Anarkali', url: '/src/assets/images/mannequin_blush_anarkali_1790645341734.jpg', category: 'Women' },
  { label: 'Blush Festive Peshwas Model', url: '/src/assets/images/model_blush_festive_1790617326703.jpg', category: 'Women' },
  { label: 'Copper Formal Peshwas Model', url: '/src/assets/images/model_copper_peshwas_1790617356912.jpg', category: 'Women' },
  { label: 'Ice Blue Kurta Model', url: '/src/assets/images/model_iceblue_kurta_1790617340489.jpg', category: 'Women' },
  { label: 'Mint Organza Formal Model', url: '/src/assets/images/model_mint_organza_1790617289893.jpg', category: 'Women' },
  { label: 'Mustard Yellow Festive Lawn', url: '/src/assets/images/model_yellow_lawn_1790617306737.jpg', category: 'Women' },
  { label: 'Emerald Velvet Regal Gown', url: '/src/assets/images/hero_emerald_velvet_regal_1790618579500.jpg', category: 'Women' },
  { label: 'Ivory Gold Royal Formal', url: '/src/assets/images/hero_ivory_gold_palace_1790618565665.jpg', category: 'Women' },
  { label: 'Rose Organza Fairytale Peshwas', url: '/src/assets/images/hero_rose_organza_fairytale_1790618594563.jpg', category: 'Women' },
  { label: 'Sapphire Silk Modern Co-Ord', url: '/src/assets/images/hero_sapphire_silk_modern_1790618607545.jpg', category: 'Women' },
  { label: 'Chic Modern Everyday Co-Ord', url: '/src/assets/images/coords_chic_modern_1790617785166.jpg', category: 'Women' },
  { label: 'Olive Linen Luxury Co-Ord', url: '/src/assets/images/coords_olive_linen_1790617801415.jpg', category: 'Women' },
  { label: 'Noya Luxury Unstitched Lawn', url: '/src/assets/images/noya_luxury_unstitched_1790617815906.jpg', category: 'Women' },

  // Men Ethnic & Formals
  { label: 'Charcoal Linen Kameez Shalwar', url: '/src/assets/images/men_charcoal_kameez_shalwar_1790647739906.jpg', category: 'Men' },
  { label: 'Navy Blue Kameez Shalwar', url: '/src/assets/images/men_navy_kameez_shalwar_1790647675318.jpg', category: 'Men' },
  { label: 'Emerald Green Kurta Trouser', url: '/src/assets/images/men_emerald_kurta_trouser_1790647768134.jpg', category: 'Men' },
  { label: 'Ivory Formal Raw Silk Kurta', url: '/src/assets/images/men_ivory_formal_kurta_1790647756718.jpg', category: 'Men' },
  { label: 'Mustard Festive Haldi Kurta', url: '/src/assets/images/men_mustard_festive_kurta_1790647790911.jpg', category: 'Men' },
  { label: 'Rust Terracotta Kurta Trouser', url: '/src/assets/images/men_rust_kurta_trouser_1790647700825.jpg', category: 'Men' },
  { label: 'Black Handloom Silk Waistcoat', url: '/src/assets/images/men_black_silk_waistcoat_1790647687875.jpg', category: 'Men' },
  { label: 'Maroon Velvet Embroidered Waistcoat', url: '/src/assets/images/men_maroon_velvet_waistcoat_1790647714288.jpg', category: 'Men' },
  { label: 'Ceremonial Royal Sherwani', url: '/src/assets/images/men_ceremonial_sherwani_1790621243663.jpg', category: 'Men' },
  { label: 'Cream Formal Kurta Suit', url: '/src/assets/images/men_cream_formal_1790620279071.jpg', category: 'Men' },
  { label: 'Green Kameez Shalwar Suit', url: '/src/assets/images/men_green_kameez_1790620293060.jpg', category: 'Men' },
  { label: 'Crisp White Cotton Kameez Shalwar', url: '/src/assets/images/men_white_kameez_1790620262131.jpg', category: 'Men' },

  // Fragrance & Beauty
  { label: 'Amber Royale Extrait 100ml', url: '/src/assets/images/prod_amber_oud_1790706213426.jpg', category: 'Fragrance & Beauty' },
  { label: 'Taif Rose Extrait De Parfum 100ml', url: '/src/assets/images/prod_rose_perfume_1790706226700.jpg', category: 'Fragrance & Beauty' },
  { label: 'Sapphire Night EDP 100ml', url: '/src/assets/images/frag_sapphire_edp_1790706630735.jpg', category: 'Fragrance & Beauty' },
  { label: 'Mediterranean Citrus Body Mist', url: '/src/assets/images/frag_citrus_mist_1790706606040.jpg', category: 'Fragrance & Beauty' },
  { label: 'Pure Dehn Al Oud Attar Oil', url: '/src/assets/images/frag_attar_oil_1790706617582.jpg', category: 'Fragrance & Beauty' },
  { label: 'Rosewood Velvet Matte Lipstick', url: '/src/assets/images/prod_matte_lipstick_1790706239058.jpg', category: 'Fragrance & Beauty' },
  { label: 'Silk Luminous Fluid Foundation', url: '/src/assets/images/makeup_foundation_1790706642385.jpg', category: 'Fragrance & Beauty' },
  { label: 'Royal Jewel Eyeshadow Palette', url: '/src/assets/images/makeup_eyeshadow_1790706657606.jpg', category: 'Fragrance & Beauty' },
  { label: 'Honey Glaze Plumping Lipgloss', url: '/src/assets/images/makeup_lipgloss_1790706670733.jpg', category: 'Fragrance & Beauty' },
  { label: 'Petal Soft Velvet Blush', url: '/src/assets/images/makeup_blush_1790706681783.jpg', category: 'Fragrance & Beauty' },
  { label: 'Cellular 24K Gold Face Serum', url: '/src/assets/images/prod_face_serum_1790706251446.jpg', category: 'Fragrance & Beauty' },
  { label: 'Whipped Ceramide Barrier Cream', url: '/src/assets/images/skin_cream_jar_1790706694575.jpg', category: 'Fragrance & Beauty' },
  { label: 'Damask Rose Balancing Toner', url: '/src/assets/images/skin_rose_toner_1790706706062.jpg', category: 'Fragrance & Beauty' },
  { label: 'Melt-Away Cleansing Balm', url: '/src/assets/images/skin_cleansing_balm_1790706717546.jpg', category: 'Fragrance & Beauty' },
  { label: 'Smoked Amber Reed Diffuser', url: '/src/assets/images/home_reed_diffuser_1790706731752.jpg', category: 'Fragrance & Beauty' },
  { label: 'Royal Oud Scented Bakhoor Candle', url: '/src/assets/images/prod_bakhoor_candle_1790706265616.jpg', category: 'Fragrance & Beauty' },
  { label: 'Sandalwood Luxury Body Wash', url: '/src/assets/images/body_shower_gel_1790706747715.jpg', category: 'Fragrance & Beauty' },

  // Teens & Kids
  { label: 'Teen Summer Peach Kurta', url: '/src/assets/images/teen_summer_peach_1790704536166.jpg', category: 'Teens' },
  { label: 'Teen Boy Pure Linen Kurta', url: '/src/assets/images/teen_boy_linen_kurta_1790704551561.jpg', category: 'Teens' },
  { label: 'Teen Girl Lilac Embroidered Suit', url: '/src/assets/images/teen_girl_lilac_1790704667864.jpg', category: 'Teens' },
  { label: 'Teen Boy Navy Stitched Kurta', url: '/src/assets/images/teen_boy_navy_1790704683794.jpg', category: 'Teens' },
  { label: 'Kid Girl Printed Cotton Frock', url: '/src/assets/images/kid_girl_frock_summer_1790704569668.jpg', category: 'Teens' },
  { label: 'Kid Boy Sky Blue Kurta Pajama', url: '/src/assets/images/kid_boy_sky_kurta_1790704584871.jpg', category: 'Teens' },
  { label: 'Kid Girl Pink Festive Anarkali', url: '/src/assets/images/kid_girl_pink_anarkali_1790704702329.jpg', category: 'Teens' },
  { label: 'Kid Boy Emerald Kurta Set', url: '/src/assets/images/kid_boy_emerald_1790704715233.jpg', category: 'Teens' },
  { label: 'Infant Heirloom Cream Romper', url: '/src/assets/images/infant_cream_romper_1790704599514.jpg', category: 'Teens' },
  { label: 'Infant Mint Embroidered 2-Piece', url: '/src/assets/images/infant_mint_set_1790704731427.jpg', category: 'Teens' },

  // Footwear & Bags
  { label: 'Bridal Zari Embroidered Khussa', url: '/src/assets/images/women_bridal_khussa_1790645146302.jpg', category: 'Footwear & Bags' },
  { label: 'Champagne Block Heel Sandals', url: '/src/assets/images/women_heeled_sandals_1790645121587.jpg', category: 'Footwear & Bags' },
  { label: 'Velvet Midnight Black Khussa', url: '/src/assets/images/women_velvet_khussa_1790645225308.jpg', category: 'Footwear & Bags' },
  { label: 'Men Brown Norozi Chappal', url: '/src/assets/images/men_brown_norozi_chappal_1790647779090.jpg', category: 'Footwear & Bags' },
  { label: 'Men Suede Mule Chappal', url: '/src/assets/images/men_suede_peshawari_mule_1790647845169.jpg', category: 'Footwear & Bags' },
  { label: 'Men Black Zalmi Chappal', url: '/src/assets/images/men_zalmi_black_chappal_1790647834471.jpg', category: 'Footwear & Bags' },
  { label: 'Artisanal Textured Bucket Bag', url: '/src/assets/images/acc_bucket_bag_1790645254422.jpg', category: 'Footwear & Bags' },
  { label: 'Printed Pure Silk Stole', url: '/src/assets/images/acc_printed_silk_scarf_1790645290208.jpg', category: 'Footwear & Bags' },
  { label: 'Handcrafted Kundan Choker Set', url: '/src/assets/images/acc_kundan_jewellery_1790645277517.jpg', category: 'Footwear & Bags' },
];

interface LuxuryAssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUrl?: string;
  onSelectImage: (url: string) => void;
}

export const LuxuryAssetPickerModal: React.FC<LuxuryAssetPickerModalProps> = ({
  isOpen,
  onClose,
  selectedUrl,
  onSelectImage,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredAssets = LUXURY_ASSET_GALLERY.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs font-sans text-neutral-900">
      <div
        className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                Luxury Product Media Catalog
              </h3>
              <p className="text-[11px] text-neutral-400">
                Click any photoshoot asset below to set it instantly as your product photo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Category tabs + Search */}
        <div className="p-3 bg-neutral-950/70 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Women', 'Men', 'Fragrance & Beauty', 'Teens', 'Footwear & Bags'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-64 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search photo asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredAssets.map((asset, idx) => {
              const isSelected = selectedUrl === asset.url;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectImage(asset.url);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer bg-neutral-950 flex flex-col ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20'
                      : 'border-neutral-800 hover:border-neutral-600 hover:shadow-md'
                  }`}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900 relative">
                    <img
                      src={asset.url}
                      alt={asset.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/70 text-neutral-200 backdrop-blur-xs">
                      {asset.category}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <div className="font-semibold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                      {asset.label}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate mt-0.5">
                      {asset.url.split('/').pop()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No photo assets found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span>{filteredAssets.length} high-resolution brand assets</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
