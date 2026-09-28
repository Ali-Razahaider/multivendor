import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { AiFillStar, AiOutlineStar, AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ProductDetails from './ProductDetails';
import { addToCart } from '../../redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '../../redux/actions/wishlistActions';

const ProductCard = ({ data }) => {
  const dispatch = useDispatch()
  const { wishlist } = useSelector((state) => state.wishlist)
  const { isSeller } = useSelector((state) => state.seller)
  const [open, setOpen] = useState(false);
  const isWishlisted = wishlist?.find((i) => (i._id || i.id) === (data._id || data.id))

  const d = data.name;
  const productName = d.replace(/\s+/g, '-');

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  const images = data.image_Url || data.images;
  const rawImg = images?.[0]?.url || images?.[0];
  const firstImage = (typeof rawImg === 'string' && (rawImg.includes('loremflickr') || rawImg.startsWith('/uploads'))) ? FALLBACK_IMAGE : (rawImg || FALLBACK_IMAGE);
  const discountPrice = data.discount_price ?? data.discountedPrice
  const rating = data.rating ?? data.ratings ?? 0
  const totalSold = data.total_sell ?? data.totalSell ?? 0

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: data._id || data.id,
      name: data.name,
      price: data.price,
      discountedPrice: discountPrice,
      images: images,
      shopId: data.shopId,
      stock: data.countInStock,
      qty: 1,
    }))
    toast.success('Item added to cart')
  }

  return (
    <div className="w-full h-105 bg-white rounded-lg shadow-sm p-3 relative cursor-pointer hover:shadow-md transition-all duration-300">
      <div className="flex justify-end">
        {discountPrice && data.price && data.price > discountPrice && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold absolute top-2 left-2">
            {Math.round(((data.price - discountPrice) / data.price) * 100)}% Off
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
          {!isSeller && (
            <>
              {isWishlisted ? (
                <AiFillHeart size={22} className="text-red-500"
                  onClick={() => dispatch(removeFromWishlist(data._id || data.id))}
                />
              ) : (
                <AiOutlineHeart size={22} className="text-gray-700 hover:text-red-500 transition"
                  onClick={() => dispatch(addToWishlist({ ...data, _id: data._id || data.id }))}
                />
              )}
            </>
          )}
          <AiOutlineEye size={22}
            className="text-gray-700 hover:text-blue-500 transition"
            onClick={() => setOpen(!open)}
          />
          {!isSeller && (
            <AiOutlineShoppingCart size={22}
              className="text-gray-700 hover:text-blue-500 transition"
              onClick={handleAddToCart}
            />
          )}
        </div>
      </div>

      <Link to={`/product/${productName}`}>
        <img
          src={firstImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
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
        {discountPrice && data.price && data.price > discountPrice ? (
          <>
            <span className={`${styles.productDiscountPrice}`}>
              ${discountPrice}
            </span>
            <span className={`${styles.price}`}>
              ${data.price}
            </span>
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
            if (rating >= star) {
              return <AiFillStar key={star} size={15} className="text-yellow-500" />;
            } else if (rating >= star - 0.5) {
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
        <span className="text-[13px] text-green-600 ml-auto font-medium">{totalSold} sold</span>
      </div>
      {data.shop && (
        <span className="text-xs text-gray-500 mt-2 block">{data.shop.name}</span>
      )}

      {open && <ProductDetails data={data} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
