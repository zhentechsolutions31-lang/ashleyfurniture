export type Badge = "exclusive" | "luxe" | "sale" | "new" | "best-seller";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Variant {
  id: string;
  label: string;
  options: Record<string, string>;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  categoryPath: string[];
  styles: string[];
  colors: string[];
  materials: string[];
  features: string[];
  badges: Badge[];
  price: number;
  originalPrice?: number;
  priceMax?: number;
  priceLabel?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
  shortFeatures: string[];
  description: string;
  includes?: string;
  assembly?: string;
  dimensions?: { width: number; depth: number; height: number; unit: "in"; weight?: number };
  care?: string;
  images: ProductImage[];
  variants?: Variant[];
}

export interface CategoryChild {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  description: string;
  children: CategoryChild[];
}

export interface CartItem {
  key: string;
  productId: string;
  variantId?: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;
  qty: number;
  variantLabel?: string;
  previousUnitPrice?: number;
}

export interface Promo {
  code: string;
  type: "percent" | "fixed" | "ship";
  value: number;
  minSubtotal: number;
  label: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface DeliveryDetails {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  deliveryMethod: "standard" | "pickup";
  paymentMethod: "delivery" | "demo-card";
}

export interface Order {
  id: string;
  items: CartItem[];
  totals: Totals;
  delivery: DeliveryDetails;
  createdAt: string;
  status: "Confirmed";
}
