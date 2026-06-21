import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { productData, categoriesData } from '../../static/data';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import DropDown from './DropDown';
import { IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import { RxCross1 } from 'react-icons/rx';

import Navbar from './Navbar';

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
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

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setSearchData([]);
      return;
    }
    const filteredProducts =
      productData &&
      productData.filter((product) =>
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
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt=""
            />
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
                        src={i.image_Url[0].url}
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
          <Link to={'/seller'}>
            <h1 className="text-amber-100 flex items-center">
              Become Seller <IoIosArrowForward className="ml-1" />{' '}
            </h1>
          </Link>
        </div>
      </div>

      <div
        className={`${styles.section} ${active ? 'fixed top-0' : 'relative'} w-full bg-blue-500 shadow-md z-10 hidden 800px:block`}
      >
        <div
          className={`${styles.section} relative  flex items-center justify-between`}
        >
          <div className="relative h-12.5 mt-2.5 w-67.5 hidden min-[1000px]:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button
              onClick={() => setDropDown(!dropdown)}
              className="h-full w-full flex items-center pl-10 bg-gray-200 rounded-tl-md rounded-tr-md text-gray-700 font-medium hover:bg-gray-300 transition duration-300"
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
                0
              </span>
            </div>
            {/* cart icon */}
            <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={25} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
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
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
                className="mt-3 cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                0
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
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                      0
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
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
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

              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
            </div>
        </div>
        </div>
      )}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
      </div>
      </>
  );
};

export default Header;
