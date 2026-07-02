import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import { getAllOrdersOfSeller } from '../redux/actions/orderActions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ShopAllOrders = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { isLoading, sellerOrders } = useSelector((state) => state.order)

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfSeller(seller._id))
    }
  }, [dispatch, seller?._id])

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-[600] pb-4">All Orders</h3>
          {isLoading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : !sellerOrders || sellerOrders.length === 0 ? (
            <p className="text-gray-500 text-lg">No orders found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Placed On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Processing refund' || order.status === 'Refund Success'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {order.cart?.reduce((acc, item) => acc + item.qty, 0) || 0}
                    </TableCell>
                    <TableCell>${order.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopAllOrders
