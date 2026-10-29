import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { categoriesData, navItems } from '../../static/data';
import { AiFillShopping, AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import DropDown from './DropDown';
import { IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts } from '../../redux/actions/productActions';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import { RxCross1 } from 'react-icons/rx';

import Navbar from './Navbar';

const Header = ({ activeHeading }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setDropDown(false);
        setSearchTerm('');
        setSearchData([]);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setSearchData([]);
      return;
    }
    const filteredProducts =
      products &&
      products.filter((product) =>
        product.name?.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 6);
    setSearchData(filteredProducts || []);
  };

  return (
    <>
    <div className="w-full hidden 800px:block bg-white border-b border-gray-100">
      <div className="flex 800px:h-12.5 800px:my-2.5 w-11/12 m-auto items-center justify-between">
        <div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-900">
                <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
              </svg>
              <span className="bazaarly-wordmark text-gray-900 font-extrabold tracking-tight">Bazaarly</span>
            </div>
          </Link>
        </div>
        {/* search box */}
        <div className="w-[42%] relative">
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products, brands and more"
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-11 w-full pl-4 pr-11 border border-gray-200 bg-gray-50 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors"
          />
          <AiOutlineSearch
            size={21}
            aria-hidden="true"
            className="absolute right-3 top-3 text-gray-500 pointer-events-none"
          />
          {searchData.length > 0 ? (
            <div className="absolute top-full mt-2 max-h-96 overflow-y-auto bg-white border border-gray-100 shadow-xl rounded-xl w-full z-60 p-1">
              {searchData.map((i, index) => {
                const d = i.name;
                const ProductName = d.replace(/\s+/g, '-');
                return (
                  <Link to={`/product/${ProductName}`} key={i._id || index} onClick={() => { setSearchTerm(''); setSearchData([]); }}>
                    <div className="flex items-center w-full p-2.5 rounded-lg hover:bg-indigo-50 focus:bg-indigo-50 transition-colors">
                      <img
                        src={i.images?.[0]?.url || i.image_Url?.[0]?.url || i.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                        }}
                        alt=""
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-800 line-clamp-2">{i.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-3 transition-colors shadow-sm shadow-indigo-600/20">
          <Link to={isSeller ? `/shop/${seller?._id}` : "/shop-create"}>
            <span className="text-white text-sm font-semibold flex items-center whitespace-nowrap">
              {isSeller ? "My Shop" : "Start Selling"} <IoIosArrowForward className="ml-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

        <div
          className={`${active ? 'fixed top-0' : 'relative'} w-full bg-indigo-600 shadow-sm z-50 hidden 800px:block`}
        >
        <div
          className={`${styles.section} relative flex h-16 items-center gap-3`}
        >
          <div className="relative hidden w-64 shrink-0 min-[1000px]:block">
            <button
              type="button"
              onClick={() => setDropDown(!dropdown)}
              aria-expanded={dropdown}
              aria-haspopup="menu"
              className="flex h-11 w-full items-center gap-2 rounded-xl bg-white px-4 text-indigo-700 font-semibold shadow-sm transition-colors hover:bg-indigo-50"
            >
              <BiMenuAltLeft size={25} aria-hidden="true" />
              <span>All Categories</span>
              <IoIosArrowDown size={18} className={`ml-auto transition-transform ${dropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {dropdown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>
          {/* nav items */}
          <div className="flex min-w-0 flex-1 items-center">
            <Navbar active={activeHeading} />
          </div>
          {/* icons */}
          <div className="flex shrink-0 items-center">
            {/* profile icon */}
            <div className="relative mr-2">
              {isAuthenticated ? (
                <Link to="/profile" aria-label="My profile" className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="w-6.25 h-6.25 rounded-full object-cover border border-white shrink-0" />
                  ) : (
                    <IoPersonOutline size={25} className="text-white" />
                  )}
                </Link>
              ) : (
                <Link to="/login" aria-label="Sign in" className="flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <IoPersonOutline size={25} className="text-white" />
                </Link>
              )}
            </div>
            {/* wishlist icon */}
            <button type="button" aria-label={`Open wishlist, ${wishlist?.length || 0} items`} className="relative mr-2 p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setOpenWishlist(true)}>
              <IoHeartOutline size={25} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center">
                {wishlist?.length || 0}
              </span>
            </button>
            {/* cart icon */}
            <button type="button" aria-label={`Open cart, ${cart?.length || 0} items`} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setOpenCart(true)}>
              <AiFillShopping size={25} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center">
                {cart?.length || 0}
              </span>
            </button>

              </div>
            </div>
          </div>
      </div>
      {/* mobile header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[60px] bg-white z-50 top-0 left-0 border-b border-gray-100 800px:hidden`}
      >
        <div className="w-full h-full px-4 flex items-center justify-between">
          <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
            <BiMenuAltLeft
              size={30}
              aria-hidden="true"
            />
          </button>
          <div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-900">
                <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
              </svg>
              <span className="bazaarly-wordmark text-gray-900 font-extrabold tracking-tight">Bazaarly</span>
            </div>
          </Link>
          </div>
          <button type="button" aria-label={`Open cart, ${cart?.length || 0} items`} onClick={() => setOpenCart(true)} className="relative p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors">
              <AiFillShopping size={27} className="text-gray-900" />
              <span className="absolute right-0 top-0 rounded-full bg-indigo-600 min-w-4 h-4 px-0.5 text-white font-semibold text-[10px] leading-4 text-center">
                {cart?.length || 0}
              </span>
          </button>
        </div>

        {/* header sidebar */}
        {open && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <button type="button" aria-label="Close menu" className="absolute inset-0 w-full bg-gray-950/55" onClick={() => setOpen(false)} />
            <div className="absolute w-[min(88vw,360px)] bg-white h-full top-0 left-0 z-10 overflow-y-auto shadow-2xl">
              <div className="flex flex-col min-h-full">
              <div className="w-full justify-between items-center flex px-4 pt-5">
                <div>
                  <button type="button" aria-label={`Open wishlist, ${wishlist?.length || 0} items`}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => { setOpenWishlist(true); setOpen(false); }}
                  >
                    <AiOutlineHeart size={26} />
                    <span className="absolute right-0 top-0 rounded-full bg-indigo-600 min-w-4 h-4 px-0.5 text-white font-semibold text-[10px] leading-4 text-center">
                      {wishlist?.length || 0}
                    </span>
                  </button>
                </div>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><RxCross1 size={23} /></button>
              </div>

              <div className="my-7 w-[92%] mx-auto relative">
                <input
                  type="search"
                  aria-label="Search products"
                  placeholder="Search products"
                  className="h-11 w-full px-4 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length > 0 && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-100 rounded-xl z-10 shadow-xl w-full left-0 p-1 max-h-72 overflow-y-auto">
                    {searchData.map((i) => {
                      const d = i.name;
                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        <Link to={`/product/${Product_name}`} key={i._id || Product_name} onClick={() => { setOpen(false); setSearchTerm(''); setSearchData([]); }}>
                          <div className="flex items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                            <img
                              src={i.images?.[0]?.url || i.image_Url?.[0]?.url || i.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                              }}
                              alt=""
                              className="w-[50px] mr-2 h-[50px] object-cover rounded"
                            />
                            <span className="text-sm text-gray-800 line-clamp-2">{i.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <nav className="px-3 space-y-1" aria-label="Mobile navigation">
              {navItems && navItems.map((i, index) => (
                <Link to={i.url} key={index} aria-current={activeHeading === index + 1 ? 'page' : undefined} className={`block py-2.5 px-3 rounded-lg font-medium transition-colors ${activeHeading === index + 1 ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setOpen(false)}>
                  {i.title}
                </Link>
              ))}
              </nav>
              <Link to={isSeller ? `/shop/${seller?._id}` : "/shop-create"} onClick={() => setOpen(false)} className="mx-4 mt-6 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center transition-colors">
                {isSeller ? "My Shop" : "Start Selling"} <IoIosArrowForward className="ml-1" aria-hidden="true" />
              </Link>

              <div className="flex w-full justify-center py-8 mt-auto border-t border-gray-100">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-gray-800 font-medium">
                    {user?.avatar?.url ? <img src={user.avatar.url} alt="" className="w-9 h-9 rounded-full border border-gray-200 object-cover" /> : <IoPersonOutline size={25} />}
                    My profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold pr-3 text-indigo-700"
                    >
                      Sign in
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold pl-3 text-indigo-700"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
        </div>
        </div>
      )}
      </div>
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
      </>
  );
};

export default Header;
