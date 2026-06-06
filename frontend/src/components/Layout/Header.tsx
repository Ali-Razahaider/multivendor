import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { useState } from 'react';
import { productData } from '../../static/data';
const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      productData &&
      productData.filter((product) =>
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
        </div>
      </div>
    </div>
  );
};

export default Header;
