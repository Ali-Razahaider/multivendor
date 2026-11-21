import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BadgeCheck, Heart, MessageCircle, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';
import Ratings from '../Ratings';
import server from '../../server';
import { addToCart } from '../../redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../redux/actions/wishlistActions';
import { apiError } from '../../lib/api';
import {
  discountPercent,
  formatPrice,
  hasDiscount,
  onImageError,
  productImages,
  sellingPrice,
  sizedImage,
  toCartItem,
  type Product,
} from '../../lib/product';
import { categoriesData } from '../../static/data';

const MAX_QTY = 20;

const Gallery = ({ product }: { product: Product }) => {
  const images = productImages(product);
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none sm:flex-col">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={active === i}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-20 sm:w-20 ${active === i ? 'ring-brand-500' : 'ring-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={sizedImage(src, 200)} onError={onImageError} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 overflow-hidden rounded-3xl bg-slate-100">
        <img src={sizedImage(images[active], 1100)} onError={onImageError} alt={product.name} className="aspect-square w-full object-cover" />
        {hasDiscount(product) && <span className="badge absolute left-4 top-4 bg-rose-500 px-3 py-1 text-sm text-white">−{discountPercent(product)}%</span>}
      </div>
    </div>
  );
};

const ProductDetails = ({ data }: { data: Product | null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state: any) => state.wishlist);
  const { cart } = useSelector((state: any) => state.cart);
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const { isSeller } = useSelector((state: any) => state.seller);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  const [contacting, setContacting] = useState(false);

  if (!data) return null;

  const stock = data.countInStock ?? 0;
  const inCart = cart?.find((i: { _id: string; qty: number }) => i._id === data._id)?.qty ?? 0;
  const maxQty = Math.max(0, Math.min(stock, MAX_QTY) - inCart);
  const isWishlisted = wishlist?.some((i: Product) => i._id === data._id);
  const reviews = data.reviews || [];
  const shopId = data.shop?._id || data.shopId;
  const category = categoriesData.find((c) => c.title === data.category);

  const add = (goToCheckout = false) => {
    if (maxQty < 1) {
      toast.info(stock < 1 ? 'This item is sold out' : 'You already have the maximum quantity in your cart');
      return;
    }
    dispatch(addToCart(toCartItem(data, inCart + Math.min(qty, maxQty))) as any);
    if (goToCheckout) navigate(isAuthenticated ? '/checkout' : '/login?redirect=/checkout');
    else toast.success('Added to your cart');
  };

  const messageSeller = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setContacting(true);
    try {
      await axios.post(`${server}conversation/create-new-conversation`, { sellerId: shopId });
      navigate('/inbox');
    } catch (err) {
      toast.error(apiError(err, 'Couldn’t start a conversation'));
    } finally {
      setContacting(false);
    }
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/products" className="hover:text-slate-800">Products</Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/products?category=${encodeURIComponent(category.title)}`} className="hover:text-slate-800">{category.displayTitle}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Gallery product={data} />

        <div>
          {data.shop?.name && (
            <Link to={`/shop/preview/${shopId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
              <Store size={15} aria-hidden="true" /> {data.shop.name}
            </Link>
          )}
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{data.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Ratings rating={data.ratings ?? 0} showValue />
            <button type="button" onClick={() => setTab('reviews')} className="hover:underline">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </button>
            {(data.totalSell ?? 0) > 0 && <span>· {data.totalSell} sold</span>}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(sellingPrice(data))}</span>
            {hasDiscount(data) && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatPrice(data.price)}</span>
                <span className="badge bg-rose-50 text-rose-600">Save {formatPrice(data.price - sellingPrice(data))}</span>
              </>
            )}
          </div>

          <p className={`mt-3 text-sm font-medium ${stock > 5 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
            {stock > 5 ? 'In stock' : stock > 0 ? `Only ${stock} left — order soon` : 'Sold out'}
          </p>

          {!isSeller && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 items-center rounded-xl ring-1 ring-slate-200" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid h-12 w-11 place-items-center text-slate-600 disabled:opacity-40">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(Math.max(maxQty, 1), q + 1))} disabled={qty >= maxQty} className="grid h-12 w-11 place-items-center text-slate-600 disabled:opacity-40">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isWishlisted) dispatch(removeFromWishlist(data._id) as any);
                    else {
                      dispatch(addToWishlist({ ...data }) as any);
                      toast.success('Saved to your wishlist');
                    }
                  }}
                  aria-pressed={isWishlisted}
                  className="btn-secondary h-12"
                >
                  <Heart size={18} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => add(false)} disabled={stock < 1} className="btn-dark h-12 text-base">
                  <ShoppingBag size={18} /> Add to cart
                </button>
                <button type="button" onClick={() => add(true)} disabled={stock < 1} className="btn-primary h-12 text-base">
                  Buy now
                </button>
              </div>
              {inCart > 0 && <p className="text-sm text-slate-500">{inCart} already in your cart.</p>}
            </div>
          )}

          <ul className="mt-8 grid gap-3 rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-700 sm:grid-cols-3">
            <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-brand-600" /> Secure checkout</li>
            <li className="flex items-center gap-2"><Truck size={18} className="text-brand-600" /> Tracked delivery</li>
            <li className="flex items-center gap-2"><RotateCcw size={18} className="text-brand-600" /> Refunds after delivery</li>
          </ul>

          {data.shop?.name && (
            <div className="card mt-6 flex items-center gap-4 p-4">
              <img src={data.shop.avatar} onError={onImageError} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{data.shop.name}</p>
                <Link to={`/shop/preview/${shopId}`} className="text-sm text-brand-700 hover:underline">Visit shop</Link>
              </div>
              {!isSeller && (
                <button type="button" onClick={messageSeller} disabled={contacting} className="btn-secondary">
                  <MessageCircle size={17} /> Message
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="mt-14" aria-label="Product information">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 scrollbar-none" role="tablist">
          {([
            ['details', 'Description'],
            ['reviews', `Reviews (${reviews.length})`],
            ['shipping', 'Shipping & returns'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="py-8" role="tabpanel">
          {tab === 'details' && (
            <div className="max-w-3xl whitespace-pre-line leading-relaxed text-slate-700">{data.description}</div>
          )}

          {tab === 'reviews' && (
            <div className="max-w-3xl">
              {reviews.length === 0 ? (
                <p className="text-slate-600">No reviews yet. Reviews come from verified buyers after their order is delivered.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {reviews.map((r, i) => (
                    <li key={i} className="flex gap-4 py-5">
                      <img src={r.user?.avatar?.url} onError={onImageError} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">{r.user?.name || 'Shopper'}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><BadgeCheck size={14} /> Verified purchase</span>
                        </div>
                        <Ratings rating={r.rating} size={14} className="mt-1" />
                        {r.comment && <p className="mt-2 text-slate-700">{r.comment}</p>}
                        {r.createdAt && <p className="mt-1 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'shipping' && (
            <div className="max-w-3xl space-y-3 text-slate-700">
              <p>Each shop ships its own items, so a multi-shop cart arrives in separate parcels with their own tracking.</p>
              <p>Shipping is calculated at checkout. Pay by card through Stripe or choose cash on delivery.</p>
              <p>Once an order is delivered you can request a refund from your order page; the seller reviews each request and card refunds go back to the original card.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
