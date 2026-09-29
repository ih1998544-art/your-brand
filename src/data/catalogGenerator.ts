import { Product, ProductTab, CategoryKey } from '../types';

// Pool of high-resolution luxury photoshoot assets
const FOOTWEAR_IMAGES = [
  '/src/assets/images/women_khussa_footwear_1790621932657.jpg',
  '/src/assets/images/women_kolhapuri_shoes_1790621997863.jpg',
  '/src/assets/images/women_heeled_sandals_1790645121587.jpg',
  '/src/assets/images/women_mules_footwear_1790645133216.jpg',
  '/src/assets/images/women_bridal_khussa_1790645146302.jpg',
  '/src/assets/images/women_metallic_flats_1790645201788.jpg',
  '/src/assets/images/women_strap_stiletto_1790645214644.jpg',
  '/src/assets/images/women_velvet_khussa_1790645225308.jpg',
  '/src/assets/images/women_leather_sliders_1790645237534.jpg',
  '/src/assets/images/men_kaptaan_footwear_1790621961000.jpg',
  '/src/assets/images/men_peshawari_chappal_1790620226259.jpg',
];

const RTW_IMAGES = [
  '/src/assets/images/pk_girl_coords_1790618190382.jpg',
  '/src/assets/images/mannequin_plum_embroidered_1790645171231.jpg',
  '/src/assets/images/mannequin_turquoise_palazzo_1790645182047.jpg',
  '/src/assets/images/mannequin_sage_lawn_1790645319560.jpg',
  '/src/assets/images/pk_girl_readytowear_1790618208513.jpg',
  '/src/assets/images/coords_olive_linen_1790617801415.jpg',
  '/src/assets/images/printed_geometric_shirt_1790617839258.jpg',
  '/src/assets/images/model_mint_organza_1790617289893.jpg',
  '/src/assets/images/coords_chic_modern_1790617785166.jpg',
  '/src/assets/images/model_yellow_lawn_1790617306737.jpg',
  '/src/assets/images/prod_turquoise_lawn_kurta_1790618618751.jpg',
  '/src/assets/images/category_coords_1790615937204.jpg',
  '/src/assets/images/hero_lawn_coords_1790615890297.jpg',
  '/src/assets/images/hero_modern_coords_1790616778188.jpg',
];

const UNS_IMAGES = [
  '/src/assets/images/pk_girl_prewinter_1790618177313.jpg',
  '/src/assets/images/noya_luxury_unstitched_1790617815906.jpg',
  '/src/assets/images/cat_unstitched_1790616238017.jpg',
  '/src/assets/images/pk_girl_unstitched_1790618224088.jpg',
  '/src/assets/images/printed_floral_lawn_1790617827966.jpg',
  '/src/assets/images/prod_teal_lawn_1790616804088.jpg',
  '/src/assets/images/prod_rose_khaddar_1790616815733.jpg',
  '/src/assets/images/model_iceblue_kurta_1790617340489.jpg',
  '/src/assets/images/noya_unstitched_1790615923472.jpg',
  '/src/assets/images/hero_emerald_velvet_regal_1790618579500.jpg',
];

const FRM_IMAGES = [
  '/src/assets/images/mannequin_maroon_velvet_1790645307280.jpg',
  '/src/assets/images/mannequin_black_chiffon_1790645331056.jpg',
  '/src/assets/images/mannequin_blush_anarkali_1790645341734.jpg',
  '/src/assets/images/hero_formals_1790615905526.jpg',
  '/src/assets/images/pk_girl_velvet_1790618254095.jpg',
  '/src/assets/images/pk_girl_formals_1790618240981.jpg',
  '/src/assets/images/model_copper_peshwas_1790617356912.jpg',
  '/src/assets/images/hero_ivory_gold_palace_1790618565665.jpg',
  '/src/assets/images/hero_rose_organza_fairytale_1790618594563.jpg',
  '/src/assets/images/hero_sapphire_silk_modern_1790618607545.jpg',
  '/src/assets/images/women_velvet_peshwas_couture_1790621946851.jpg',
  '/src/assets/images/hero_festive_velvet_1790616791857.jpg',
  '/src/assets/images/model_blush_festive_1790617326703.jpg',
];

const ACC_IMAGES = [
  '/src/assets/images/accessories_tote_leather_1790645157345.jpg',
  '/src/assets/images/acc_bucket_bag_1790645254422.jpg',
  '/src/assets/images/acc_evening_clutch_1790645265951.jpg',
  '/src/assets/images/acc_kundan_jewellery_1790645277517.jpg',
  '/src/assets/images/acc_printed_silk_scarf_1790645290208.jpg',
  '/src/assets/images/banner_bags_1790616283848.jpg',
  '/src/assets/images/bag_luxury_only_1790618153318.jpg',
  '/src/assets/images/cat_artisanal_1790616270354.jpg',
  '/src/assets/images/hero_couture_luxe_1790616763503.jpg',
  '/src/assets/images/hero_festive_velvet_1790616791857.jpg',
];

// Rich style descriptors to dynamically generate limitless unique fashion articles
const FOOTWEAR_NAMES = [
  'Royal Zari Embroidered Silk Khussa',
  'Gilded Tilla Cutwork Kolhapuri Chappal',
  'Rose-Gold Crystal Ankle Strap Sandals',
  'Midnight Navy Velvet Pointed Mules',
  'Ivory Seed Pearl Handcrafted Bridal Jutti',
  'Champagne Shimmer Block Heel Festive Sandals',
  'Antique Gold Dabka Embellished Khussa',
  'Artisan Hand-Woven Saddle Leather Slides',
  'Crystalline Sheer Evening Stiletto Mules',
  'Heritage Charsadda Full-Grain Leather Chappal',
  'Emerald Velvet D’Orsay Ethnic Flats',
  'Crimson Resham Embroidered Bridal Khussa',
  'Cognac Woven Calfskin Slip-On Loafers',
  'Blush Pink Pearl Trimmed Block Heels',
  'Silver Mirrorwork Festive Flat Sandals',
];

const RTW_NAMES = [
  'Lilac Mist Embroidered Lawn Co-Ord Set',
  'Sunlit Ochre Printed Cotton Kurta',
  'Midnight Indigo Jacquard 2-Piece Tunic',
  'Pearl White Chikankari Long Shirt with Culottes',
  'Emerald Silk Tunic with Scalloped Hem',
  'Dusty Rose Linen Mandarin Collar Co-Ord',
  'Terracotta Block Print Summer Shirt',
  'Charcoal Noir Slub Cotton Kurta Trouser',
  'Olive & Mustard Geometric Printed Lawn Suit',
  'Sky Blue Embroidered Bell Sleeve Kurta',
  'Desert Sand Asymmetric Tailored Co-Ord',
  'Crimson Red Zari Embroidered 2-Piece Ensemble',
];

const UNS_NAMES = [
  'Sapphire Pure Silk Jacquard 3-Piece Unstitched',
  'Pastel Coral Chiffon Dupatta Lawn Suit',
  'Smoky Quartz Karandi Embroidered 2-Piece',
  'Mughal Garden Digital Print Cotton Fabric',
  'Warm Mocha Spun Khaddar Shawl Suit',
  'Forest Green Schiffli Embroidered Lawn Edition',
  'Ivory & Gold Latha Festive 3-Piece Fabric',
  'Vintage Rust Resham Threadwork 3-Piece',
  'Plum Velvet Shawl Luxury Unstitched Suit',
  'Almond Cream Cotton Jacquard Suit with Voile Dupatta',
];

const FRM_NAMES = [
  'Ruby Wine Velvet Kalidar Embroidered Peshwas',
  'Celestial Silver Sequin Shimmer Evening Gown',
  'Imperial Emerald Zardozi Dabka Angrakha',
  'Gilded Copper Tissue Tiered Anarkali Gown',
  'Powder Blue Organza Embroidered Festive Ensemble',
  'Rose Gold Tissue Flared Formal Peshwas',
  'Deep Amethyst Velvet Floor-Length Farshi Gown',
  'Ivory Palace Embroidered Chiffon Formal Maxi',
  'Sunset Peach Organza Handcrafted Kalidar',
  'Royal Navy Blue Raw Silk Couture Peshwas',
];

const ACC_NAMES = [
  'Cognac Italian Calfskin Shoulder Bag',
  'Fluted Nappa Leather Mini Bucket Bag',
  'Hand-Embroidered Raw Silk Box Minaudière',
  'Antique 22k Gold Micron Plated Kundan Choker',
  'Heritage Floral Pure Twill Silk Scarf',
  'Quilted Velvet Compact Bowling Duffle',
  'Structured Saffiano Crossbody Satchel',
  'Royal Chandbali Seed Pearl Jhumkas',
  'Hammered 22k Gold Statement Bangle Cuff',
  'Embroidered Velvet Zari Festive Potli Purse',
];

const COLOR_PALETTES = [
  '#f3d3b8,#d98b6b,#fff3e6',
  '#581845,#900c3f,#fff0f5',
  '#1abc9c,#16a085,#e8f8f5',
  '#9ab89e,#557a5b,#f4f8f4',
  '#e6d3a3,#c5a059,#fcfaf5',
  '#097969,#04433a,#e6f7f4',
  '#b3672b,#703b0d,#fbf4ee',
  '#d4a373,#a67c52,#faedcd',
  '#4a0e17,#2a040a,#fbebef',
  '#111111,#333333,#e0e0e0',
  '#f8c8dc,#d8829d,#fff0f5',
  '#2b2b30,#0f0f12,#d8d8e0',
  '#37b5b0,#1c7a78,#e0fbf8',
];

const FABRICS = {
  footwear: [
    'Pure Buffed Leather & Zari',
    'Genuine Calfskin Leather',
    'Metallic Shimmer & Crystals',
    'Micro Velvet 9000 & Zardozi',
    'Raw Silk & Seed Pearls',
    'Vegetable-Tanned Cowhide',
  ],
  rtw: [
    'Fine Pima Lawn',
    'Breathable Cotton Slub',
    'Mercerized Lawn',
    'Pure Pre-Washed Linen',
    'Pure Raw Silk',
    'Cotton Jacquard',
  ],
  uns: [
    'Signature 80s Lawn with Voile Dupatta',
    'Warm Spun Khaddar & Wool Shawl',
    'Textured Winter Karandi',
    'Pure Raw Silk & Organza Shawl',
    'Chanderi Silk & Chiffon Dupatta',
  ],
  frm: [
    'Micro Velvet 9000 & Zari',
    'Pure Crinkle Chiffon & Silk Lining',
    'Shimmer Organza & Satin Silk',
    'Metallic Tissue & Grip Silk',
    'Pure Raw Silk 80g',
  ],
  accessories: [
    'Smooth Calfskin Leather & Gold Hardware',
    'Supple Nappa Leather',
    'Pure Raw Silk & Pearl Clasp',
    '22k Gold Micron Plating & Kundan',
    '100% Pure Twill Silk (14 Momme)',
  ],
};

/**
 * Generates an arbitrary number of unique new products for any category.
 * Used for unlimited images and infinite catalog scrolling.
 */
export function generateMoreProductsForCategory(
  category: ProductTab,
  count: number = 10,
  currentLength: number = 10
): Product[] {
  const result: Product[] = [];

  for (let i = 0; i < count; i++) {
    const itemNumber = currentLength + i + 1;
    let name = '';
    let categoryKey: CategoryKey = 'coord';
    let fabric = '';
    let sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
    let price = 5990;
    let originalPrice: number | undefined = undefined;
    let imageUrl = '';
    let details = '';

    const colorPalette = COLOR_PALETTES[(itemNumber * 7) % COLOR_PALETTES.length];

    if (category === 'footwear') {
      name = FOOTWEAR_NAMES[(itemNumber - 1) % FOOTWEAR_NAMES.length] + ` (Ed. ${itemNumber})`;
      categoryKey = 'footwear';
      fabric = FABRICS.footwear[(itemNumber) % FABRICS.footwear.length];
      sizes = ['36', '37', '38', '39', '40', '41'];
      price = 3990 + ((itemNumber * 370) % 4500);
      imageUrl = FOOTWEAR_IMAGES[(itemNumber - 1) % FOOTWEAR_IMAGES.length];
      details = 'Handcrafted artisan footwear featuring cushioned arch padding, flexible leather sole, and delicate embroidery.';
    } else if (category === 'accessories') {
      name = ACC_NAMES[(itemNumber - 1) % ACC_NAMES.length] + ` (Ed. ${itemNumber})`;
      categoryKey = 'accessories';
      fabric = FABRICS.accessories[(itemNumber) % FABRICS.accessories.length];
      sizes = itemNumber % 2 === 0 ? ['Standard / One Size'] : ['Medium', 'Large'];
      price = 4490 + ((itemNumber * 530) % 8500);
      imageUrl = ACC_IMAGES[(itemNumber - 1) % ACC_IMAGES.length];
      details = 'Exclusive luxury accessory designed with heritage motifs, premium finishes, and meticulous craftsmanship.';
    } else if (category === 'uns') {
      name = UNS_NAMES[(itemNumber - 1) % UNS_NAMES.length] + ` (Ed. ${itemNumber})`;
      categoryKey = 'dupatta';
      fabric = FABRICS.uns[(itemNumber) % FABRICS.uns.length];
      sizes = itemNumber % 2 === 0 ? ['Unstitched (3-Piece)'] : ['Unstitched (2-Piece)'];
      price = 6490 + ((itemNumber * 490) % 9500);
      imageUrl = UNS_IMAGES[(itemNumber - 1) % UNS_IMAGES.length];
      details = 'Unstitched luxury fabric pack with embroidered front, border patches, dyed trousers, and designer dupatta.';
    } else if (category === 'frm') {
      name = FRM_NAMES[(itemNumber - 1) % FRM_NAMES.length] + ` (Ed. ${itemNumber})`;
      categoryKey = 'gown';
      fabric = FABRICS.frm[(itemNumber) % FABRICS.frm.length];
      sizes = ['XS', 'S', 'M', 'L', 'XL'];
      price = 22990 + ((itemNumber * 980) % 18000);
      imageUrl = FRM_IMAGES[(itemNumber - 1) % FRM_IMAGES.length];
      details = 'Royal formal couture piece adorned with hand-stitched zardozi, tilla, sequins, and sheer organza drapery.';
    } else if (category === 'sale') {
      const baseName = RTW_NAMES[(itemNumber - 1) % RTW_NAMES.length];
      const discountPct = 15 + ((itemNumber * 5) % 35); // 15% to 45%
      const orig = 8990 + ((itemNumber * 400) % 15000);
      price = Math.round(orig * (1 - discountPct / 100));
      originalPrice = orig;
      name = `${baseName} (${discountPct}% OFF)`;
      categoryKey = 'coord';
      fabric = 'Premium Mercerized Cotton & Silk';
      sizes = ['S', 'M', 'L', 'XL'];
      imageUrl = RTW_IMAGES[(itemNumber - 1) % RTW_IMAGES.length];
      details = `Special promotional price: ${discountPct}% off retail. Limited stock available.`;
    } else if (category === 'new') {
      // Mixed seasonal new arrival
      if (itemNumber % 3 === 0) {
        name = FOOTWEAR_NAMES[(itemNumber - 1) % FOOTWEAR_NAMES.length] + ` (New Drop)`;
        categoryKey = 'footwear';
        fabric = FABRICS.footwear[(itemNumber) % FABRICS.footwear.length];
        sizes = ['36', '37', '38', '39', '40'];
        price = 4890 + ((itemNumber * 250) % 3500);
        imageUrl = FOOTWEAR_IMAGES[(itemNumber - 1) % FOOTWEAR_IMAGES.length];
      } else if (itemNumber % 3 === 1) {
        name = RTW_NAMES[(itemNumber - 1) % RTW_NAMES.length] + ` (New Drop)`;
        categoryKey = 'coord';
        fabric = FABRICS.rtw[(itemNumber) % FABRICS.rtw.length];
        sizes = ['XS', 'S', 'M', 'L', 'XL'];
        price = 7990 + ((itemNumber * 420) % 5000);
        imageUrl = RTW_IMAGES[(itemNumber - 1) % RTW_IMAGES.length];
      } else {
        name = ACC_NAMES[(itemNumber - 1) % ACC_NAMES.length] + ` (New Drop)`;
        categoryKey = 'accessories';
        fabric = FABRICS.accessories[(itemNumber) % FABRICS.accessories.length];
        sizes = ['One Size'];
        price = 5490 + ((itemNumber * 610) % 7000);
        imageUrl = ACC_IMAGES[(itemNumber - 1) % ACC_IMAGES.length];
      }
      details = 'Newly added to our signature collection with seasonal palette and artisanal embroidery.';
    } else if (category === 'trending') {
      name = (itemNumber % 2 === 0 ? RTW_NAMES : FRM_NAMES)[(itemNumber - 1) % 10] + ` (Trending)`;
      categoryKey = itemNumber % 2 === 0 ? 'coord' : 'gown';
      fabric = itemNumber % 2 === 0 ? 'Fine Pima Lawn' : 'Pure Chiffon & Silk';
      sizes = ['XS', 'S', 'M', 'L', 'XL'];
      price = 8490 + ((itemNumber * 720) % 16000);
      imageUrl = (itemNumber % 2 === 0 ? RTW_IMAGES : FRM_IMAGES)[(itemNumber - 1) % 10];
      details = 'High-demand trending ensemble chosen by our senior fashion stylists.';
    } else {
      // 'rtw'
      name = RTW_NAMES[(itemNumber - 1) % RTW_NAMES.length] + ` (Vol. ${Math.floor(itemNumber / 10) + 1})`;
      categoryKey = 'kurta';
      fabric = FABRICS.rtw[(itemNumber) % FABRICS.rtw.length];
      sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      price = 6490 + ((itemNumber * 350) % 6000);
      imageUrl = RTW_IMAGES[(itemNumber - 1) % RTW_IMAGES.length];
      details = 'Tailored ready-to-wear silhouette crafted with meticulous stitching, refined cuts, and premium lawn fabrics.';
    }

    let productImages: string[] = [imageUrl];
    if (category === 'footwear') {
      const img2 = FOOTWEAR_IMAGES[(itemNumber) % FOOTWEAR_IMAGES.length];
      const img3 = FOOTWEAR_IMAGES[(itemNumber + 1) % FOOTWEAR_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'accessories') {
      const img2 = ACC_IMAGES[(itemNumber) % ACC_IMAGES.length];
      const img3 = ACC_IMAGES[(itemNumber + 1) % ACC_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'uns') {
      const img2 = UNS_IMAGES[(itemNumber) % UNS_IMAGES.length];
      const img3 = UNS_IMAGES[(itemNumber + 1) % UNS_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'frm') {
      const img2 = FRM_IMAGES[(itemNumber) % FRM_IMAGES.length];
      const img3 = FRM_IMAGES[(itemNumber + 1) % FRM_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'sale') {
      const img2 = RTW_IMAGES[(itemNumber) % RTW_IMAGES.length];
      const img3 = RTW_IMAGES[(itemNumber + 1) % RTW_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'new') {
      const pool = itemNumber % 3 === 0 ? FOOTWEAR_IMAGES : itemNumber % 3 === 1 ? RTW_IMAGES : ACC_IMAGES;
      const img2 = pool[(itemNumber) % pool.length];
      const img3 = pool[(itemNumber + 1) % pool.length];
      productImages = [imageUrl, img2, img3];
    } else if (category === 'trending') {
      const pool = itemNumber % 2 === 0 ? RTW_IMAGES : FRM_IMAGES;
      const img2 = pool[(itemNumber) % pool.length];
      const img3 = pool[(itemNumber + 1) % pool.length];
      productImages = [imageUrl, img2, img3];
    } else {
      const img2 = RTW_IMAGES[(itemNumber) % RTW_IMAGES.length];
      const img3 = RTW_IMAGES[(itemNumber + 1) % RTW_IMAGES.length];
      productImages = [imageUrl, img2, img3];
    }

    result.push({
      id: `${category}-gen-${itemNumber}`,
      name,
      price,
      originalPrice,
      categoryKey,
      colorPalette,
      tab: category,
      categorySlug: category,
      department: 'Woman',
      isNew: category === 'new' || itemNumber % 4 === 0,
      fabric,
      details,
      sizes,
      sku: `YB-${category.toUpperCase()}-${String(itemNumber).padStart(4, '0')}`,
      imageUrl,
      images: productImages,
    });
  }

  return result;
}
