import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import server from '../server'
import { apiError } from '../lib/api'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Fulfilment steps in order; sellers can only move an order forward.
const FLOW = ['Processing', 'Transferred to delivery partner', 'Shipping', 'Received', 'On the way', 'Delivered']
const FINAL = ['delivered', 'cancelled', 'processing refund', 'refund success', 'refund rejected']

const nextStatuses = (current) => {
  if (FINAL.includes(current?.toLowerCase())) return []
  const index = FLOW.indexOf(current)
  return [...FLOW.slice(index + 1), 'Cancelled']
}

const ShopOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}order/seller-orders`, { withCredentials: true })
        const found = data.orders?.find((o) => o._id === id)
        if (found) {
          setOrder(found)
          setStatus(nextStatuses(found.status)[0] || '')
        } else {
          toast.error('Order not found')
          navigate('/dashboard-orders')
        }
      } catch (err) {
        toast.error(apiError(err, 'Failed to load order'))
        navigate('/dashboard-orders')
      }
    }
    fetchOrder()
  }, [id, navigate])

  const options = order ? nextStatuses(order.status) : []

  const handleUpdateStatus = async () => {
    if (!status) return
    if (status === 'Cancelled' && !window.confirm('Cancel this order? Stock will be restored and card payments refunded.')) return
    setSaving(true)
    try {
      const { data } = await axios.put(`${server}order/update-order-status/${id}`, { status }, { withCredentials: true })
      setOrder(data.order)
      setStatus(nextStatuses(data.order.status)[0] || '')
      toast.success(`Order marked as ${data.order.status}`)
    } catch (err) {
      toast.error(apiError(err, 'Failed to update order'))
    } finally {
      setSaving(false)
    }
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
                <p className="mb-3 text-sm text-slate-600">
                  Current status: <span className="badge bg-brand-50 text-brand-700">{order.status}</span>
                </p>
                {options.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="order-status" className="sr-only">New status</label>
                    <select
                      id="order-status"
                      className="field h-10 w-auto min-w-[240px]"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {options.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Button onClick={handleUpdateStatus} disabled={saving || !status}>
                      {saving ? 'Updating...' : 'Update status'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">This order is {order.status.toLowerCase()} and can no longer be changed here.</p>
                )}
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
                          src={item.image || item.images?.[0]?.url || item.images?.[0]}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${((item.discountedPrice || item.price) * item.qty).toFixed(2)}
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
                    <span className="font-medium">Payment:</span> {order.paymentInfo?.type || '—'}
                    {order.paymentInfo?.status ? ` (${order.paymentInfo.status})` : ''}
                  </p>
                  <p>
                    <span className="font-medium">Customer:</span> {order.user?.name} · {order.user?.email}
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
