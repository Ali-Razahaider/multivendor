import { useState, useEffect } from "react"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart, AiOutlineClose, AiFillStar, AiOutlineStar } from "react-icons/ai"
import { Link } from "react-router-dom"
import styles from "../../styles/styles"
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/actions/cartActions'
import { toast } from 'react-toastify'

const ProductDetails = ({ data, setOpen }) => {
  const dispatch = useDispatch()
  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)
  const [select, setSelect] = useState(0)

  const images = data.image_Url || data.images

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: data._id || data.id,
      name: data.name,
      price: data.price,
      discountedPrice: data.discountedPrice || data.discount_price,
      images,
      shopId: data.shopId,
      stock: data.countInStock,
      qty: count,
    }))
    toast.success('Item added to cart')
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const incrementCount = () => {
    setCount(count + 1)
  }

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-[90%] md:w-[900px] max-h-[90vh] bg-white rounded-lg shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <AiOutlineClose
          size={24}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-500 cursor-pointer"
          onClick={() => setOpen(false)}
        />

        {data ? (
          <div className="w-full overflow-y-auto flex-1">
            <div className="w-full p-6">
              <div className="block w-full 800px:flex gap-8">
                <div className="w-full 800px:w-[50%] pt-30">
                  <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 mb-4 h-[300px] overflow-hidden">
                    <img
                      src={`${(data.images || data.image_Url)?.[select]?.url || (data.images || data.image_Url)?.[select]}`}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="w-full flex flex-wrap gap-2 justify-start">
                    {(data.images || data.image_Url) &&
                      (data.images || data.image_Url).map((i, index) => (
                        <div
                          key={index}
                          className={`${select === index ? "border-2 border-teal-500" : "border border-gray-300"
                            } cursor-pointer rounded-md overflow-hidden w-15 h-15`}
                          onClick={() => setSelect(index)}
                        >
                          <img src={`${i?.url || i}`} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center border-t mt-24 border-gray-200">
                    <div>
                    <Link to={`/shop/preview/${data?.shop?._id || data?.shopId}`} className="ml-3">
                      <img
                        src={`${typeof data?.shop?.avatar === 'string' ? data.shop.avatar : (data?.shop?.avatar?.url || data?.shop?.shop_avatar?.url)}`}
                        alt=""
                        className="size-[50px] rounded-full border-2 border-gray-300 p-0.5"
                      />
                    </Link>
                      <Link to={`/shop/preview/${data?.shop?._id || data?.shopId}`}>
                        <h3 className={`${styles.shop_name}  text-base font-semibold`}>
                          {data.shop?.name}
                        </h3>
                      </Link>
                      <h5 className="text-sm">
                        ({data.shop?.ratings || 0}/5) Ratings
                      </h5>
                    </div>
                    <div className={`${styles.button} bg-gray-600 hover:bg-blue-700 transition-colors !rounded-md !h-10 ml-auto cursor-pointer`}>
                      <span className="text-white flex items-center text-sm">
                        Send Message <AiOutlineMessage className="ml-2" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full 800px:w-[50%] pt-5">
                  <h1 className={`${styles.productTitle} text-xl font-bold mb-2`}>{data.name}</h1>
                  <div className="mb-3 mt-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed">{data.description}</p>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    {data.discountedPrice || data.discount_price ? (
                      <>
                        <h4 className={`${styles.productDiscountPrice} text-xl font-bold`}>
                          ${data.discountedPrice || data.discount_price}
                        </h4>
                        <h3 className="text-base line-through text-gray-500">${data.price}</h3>
                      </>
                    ) : (
                      <h4 className={`${styles.productDiscountPrice} text-xl font-bold`}>
                        ${data.price}
                      </h4>
                    )}
                  </div>

                  <div className="flex items-center mt-4 justify-between pr-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="bg-gray-100 text-gray-700 font-bold px-3 py-1.5 hover:bg-gray-200 transition text-sm"
                        onClick={decrementCount}
                      >
                        -
                      </button>
                      <span className="bg-white text-gray-800 font-medium px-4 py-1.5 text-center min-w-[40px] text-sm">
                        {count}
                      </span>
                      <button
                        className="bg-gray-100 text-gray-700 font-bold px-3 py-1.5 hover:bg-gray-200 transition text-sm"
                        onClick={incrementCount}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      {click ? (
                        <AiFillHeart
                          size={28}
                          className="cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setClick(!click)}
                          color="red"
                        />
                      ) : (
                        <AiOutlineHeart
                          size={28}
                          className="cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setClick(!click)}
                          color="#333"
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.button} !mt-4 !rounded-lg !h-10 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer`}
                    onClick={handleAddToCart}
                  >
                    <span className="text-white flex items-center text-sm">
                      Add to cart <AiOutlineShoppingCart className="ml-2" size={18} />
                    </span>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <h5 className="text-sm font-semibold cursor-pointer">Product Details</h5>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{data.description}</p>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) =>
                        (data.ratings || data.rating) >= star ? (
                          <AiFillStar key={star} size={14} className="text-yellow-500" />
                        ) : (data.ratings || data.rating) >= star - 0.5 ? (
                          <span key={star} className="relative inline-block">
                            <AiOutlineStar size={14} className="text-gray-400" />
                            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                              <AiFillStar size={14} className="text-yellow-500" />
                            </span>
                          </span>
                        ) : (
                          <AiOutlineStar key={star} size={14} className="text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductDetails
