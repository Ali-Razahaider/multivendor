import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { IoHeartOutline } from 'react-icons/io5';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import styles from '../../styles/styles';
import { removeFromWishlist } from '../../redux/actions/wishlistActions';
import { addToCart } from '../../redux/actions/cartActions';
import { toast } from 'react-toastify';

const WishlistSingle = ({ data, dispatch, setOpenWishlist }) => {
  const productName = data.name?.replace(/\s+/g, '-')

  return (
    <div className="flex items-center p-4 border-b">
      <Link to={`/product/${productName}`} onClick={() => setOpenWishlist(false)}>
        <img
          src={data.images?.[0]?.url || data.images?.[0] || data.image_Url?.[0]?.url}
          alt={data.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      </Link>
      <div className="ml-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/product/${productName}`} onClick={() => setOpenWishlist(false)}>
              <h5 className="text-[15px] font-medium hover:text-blue-600">{data.name}</h5>
            </Link>
            <h5 className="text-sm text-gray-500">USD ${data.discountedPrice || data.discount_price || data.price}</h5>
          </div>
          <RxCross1
            size={16}
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={() => dispatch(removeFromWishlist(data._id || data.id))}
          />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              dispatch(addToCart({
                _id: data._id || data.id,
                name: data.name,
                price: data.price,
                discountedPrice: data.discountedPrice || data.discount_price,
                images: data.images || data.image_Url,
                shopId: data.shopId,
                stock: data.stock || data.countInStock,
                qty: 1,
              }))
              toast.success('Item added to cart')
            }}
          >
            <AiOutlineShoppingCart size={14} /> Add to cart
          </button>
          <button
            className="text-xs text-red-500 hover:text-red-700 font-medium"
            onClick={() => dispatch(removeFromWishlist(data._id || data.id))}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function Wishlist({ setOpenWishlist }) {
  const dispatch = useDispatch()
  const { wishlist } = useSelector((state) => state.wishlist)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenWishlist(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpenWishlist])

  return (
    <div className="fixed top-0 left-0 w-full bg-black/30 h-screen z-50">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishlist(false)} />
            </div>
            <h5 className="text-gray-500">Wishlist is empty!</h5>
          </div>
        ) : (
          <div>
            <div className="flex w-full justify-end pt-5 pr-5">
              <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishlist(false)} />
            </div>
            <div className={`${styles.normalFlex} p-4`}>
              <IoHeartOutline size={25} />
              <h5 className="pl-2 text-xl font-medium">{wishlist.length} items</h5>
            </div>
            <br />
            <div className="w-full border-t">
              {wishlist.map((item, index) => (
                <WishlistSingle key={item._id || item.id || index} data={item} dispatch={dispatch} setOpenWishlist={setOpenWishlist} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
