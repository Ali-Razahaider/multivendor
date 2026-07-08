import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { categoriesData, navItems } from '../../static/data';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
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
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <>
    <div className={`${styles.section} w-full hidden 800px:block`}>
      <div className="flex 800px:h-12.5 800px:my-2.5 w-11/12 m-auto items-center justify-between">
        <div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.96A58.734 58.734 0 0 0 5.69 4.38l-.692-2.587a.75.75 0 0 0-.724-.543H2.25Z" />
                <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
              <span className="text-white text-xl font-extrabold tracking-tight">MultiShop</span>
            </div>
          </Link>
        </div>
        {/* search box */}
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-10 w-full px-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <AiOutlineSearch
            size={30}
            className="absolute right-2 top-1 cursor-pointer text-gray-500"
          />
          {searchData.length > 0 ? (
            <div className="absolute min-h-[30vh] bg-white shadow-lg rounded-md w-full">
              {searchData.map((i, index) => {
                const d = i.name;
                const ProductName = d.replace(/\s+/g, '-');
                return (
                  <Link to={`/product/${ProductName}`} key={index}>
                    <div className="flex items-center w-full p-3 hover:bg-slate-200 cursor-pointer">
                      <img
                        src={i.images?.[0]?.url || i.image_Url?.[0]?.url || i.images?.[0] || '/placeholder.jpg'}
                        alt=""
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <h1 className="ml-2">{i.name}</h1>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className={`${styles.button}`}>
          <Link to={isSeller ? `/shop/${seller?._id}` : "/shop-create"}>
            <h1 className="text-amber-100 flex items-center">
              {isSeller ? "My Shop" : "Become Seller"} <IoIosArrowForward className="ml-1" />{' '}
            </h1>
          </Link>
        </div>
      </div>

        <div
          className={`${styles.section} ${active ? 'fixed top-0' : 'relative'} w-full bg-indigo-600 shadow-md z-50 hidden 800px:block`}
        >
        <div
          className={`${styles.section} relative  flex items-center justify-between`}
        >
          <div className="relative h-12.5 mt-2.5 w-67.5 hidden min-[1000px]:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button
              onClick={() => setDropDown(!dropdown)}
              className="h-full w-full flex items-center pl-10 bg-indigo-50 rounded-tl-md rounded-tr-md text-indigo-700 font-medium hover:bg-indigo-100 transition duration-300"
            >
              All Categories
              <IoIosArrowDown size={20} className="ml-1" />
            </button>
            {dropdown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>
          {/* nav items */}
          <div className={`${styles.normalFlex} w-full`}>
            <Navbar active={activeHeading} />
          </div>
          {/* icons */}
          <div className={`${styles.normalFlex}`}>
            {/* profile icon */}
            <div className="relative cursor-pointer mr-3.75">
              {isAuthenticated ? (
                <Link to="/profile" className="flex items-center">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="w-6.25 h-6.25 rounded-full object-cover border border-white shrink-0" />
                  ) : (
                    <IoPersonOutline size={25} className="text-white" />
                  )}
                </Link>
              ) : (
                <Link to="/login">
                  <IoPersonOutline size={25} className="text-white" />
                </Link>
              )}
            </div>
            {/* wishlist icon */}
            <div className="relative cursor-pointer mr-3.75" onClick={() => setOpenWishlist(true)}>
              <IoHeartOutline size={25} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlist?.length || 0}
              </span>
            </div>
            {/* cart icon */}
            <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={25} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cart?.length || 0}
              </span>
            </div>

              </div>
            </div>
          </div>
      </div>
      {/* mobile header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-indigo-700">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.96A58.734 58.734 0 0 0 5.69 4.38l-.692-2.587a.75.75 0 0 0-.724-.543H2.25Z" />
                <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
              <span className="text-gray-900 text-xl font-extrabold tracking-tight">MultiShop</span>
            </div>
          </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-emerald-500 w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                {cart?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* header sidebar */}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="flex flex-col min-h-full">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => { setOpenWishlist(true); setOpen(false); }}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-emerald-500 w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist?.length || 0}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-indigo-300 border-[2px] rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length > 0 && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      const d = i.name;
                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        <Link to={`/product/${Product_name}`} key={i._id}>
                          <div className="flex items-center">
                            <img
                              src={i.images?.[0]?.url || i.image_Url?.[0]?.url}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {navItems && navItems.map((i, index) => (
                <Link to={i.url} key={index} className={`block py-2 pl-4 font-medium ${activeHeading === index + 1 ? 'text-indigo-600' : 'text-gray-700'}`} onClick={() => setOpen(false)}>
                  {i.title}
                </Link>
              ))}
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to={isSeller ? `/shop/${seller?._id}` : "/shop-create"}>
                  <h1 className="text-[#fff] flex items-center">
                    {isSeller ? "My Shop" : "Become Seller"} <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center mb-20 mt-auto">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user?.avatar?.url}`}
                        alt=""
                        className="w-10  h-10 rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
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
