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
import { AiOutlineMoneyCollect, AiOutlineUser } from "react-icons/ai"
import { FiShoppingBag, FiPackage } from "react-icons/fi"
import { IoStorefrontOutline } from "react-icons/io5"
import { GiPayMoney } from "react-icons/gi"
import { Link } from "react-router-dom"
import axios from 'axios'
import server from '../server'

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    orders: 0,
    products: 0,
    totalEarnings: 0,
    withdraws: 0,
  })
  const [latestOrders, setLatestOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, sellersRes, ordersRes, productsRes, withdrawRes] = await Promise.all([
          axios.get(`${server}user/admin-all-users`, { withCredentials: true }),
          axios.get(`${server}shop/admin-all-sellers`, { withCredentials: true }),
          axios.get(`${server}order/admin-all-orders`, { withCredentials: true }),
          axios.get(`${server}product/admin-all-products`, { withCredentials: true }),
          axios.get(`${server}withdraw/admin-all-withdraws`, { withCredentials: true }),
        ])
        const users = usersRes.data.users || []
        const sellers = sellersRes.data.sellers || []
        const orders = ordersRes.data.orders || []
        const products = productsRes.data.products || []
        const withdraws = withdrawRes.data.withdraws || []

        const totalEarnings = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

        setStats({
          users: users.length,
          sellers: sellers.length,
          orders: orders.length,
          products: products.length,
          totalEarnings,
          withdraws: withdraws.length,
        })
        setLatestOrders(orders.slice(0, 5))
      } catch (err) {
        console.error('Failed to fetch admin stats', err)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { icon: AiOutlineUser, label: "Total Users", value: stats.users, color: "#4F46E5" },
    { icon: IoStorefrontOutline, label: "Total Sellers", value: stats.sellers, color: "#7C3AED" },
    { icon: FiShoppingBag, label: "Total Orders", value: stats.orders, color: "#0891B2" },
    { icon: FiPackage, label: "Total Products", value: stats.products, color: "#059669" },
    { icon: GiPayMoney, label: "Withdraw Requests", value: stats.withdraws, color: "#DC2626" },
    { icon: AiOutlineMoneyCollect, label: "Total Earnings", value: `$${stats.totalEarnings.toFixed(2)}`, color: "#D97706" },
  ]

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={1} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">Dashboard</h3>
          <div className="w-full flex flex-wrap items-center justify-between gap-4">
            {statCards.map((card, index) => {
              const Icon = card.icon
              return (
                <Card key={index} className="w-full 800px:w-[15%]">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <Icon size={30} color={card.color} />
                      <div className="ml-2">
                        <h3 className="text-[14px] font-[400] text-[#00000085]">
                          {card.label}
                        </h3>
                        <h5 className="text-[20px] font-[600]">{card.value}</h5>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <br />
          <h3 className="text-[22px] font-semibold pb-2">Latest Orders</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              {latestOrders.length === 0 ? (
                <p className="text-[#555]">No orders yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id.slice(-8)}</TableCell>
                        <TableCell>{order.user?.name || 'N/A'}</TableCell>
                        <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-white text-xs ${
                            order.status === 'Delivered' ? 'bg-green-500' :
                            order.status === 'Processing' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Link to={`/admin/orders`} className="text-indigo-600 hover:underline">
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
