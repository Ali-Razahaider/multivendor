import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Drawer from './Drawer';
import { removeFromCart, updateCartQty } from '../../redux/actions/cartActions';
import { formatPrice, onImageError, productUrl, sizedImage, FALLBACK_IMAGE, type CartItem } from '../../lib/product';

const unit = (i: CartItem) => (i.discountedPrice && i.discountedPrice < i.price ? i.discountedPrice : i.price);

const Cart = ({ setOpenCart }: { setOpenCart: (open: boolean) => void }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state: any) => state.cart) as { cart: CartItem[] };
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const close = () => setOpenCart(false);
  const subtotal = cart.reduce((s, i) => s + unit(i) * i.qty, 0);
  const count = cart.reduce((n, i) => n + i.qty, 0);

  const checkout = () => {
    close();
    navigate(isAuthenticated ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <Drawer
      title={`Your cart${count ? ` (${count})` : ''}`}
      onClose={close}
      footer={
        cart.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-slate-500">Shipping and discounts are calculated at checkout.</p>
            <button type="button" onClick={checkout} className="btn-primary h-12 w-full text-base">
              Checkout
            </button>
            <button type="button" onClick={close} className="btn-ghost w-full">
              Continue shopping
            </button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag size={28} />
          </span>
          <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
          <p className="text-sm text-slate-500">Find something you love and it will show up here.</p>
          <Link to="/products" onClick={close} className="btn-primary mt-2">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {cart.map((item) => {
            const max = Math.min(item.stock > 0 ? item.stock : 20, 20);
            return (
              <li key={item._id} className="flex gap-4 p-5">
                <Link to={productUrl(item)} onClick={close} className="shrink-0">
                  <img src={sizedImage(item.image || FALLBACK_IMAGE, 200)} onError={onImageError} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={productUrl(item)} onClick={close} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-700">
                    {item.name}
                  </Link>
                  {item.shopName && <p className="mt-0.5 truncate text-xs text-slate-500">{item.shopName}</p>}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-xl ring-1 ring-slate-200">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={item.qty <= 1}
                        onClick={() => dispatch(updateCartQty(item._id, item.qty - 1) as any)}
                        className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={item.qty >= max}
                        onClick={() => dispatch(updateCartQty(item._id, item.qty + 1) as any)}
                        className="grid h-8 w-8 place-items-center text-slate-600 disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatPrice(unit(item) * item.qty)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    {item.qty >= max && item.stock > 0 ? <span className="text-xs text-amber-700">Max available</span> : <span />}
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item._id) as any)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 size={13} /> Remove
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

export default Cart;
