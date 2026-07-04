import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../../styles/styles"
import { useSelector, useDispatch } from "react-redux"
import { createOrder } from "../../redux/actions/orderActions"
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { toast } from "react-toastify"
import axios from "axios"
import server from "../../server"

const Payment = () => {
  const [orderData, setOrderData] = useState(null)
  const [select, setSelect] = useState(1)
  const [open, setOpen] = useState(false)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestOrder"))
    setOrderData(data)
  }, [])

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user,
    totalPrice: orderData?.totalPrice,
  }

  const placeOrder = async (paymentInfo) => {
    order.paymentInfo = paymentInfo
    await dispatch(createOrder(order))
    navigate("/order/success")
    localStorage.setItem("cartItems", JSON.stringify([]))
    localStorage.setItem("latestOrder", JSON.stringify([]))
    window.location.reload()
  }

  const paymentHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${server}payment/process`,
        { amount: Math.round(orderData?.totalPrice * 100) },
        { headers: { "Content-Type": "application/json" } }
      )
      const client_secret = data.client_secret
      if (!stripe || !elements) return
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: elements.getElement(CardNumberElement) },
      })
      if (result.error) {
        toast.error(result.error.message)
      } else if (result.paymentIntent.status === "succeeded") {
        await placeOrder({
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        })
        toast.success("Order successful!")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault()
    await placeOrder({ type: "Cash On Delivery" })
    toast.success("Order successful!")
  }

  const shipping = orderData?.shipping?.toFixed(2)

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            {/* Debit/Credit Card */}
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-gray-400 relative flex items-center justify-center cursor-pointer" onClick={() => setSelect(1)}>
                  {select === 1 && <div className="w-[13px] h-[13px] bg-indigo-600 rounded-full" />}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-gray-700">Pay with Debit/Credit Card</h4>
              </div>
              {select === 1 && (
                <div className="w-full flex border-b pb-4">
                  <form className="w-full" onSubmit={paymentHandler}>
                    <div className="w-full flex pb-3">
                      <div className="w-[50%]">
                        <label className="block pb-2">Name On Card</label>
                        <input
                          required
                          value={user?.name || ""}
                          className={`${styles.input} !w-[95%] text-[#444]`}
                          readOnly
                        />
                      </div>
                      <div className="w-[50%]">
                        <label className="block pb-2">Exp Date</label>
                        <CardExpiryElement className={`${styles.input}`} options={{
                          style: { base: { fontSize: "19px", lineHeight: 1.5, color: "#444" } }
                        }} />
                      </div>
                    </div>
                    <div className="w-full flex pb-3">
                      <div className="w-[50%]">
                        <label className="block pb-2">Card Number</label>
                        <CardNumberElement className={`${styles.input} !h-[35px] !w-[95%]`} options={{
                          style: { base: { fontSize: "19px", lineHeight: 1.5, color: "#444" } }
                        }} />
                      </div>
                      <div className="w-[50%]">
                        <label className="block pb-2">CVV</label>
                        <CardCvcElement className={`${styles.input} !h-[35px]`} options={{
                          style: { base: { fontSize: "19px", lineHeight: 1.5, color: "#444" } }
                        }} />
                      </div>
                    </div>
                    <input type="submit" value="Pay Now" className="w-full bg-indigo-600 text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] hover:bg-indigo-700 transition-colors" />
                  </form>
                </div>
              )}
            </div>

            <br />

            {/* Cash on Delivery */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-gray-400 relative flex items-center justify-center cursor-pointer" onClick={() => setSelect(3)}>
                  {select === 3 && <div className="w-[13px] h-[13px] bg-indigo-600 rounded-full" />}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-gray-700">Cash on Delivery</h4>
              </div>
              {select === 3 && (
                <form onSubmit={cashOnDeliveryHandler}>
                  <input type="submit" value="Confirm Order" className="w-full bg-indigo-600 text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] hover:bg-indigo-700 transition-colors" />
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
              <h5 className="text-[18px] font-[600]">{orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}</h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">${orderData?.totalPrice}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
