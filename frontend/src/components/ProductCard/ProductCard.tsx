import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { AiFillStar, AiOutlineStar, AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { useState } from 'react';
import ProductDetails from './ProductDetails';

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const d = data.name;
  const productName = d.replace(/\s+/g, '-');

  return (
    <div className="w-full h-105 bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      <div className="flex justify-end">
        {data.discount_price && data.price && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold absolute top-2 left-2">
            {Math.round(((data.price - data.discount_price) / data.price) * 100)}% Off
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          {click ? (
            <AiFillHeart size={22} className="text-red-500"
              onClick={() => setClick(!click)}
            />
          ) : (
            <AiOutlineHeart size={22} className="text-gray-500 hover:text-red-500 transition"
              onClick={() => setClick(!click)}
            />
          )}
          <AiOutlineEye size={22}
            className="text-gray-500 hover:text-blue-500 transition"
            onClick={() => setOpen(!open)}
          />
          <AiOutlineShoppingCart size={22}
            className="text-gray-500 hover:text-blue-500 transition"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      <Link to={`/product/${productName}`}>
        <img
          src={data.image_Url[0].url}
          alt={data.name}
          className="w-full h-42.5 object-cover mt-8"
        />
      </Link>

      <Link to={`/product/${productName}`}>
        <h5 className="text-sm font-semibold text-gray-700 mt-3 line-clamp-2">
          {data.name}
        </h5>
      </Link>

      <div className="flex items-center mt-2">
        {data.discount_price ? (
          <>
            <span className={`${styles.productDiscountPrice}`}>
              {`$${data.discount_price || 0}`}
            </span>
            {data.price && (
              <span className={`${styles.price}`}>
                ${data.price}
              </span>
            )}
          </>
        ) : (
          <span className={`${styles.productDiscountPrice}`}>
            ${data.price}
          </span>
        )}
      </div>

      <div className="flex items-center mt-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            if (data.rating >= star) {
              return <AiFillStar key={star} size={15} className="text-yellow-500" />;
            } else if (data.rating >= star - 0.5) {
              return (
                <span key={star} className="relative inline-block">
                  <AiOutlineStar size={15} className="text-gray-400" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <AiFillStar size={15} className="text-yellow-500" />
                  </span>
                </span>
              );
            } else {
              return <AiOutlineStar key={star} size={15} className="text-gray-400" />;
            }
          })}
        </div>
        <span className="text-[13px] text-green-600 ml-auto font-medium">{data.total_sell} sold</span>
      </div>
      {data.shop && (
        <span className="text-xs text-gray-500 mt-2 block">{data.shop.name}</span>
      )}

      {open && <ProductDetails data={data} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
