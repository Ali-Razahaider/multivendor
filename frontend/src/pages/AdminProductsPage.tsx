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

function AdminProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${server}product/admin-all-products`)
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch products', err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={5} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">All Products</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg'}
                          alt=""
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                      <TableCell>{product.shop?.name || 'N/A'}</TableCell>
                      <TableCell>${product.discountedPrice || product.originalPrice || product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.sold_out || 0}</TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">No products found</TableCell>
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

export default AdminProductsPage
