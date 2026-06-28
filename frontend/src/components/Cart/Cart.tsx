import { useSelector, useDispatch } from 'react-redux'
import { RxCross1 } from 'react-icons/rx'
import { IoBagHandleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import styles from '../../styles/styles'
import { HiPlus, HiOutlineMinus } from 'react-icons/hi'
import { addToCart, removeFromCart } from '../../redux/actions/cartActions'

const CartSingle = ({ data }) => {
  const dispatch = useDispatch()

  const handleIncrement = () => {
    dispatch(addToCart({ ...data, qty: data.qty + 1 }))
  }

  const handleDecrement = () => {
    if (data.qty > 1) {
      dispatch(addToCart({ ...data, qty: data.qty - 1 }))
    }
  }

  return (
    <div className="flex items-center p-4 border-b">
      <img
        src={data.images?.[0]?.url || data.images?.[0] || data.img}
        alt={data.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="ml-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="text-[15px] font-medium">{data.name}</h5>
            <h5 className="text-sm text-gray-500">USD ${data.discountedPrice || data.price}</h5>
          </div>
        </div>
        <div className="flex items-center mt-2 justify-between">
          <div className="flex items-center">
            <button
              className="w-7 h-7 flex items-center justify-center bg-[#e44343] rounded-full text-white"
              onClick={handleIncrement}
            >
              <HiPlus size={14} />
            </button>
            <span className="px-3 font-medium">{data.qty}</span>
            <button
              className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full"
              onClick={handleDecrement}
            >
              <HiOutlineMinus size={14} />
            </button>
          </div>
          <button
            className="text-xs text-red-500 hover:text-red-700 font-medium"
            onClick={() => dispatch(removeFromCart(data._id))}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function Cart({ setOpenCart }) {
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.cart)
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * (item.discountedPrice || item.price), 0)

  return (
    <div className="fixed top-0 left-0 w-full bg-black/30 h-screen z-50">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
          </div>
          <div className={`${styles.normalFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-xl font-medium">{cart.length} items</h5>
          </div>
          <br />
          <div className="w-full border-t">
            {cart.map((item, index) => (
              <CartSingle key={item._id || index} data={item} />
            ))}
          </div>
        </div>
        <div className="px-5 mb-3">
          <Link to="/checkout" onClick={() => setOpenCart(false)}>
            <div className="h-[45px] flex items-center justify-center w-full bg-black rounded-[5px]">
              <h1 className="text-white text-lg font-semibold">Checkout Now (${totalPrice.toFixed(2)})</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
