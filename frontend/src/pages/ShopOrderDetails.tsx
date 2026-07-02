import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import server from '../server'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import { updateOrderStatus } from '../redux/actions/orderActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const ShopOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { isLoading, error } = useSelector((state) => state.order)
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}order/get-seller-all-orders/${seller._id}`, {
          withCredentials: true,
        })
        const found = data.orders?.find((o) => o._id === id)
        if (found) {
          setOrder(found)
          setStatus(found.status)
        } else {
          toast.error('Order not found')
          navigate('/dashboard-orders')
        }
      } catch {
        toast.error('Failed to load order')
        navigate('/dashboard-orders')
      }
    }
    if (seller?._id) fetchOrder()
  }, [seller, id, navigate])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleUpdateStatus = () => {
    if (!status) return
    dispatch(updateOrderStatus(id, status))
    toast.success('Order status updated')
  }

  if (!order) {
    return (
      <div>
        <DashboardHeader />
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <DashboardSideBar active={2} />
          </div>
          <div className="w-full p-8">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[22px] font-[600]">Order #{order._id}</h3>
            <Button variant="outline" onClick={() => navigate('/dashboard-orders')}>
              Back to Orders
            </Button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                  <Button onClick={handleUpdateStatus} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.cart?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0]?.url || item.images?.[0]}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.discountedPrice || item.price) * item.qty}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.address2 && `, ${order.shippingAddress.address2}`}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.zipCode}
                  <br />
                  {order.shippingAddress?.country}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Total:</span> ${order.totalPrice?.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {order.status}
                  </p>
                  <p>
                    <span className="font-medium">Placed on:</span>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.deliveredAt && (
                    <p>
                      <span className="font-medium">Delivered on:</span>{' '}
                      {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopOrderDetails
