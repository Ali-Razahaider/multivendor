import { useEffect, useState } from 'react'
import AdminHeader from '../components/Admin/AdminHeader'
import AdminSideBar from '../components/Admin/AdminSideBar'
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import server from '../server'

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}order/admin-all-orders`)
        setOrders(data.orders || [])
      } catch (err) {
        console.error('Failed to fetch orders', err)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={4} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">All Orders</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order._id.slice(-8)}</TableCell>
                      <TableCell>{order.user?.name || 'N/A'}</TableCell>
                      <TableCell>{order.cart?.length || 0}</TableCell>
                      <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-white text-xs ${
                          order.status === 'Delivered' ? 'bg-green-500' :
                          order.status === 'Processing' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.paymentInfo?.type === 'Cash on Delivery'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {order.paymentInfo?.type || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">No orders found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminOrdersPage
