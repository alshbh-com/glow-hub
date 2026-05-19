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
