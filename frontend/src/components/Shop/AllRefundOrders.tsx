import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import server from '../../server'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const AllRefundOrders = () => {
  const { seller } = useSelector((state) => state.seller)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!seller?._id) return
    axios
      .get(`${server}order/seller-refund-orders/${seller._id}`, { withCredentials: true })
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {})
  }, [seller])

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">#{order._id.slice(-8)}</TableCell>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>{order.cart?.length}</TableCell>
                <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs text-white bg-yellow-500">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-gray-500">No refund requests</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AllRefundOrders
