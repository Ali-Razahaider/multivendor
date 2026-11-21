// Shared helpers for presenting products consistently across the storefront.

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  images?: (string | { url: string })[];
  category?: string;
  countInStock?: number;
  tags?: string;
  ratings?: number;
  totalSell?: number;
  reviews?: { user?: { _id?: string; name?: string; avatar?: { url?: string } }; rating: number; comment?: string; createdAt?: string }[];
  shopId?: string;
  shop?: { _id?: string; name?: string; avatar?: string };
  createdAt?: string;
};

const usable = (url?: string) =>
  typeof url === 'string' && url.length > 0 && !url.includes('loremflickr') && !url.startsWith('/uploads');

export const productImages = (p?: Partial<Product> | null): string[] => {
  const urls = (p?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(usable) as string[];
  return urls.length ? urls : [FALLBACK_IMAGE];
};

export const productImage = (p?: Partial<Product> | null) => productImages(p)[0];

/** Resize Unsplash images to the size actually rendered. */
export const sizedImage = (url: string, width: number) =>
  url.includes('images.unsplash.com') ? url.replace(/([?&])w=\d+/, `$1w=${width}`) : url;

export const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = FALLBACK_IMAGE;
};

export const hasDiscount = (p: Partial<Product>) =>
  !!p.discountedPrice && !!p.price && p.discountedPrice > 0 && p.discountedPrice < p.price;

export const sellingPrice = (p: Partial<Product>) => (hasDiscount(p) ? (p.discountedPrice as number) : p.price || 0);

export const discountPercent = (p: Partial<Product>) =>
  hasDiscount(p) ? Math.round(((p.price! - p.discountedPrice!) / p.price!) * 100) : 0;

export const productUrl = (p: Pick<Product, '_id'>) => `/product/${p._id}`;

export const isObjectId = (value?: string) => !!value && /^[a-f\d]{24}$/i.test(value);

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (n: number | string | undefined | null) => currency.format(Number(n) || 0);

export const inStock = (p: Partial<Product>) => (p.countInStock ?? 0) > 0;

/** Matches a product against a free-text query (name, tags, category, shop). */
export const matchesQuery = (p: Product, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.name, p.tags, p.category, p.shop?.name].some((field) => field?.toLowerCase().includes(q));
};

/** Item shape stored in the cart (prices are display-only; the server re-prices). */
export type CartItem = {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  shopId?: string;
  shopName?: string;
  stock: number;
  qty: number;
};

export const toCartItem = (p: Product, qty = 1): CartItem => ({
  _id: p._id,
  name: p.name,
  price: p.price,
  discountedPrice: hasDiscount(p) ? p.discountedPrice : undefined,
  image: productImage(p),
  shopId: p.shopId,
  shopName: p.shop?.name,
  stock: p.countInStock ?? 0,
  qty,
});
