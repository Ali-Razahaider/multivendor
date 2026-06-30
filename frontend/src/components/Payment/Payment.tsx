import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../../styles/styles"
import { useSelector, useDispatch } from "react-redux"
import { createOrder } from "../../redux/actions/orderActions"
import { toast } from "react-toastify"

const Payment = () => {
  const [orderData, setOrderData] = useState(null)
  const [select, setSelect] = useState(3)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestOrder"))
    setOrderData(data)
  }, [])

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
    paymentInfo: {
      type: "Cash On Delivery",
    },
  }

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault()
    await dispatch(createOrder(order))
    navigate("/order/success")
    toast.success("Order successful!")
    localStorage.setItem("cartItems", JSON.stringify([]))
    localStorage.setItem("latestOrder", JSON.stringify([]))
    window.location.reload()
  }

  const shipping = orderData?.shipping?.toFixed(2)

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
                  onClick={() => setSelect(3)}
                >
                  {select === 3 && (
                    <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                  )}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                  Cash on Delivery
                </h4>
              </div>
              {select === 3 && (
                <form onSubmit={cashOnDeliveryHandler}>
                  <input
                    type="submit"
                    value="Confirm Order"
                    className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                  />
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <div className="w-full bg-white rounded-md p-5 pb-8">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
              <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
            </div>
            <br />
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
              <h5 className="text-[18px] font-[600]">${shipping}</h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
              <h5 className="text-[18px] font-[600]">
                {orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}
              </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
              ${orderData?.totalPrice}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
