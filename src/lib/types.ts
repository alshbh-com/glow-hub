export type Shade = { name: string; hex: string };

export type Product = {
  id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  images: string[];
  shades: Shade[];
  sizes: string[];
  stock: number;
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
};

export type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
};

export type Governorate = {
  id: string;
  name_ar: string;
  name_en: string;
  shipping_cost: number;
};

// Tries to give each color name a visible hex. Falls back to a neutral.
const ARABIC_COLOR_MAP: Record<string, string> = {
  "أحمر": "#c0392b",
  "وردي": "#e91e63",
  "نبيتي": "#722f37",
  "أسود": "#111111",
  "بني": "#6b3a1e",
  "أزرق": "#1e63b8",
  "أخضر": "#2e8b57",
  "أصفر": "#f5c518",
  "ذهبي": "#d4af37",
  "فضي": "#c0c0c0",
  "أبيض": "#f5f5f5",
  "بيج": "#d8b48a",
  "برتقالي": "#e8722c",
  "بنفسجي": "#7e57c2",
};

function colorToHex(name: string): string {
  const trimmed = (name || "").trim();
  return ARABIC_COLOR_MAP[trimmed] || "#9b6b7a";
}

function slugify(s: string): string {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

// Normalize a row from the actual `products` table (admin-managed schema)
// into the shape the storefront expects.
export function mapRowToProduct(row: any): Product {
  const images: string[] = [];
  if (Array.isArray(row?.product_images)) {
    for (const im of row.product_images) if (im?.image_url) images.push(im.image_url);
  }
  if (row?.image_url && !images.includes(row.image_url)) images.unshift(row.image_url);

  const colors: string[] = Array.isArray(row?.color_options) ? row.color_options : [];
  const sizes: string[] = Array.isArray(row?.size_options) ? row.size_options : [];

  const price = Number(row?.discount_price ?? row?.offer_price ?? row?.price ?? 0);
  const compareAt = (row?.discount_price || row?.offer_price) ? Number(row?.price ?? 0) : null;

  return {
    id: row.id,
    category_id: row.category_id ?? null,
    name_ar: row.name_ar || row.name || "",
    name_en: row.name_en || "",
    description_ar: row.description_ar ?? row.description ?? null,
    description_en: row.description_en ?? null,
    price,
    compare_at_price: compareAt && compareAt > price ? compareAt : null,
    sku: null,
    images,
    shades: colors.map((c) => ({ name: c, hex: colorToHex(c) })),
    sizes,
    stock: Number(row?.stock ?? row?.stock_quantity ?? 0),
    is_bestseller: !!row?.is_featured,
    is_new: !!row?.is_offer,
    is_active: true,
  };
}

export function mapRowToCategory(row: any): Category {
  const name = row?.name || row?.name_ar || "";
  return {
    id: row.id,
    name_ar: name,
    name_en: row?.name_en || "",
    slug: row?.slug || slugify(row?.name_en || name) || row.id,
    image_url: row?.image_url ?? null,
  };
}
