import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { productData, categoriesData } from '../../static/data';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiMenuAltLeft } from 'react-icons/bi';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import DropDown from './DropDown';

interface Product {
  name: string;
  image_Url: { url: string }[];
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState<Product[]>([]);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      setSearchData([]);
      return;
    }
    const filteredProducts =
      productData &&
      productData.filter((product: Product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <div className={`${styles.section}`}>
      <div className="flex 800px:h-12.5 800px:my-2.5 items-center justify-between">
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
            className="h-[40px] w-full px-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-[40px] h-[40px] object-cover rounded-full"
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
        <div className={`${styles.section} relative flex items-center`}>
          <div className="relative h-12.5 mt-2.5 w-67.5 hidden min-[1000px]:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button
              onClick={() => setDropDown(!dropdown)}
              className="h-full w-full flex items-center pl-10 bg-gray-200 rounded-tl-md  rounded-tr-md text-gray-700 font-medium hover:bg-gray-300 transition duration-300"
            >
              All Categories
              <IoIosArrowDown size={20} className="ml-1 
              " />
            </button>
            {dropdown && (
              <DropDown categoriesData={categoriesData} setDropDown={setDropDown}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
