import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Drawer from '../Cart/Drawer';
import { addToCart } from '../../redux/actions/cartActions';
import { removeFromWishlist } from '../../redux/actions/wishlistActions';
import {
  formatPrice,
  hasDiscount,
  inStock,
  isObjectId,
  onImageError,
  productImage,
  productUrl,
  sellingPrice,
  sizedImage,
  toCartItem,
  type Product,
} from '../../lib/product';

const Wishlist = ({ setOpenWishlist }: { setOpenWishlist: (open: boolean) => void }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state: any) => state.wishlist) as { wishlist: Product[] };
  const close = () => setOpenWishlist(false);

  const moveToCart = (p: Product) => {
    dispatch(addToCart(toCartItem(p)) as any);
    dispatch(removeFromWishlist(p._id) as any);
    toast.success(`Moved “${p.name}” to your cart`);
  };

  return (
    <Drawer title={`Wishlist${wishlist.length ? ` (${wishlist.length})` : ''}`} onClose={close}>
      {wishlist.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <Heart size={28} />
          </span>
          <p className="text-lg font-semibold text-slate-900">No saved items yet</p>
          <p className="text-sm text-slate-500">Tap the heart on any product to save it for later.</p>
          <Link to="/products" onClick={close} className="btn-primary mt-2">
            Discover products
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {wishlist.map((p) => {
            const purchasable = isObjectId(p._id) && inStock(p);
            return (
              <li key={p._id} className="flex gap-4 p-5">
                <Link to={productUrl(p)} onClick={close} className="shrink-0">
                  <img src={sizedImage(productImage(p), 200)} onError={onImageError} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={productUrl(p)} onClick={close} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-700">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm">
                    <span className="font-bold text-slate-900">{formatPrice(sellingPrice(p))}</span>
                    {hasDiscount(p) && <span className="ml-2 text-xs text-slate-400 line-through">{formatPrice(p.price)}</span>}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" disabled={!purchasable} onClick={() => moveToCart(p)} className="btn-primary h-9 px-3 text-xs">
                      <ShoppingBag size={14} /> {purchasable ? 'Move to cart' : 'Unavailable'}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name} from wishlist`}
                      onClick={() => dispatch(removeFromWishlist(p._id) as any)}
                      className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
};

export default Wishlist;
