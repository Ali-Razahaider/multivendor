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

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}user/admin-all-users`)
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to fetch users', err)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await axios.delete(`${server}user/admin-delete-user/${id}`)
      setUsers(users.filter((u) => u._id !== id))
    } catch (err) {
      console.error('Failed to delete user', err)
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={2} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">All Users</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                          disabled={user.role === 'admin'}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">No users found</TableCell>
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

export default AdminUsersPage
