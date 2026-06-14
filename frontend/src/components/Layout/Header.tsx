import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { productData, categoriesData } from '../../static/data';
import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import DropDown from './DropDown';
import { IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';

import Navbar from './Navbar';

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  

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
    <div className={`${styles.section} w-full `}>
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
        className={`${styles.section} ${active ? 'fixed top-0' : 'relative'} w-full bg-blue-500 shadow-md z-10`}
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
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </div>
  );
};

export default Header;
