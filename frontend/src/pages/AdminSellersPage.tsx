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
import { Button } from "@/components/ui/button"
import axios from 'axios'
import server from '../server'

function AdminSellersPage() {
  const [sellers, setSellers] = useState([])

  const fetchSellers = async () => {
    try {
      const { data } = await axios.get(`${server}shop/admin-all-sellers`)
      setSellers(data.sellers || [])
    } catch (err) {
      console.error('Failed to fetch sellers', err)
    }
  }

  useEffect(() => { fetchSellers() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this seller?')) return
    try {
      await axios.delete(`${server}shop/admin-delete-seller/${id}`)
      setSellers(sellers.filter((s) => s._id !== id))
    } catch (err) {
      console.error('Failed to delete seller', err)
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={3} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">All Sellers</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{new Date(seller.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(seller._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sellers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">No sellers found</TableCell>
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

export default AdminSellersPage
