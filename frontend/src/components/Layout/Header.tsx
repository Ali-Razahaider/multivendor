import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState } from 'react';
import { productData } from '../../static/data';
import { AiOutlineSearch } from 'react-icons/ai';

import { IoIosArrowForward } from 'react-icons/io';

interface Product {
  name: string;
  image_Url: { url: string }[];
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if(!term)return setSearchData(null);
    const filteredProducts =
      productData &&
      productData.filter((product: Product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <div className={`${styles.section}`}>
      <div className="flex 800px:h-[50px] 800px:my-[20px] items-center justify-between">
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
          {searchData && searchData.length  !=0 ? (
            <div className="absolute min-h-[30vh] bg-white shadow-lg rounded-md ">
              {searchData && searchData.map((i, index) => {
                  const d = i.name;
                  const ProductName = d.replace(/\s+/g, '-');
                  return (
                    <Link to={`/product/${ProductName}`} key={index}>
                      <div className="flex items-center w-full p-3 hover:bg-slate-200 cursor-pointer">
                        <img
                          src={i.image_Url[0].url}
                          alt=""
                          className="w-[40px] h-[40px]  object-cover rounded-full :"
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
    </div>
  );
};

export default Header;
