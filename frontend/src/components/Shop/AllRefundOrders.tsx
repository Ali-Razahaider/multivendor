import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import server from '../../server'
import { apiError } from '../../lib/api'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const statusStyles = {
  'processing refund': 'bg-amber-100 text-amber-800',
  'refund success': 'bg-emerald-100 text-emerald-800',
  'refund rejected': 'bg-rose-100 text-rose-800',
}

const AllRefundOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const fetchOrders = useCallback(() => {
    // The session identifies the shop; the path segment is ignored by the API.
    axios
      .get(`${server}order/seller-refund-orders/me`, { withCredentials: true })
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => toast.error(apiError(err, 'Failed to load refund requests')))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const decide = async (id, status) => {
    if (status === 'Refund Success' && !window.confirm('Approve this refund? Card payments will be refunded to the customer.')) return
    setBusyId(id)
    try {
      const { data } = await axios.put(`${server}order/order-refund-success/${id}`, { status }, { withCredentials: true })
      toast.success(data.message || 'Refund updated')
      fetchOrders()
    } catch (err) {
      toast.error(apiError(err, 'Failed to update refund'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const pending = order.status?.toLowerCase() === 'processing refund'
              return (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">#{order._id.slice(-8)}</TableCell>
                  <TableCell>{order.user?.name}</TableCell>
                  <TableCell>{order.cart?.reduce((n, i) => n + (i.qty || 1), 0)}</TableCell>
                  <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`badge ${statusStyles[order.status?.toLowerCase()] || 'bg-slate-100 text-slate-700'}`}>{order.status}</span>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {pending ? (
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-primary h-8 px-3 text-xs" disabled={busyId === order._id} onClick={() => decide(order._id, 'Refund Success')}>
                          Approve
                        </button>
                        <button type="button" className="btn-secondary h-8 px-3 text-xs" disabled={busyId === order._id} onClick={() => decide(order._id, 'Refund Rejected')}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {!loading && orders.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-slate-500">No refund requests</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AllRefundOrders
