import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingBag, Store } from 'lucide-react';
import Ratings from '../Ratings';
import { addToCart } from '../../redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../redux/actions/wishlistActions';
import {
  discountPercent,
  formatPrice,
  hasDiscount,
  inStock,
  onImageError,
  productImage,
  productUrl,
  sellingPrice,
  sizedImage,
  toCartItem,
  type Product,
} from '../../lib/product';

const ProductCard = ({ data }: { data: Product }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state: any) => state.wishlist);
  const { isSeller } = useSelector((state: any) => state.seller);
  const isWishlisted = wishlist?.some((i: Product) => i._id === data._id);
  const available = inStock(data);
  const lowStock = available && (data.countInStock ?? 0) <= 5;
  const url = productUrl(data);

  const handleAddToCart = () => {
    dispatch(addToCart(toCartItem(data)) as any);
    toast.success(`Added “${data.name}” to your cart`);
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(data._id) as any);
    } else {
      dispatch(addToWishlist({ ...data }) as any);
      toast.success('Saved to your wishlist');
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-(--shadow-card) transition-shadow duration-300 hover:shadow-(--shadow-lift)">
      <Link to={url} className="relative block aspect-square overflow-hidden bg-slate-100" tabIndex={-1} aria-hidden="true">
        <img
          src={sizedImage(productImage(data), 500)}
          onError={onImageError}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasDiscount(data) && <span className="badge bg-rose-500 text-white shadow-sm">−{discountPercent(data)}%</span>}
          {!available && <span className="badge bg-slate-900/85 text-white">Sold out</span>}
          {lowStock && <span className="badge bg-amber-100 text-amber-800">Only {data.countInStock} left</span>}
        </div>
      </Link>

      {!isSeller && (
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? `Remove ${data.name} from wishlist` : `Save ${data.name} to wishlist`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:text-rose-500"
        >
          <Heart size={18} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      )}

      <div className="flex flex-1 flex-col p-4">
        {data.shop?.name && (
          <p className="mb-1 flex items-center gap-1 truncate text-xs font-medium text-slate-500">
            <Store size={12} aria-hidden="true" />
            {data.shop.name}
          </p>
        )}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
          <Link to={url} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {data.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Ratings rating={data.ratings ?? 0} size={14} />
          {(data.totalSell ?? 0) > 0 && <span>{data.totalSell} sold</span>}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">{formatPrice(sellingPrice(data))}</span>
            {hasDiscount(data) && <span className="text-xs text-slate-400 line-through">{formatPrice(data.price)}</span>}
          </div>
          {!isSeller && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!available}
              aria-label={`Add ${data.name} to cart`}
              className="relative z-10 inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-500"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{available ? 'Add' : 'Sold out'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
    <div className="skeleton aspect-square rounded-none" />
    <div className="space-y-2 p-4">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton mt-4 h-9 w-full" />
    </div>
  </div>
);

export const ProductGrid = ({
  products,
  loading,
  skeletons = 8,
  className = '',
}: {
  products: Product[];
  loading?: boolean;
  skeletons?: number;
  className?: string;
}) => (
  <div className={`grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
    {loading
      ? Array.from({ length: skeletons }, (_, i) => <ProductCardSkeleton key={i} />)
      : products.map((p) => <ProductCard key={p._id} data={p} />)}
  </div>
);

export default ProductCard;
