import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown, Heart, LayoutGrid, Menu, Search, ShoppingBag, Store, User, X } from 'lucide-react';
import { categoriesData, navItems } from '../../static/data';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import Logo from '../brand/Logo';
import { useCatalog } from '../../hooks/useCatalog';
import { formatPrice, matchesQuery, onImageError, productImage, productUrl, sellingPrice, sizedImage } from '../../lib/product';

const CountBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

const SearchBox = ({ id, onDone }: { id: string; onDone?: () => void }) => {
  const navigate = useNavigate();
  const { products } = useCatalog();
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLFormElement>(null);
  const results = term.trim().length > 1 ? products.filter((p) => matchesQuery(p, term)).slice(0, 6) : [];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const finish = () => {
    setTerm('');
    setOpen(false);
    onDone?.();
  };

  return (
    <form
      ref={boxRef}
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (!term.trim()) return;
        navigate(`/products?q=${encodeURIComponent(term.trim())}`);
        finish();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        id={id}
        type="search"
        autoComplete="off"
        placeholder="Search products, brands and shops"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-24 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      />
      <button type="submit" className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700">
        Search
      </button>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-(--shadow-lift) animate-fade-in">
          {results.map((p) => (
            <Link key={p._id} to={productUrl(p)} onClick={finish} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 focus:bg-slate-50">
              <img src={sizedImage(productImage(p), 120)} onError={onImageError} alt="" className="h-11 w-11 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-800">{p.name}</span>
                <span className="block truncate text-xs text-slate-500">{p.shop?.name}</span>
              </span>
              <span className="text-sm font-semibold text-slate-900">{formatPrice(sellingPrice(p))}</span>
            </Link>
          ))}
          <button type="submit" className="mt-1 w-full rounded-xl p-2 text-left text-sm font-medium text-brand-700 hover:bg-brand-50">
            See all results for “{term.trim()}”
          </button>
        </div>
      )}
    </form>
  );
};

const CategoryMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
      >
        <LayoutGrid size={17} aria-hidden="true" />
        Categories
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[70] mt-2 grid w-[520px] grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-(--shadow-lift) animate-fade-in">
          {categoriesData.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${encodeURIComponent(c.title)}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
            >
              <img src={c.image_Url} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{c.displayTitle}</span>
                <span className="block text-xs text-slate-500">{c.subTitle}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ activeHeading }: { activeHeading?: number }) => {
  const { isAuthenticated, user } = useSelector((state: any) => state.user);
  const { isSeller, seller } = useSelector((state: any) => state.seller);
  const { cart } = useSelector((state: any) => state.cart);
  const { wishlist } = useSelector((state: any) => state.wishlist);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = (cart || []).reduce((n: number, i: { qty: number }) => n + (i.qty || 1), 0);
  const sellerLink = isSeller ? '/dashboard' : '/shop-create';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinkClass = (index: number) =>
    `relative inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium transition-colors ${
      activeHeading === index + 1 ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to content
      </a>

      <div className="hidden bg-slate-900 text-xs text-slate-300 800px:block">
        <div className="container-page flex h-9 items-center justify-between">
          <p>Secure checkout · Cash on delivery available · Easy returns on delivered orders</p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="hover:text-white">Help & FAQ</Link>
            <Link to={sellerLink} className="hover:text-white">{isSeller ? 'Seller dashboard' : 'Sell on Bazaarly'}</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'}`}>
        <div className="container-page flex h-16 items-center gap-3 800px:h-[72px] 800px:gap-6">
          <button type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} className="-ml-2 grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 800px:hidden">
            <Menu size={22} />
          </button>

          <Logo markClassName="h-8 w-8 800px:h-9 800px:w-9" textClassName="text-[1.35rem] 800px:text-[1.6rem]" />

          <div className="hidden flex-1 800px:block 800px:max-w-xl 1000px:max-w-2xl">
            <SearchBox id="search-desktop" />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link
              to={sellerLink}
              className="mr-2 hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 1000px:inline-flex"
            >
              <Store size={17} aria-hidden="true" />
              {isSeller ? 'My shop' : 'Start selling'}
            </Link>
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              aria-label={isAuthenticated ? 'My account' : 'Sign in'}
              className="hidden h-10 items-center gap-2 rounded-xl px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 800px:inline-flex"
            >
              {isAuthenticated && user?.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200" />
              ) : (
                <User size={20} />
              )}
              <span className="hidden max-w-[110px] truncate 1000px:inline">{isAuthenticated ? user?.name?.split(' ')[0] : 'Sign in'}</span>
            </Link>
            <button type="button" aria-label={`Wishlist, ${wishlist?.length || 0} items`} onClick={() => setOpenWishlist(true)} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100">
              <Heart size={21} />
              <CountBadge count={wishlist?.length || 0} />
            </button>
            <button type="button" aria-label={`Cart, ${cartCount} items`} onClick={() => setOpenCart(true)} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100">
              <ShoppingBag size={21} />
              <CountBadge count={cartCount} />
            </button>
          </div>
        </div>

        <div className="container-page pb-3 800px:hidden">
          <SearchBox id="search-mobile" />
        </div>

        <nav aria-label="Primary" className="hidden border-t border-slate-100 800px:block">
          <div className="container-page flex h-12 items-center gap-1">
            <CategoryMenu />
            <span className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />
            {navItems.map((item, index) => (
              <NavLink key={item.url} to={item.url} end className={navLinkClass(index)} aria-current={activeHeading === index + 1 ? 'page' : undefined}>
                {item.title}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] 800px:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/50 animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col overflow-y-auto bg-white shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <Logo to="/" />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1 p-3" aria-label="Mobile">
              {navItems.map((item, index) => (
                <Link key={item.url} to={item.url} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-3 py-2.5 font-medium ${activeHeading === index + 1 ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="px-6 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</div>
            <div className="grid grid-cols-2 gap-2 px-3">
              {categoriesData.map((c) => (
                <Link key={c.id} to={`/products?category=${encodeURIComponent(c.title)}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl p-2 text-sm text-slate-700 hover:bg-slate-50">
                  <img src={c.image_Url} alt="" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="leading-tight">{c.displayTitle}</span>
                </Link>
              ))}
            </div>
            <div className="mt-auto space-y-2 border-t border-slate-100 p-4">
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-secondary w-full">
                  <User size={18} /> My account
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary">Sign in</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary">Join</Link>
                </div>
              )}
              <Link to={sellerLink} onClick={() => setMenuOpen(false)} className="btn-dark w-full">
                <Store size={18} /> {isSeller ? `${seller?.name || 'My shop'}` : 'Start selling'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
