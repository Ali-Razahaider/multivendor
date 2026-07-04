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

function AdminEventsPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${server}event/admin-all-events`)
        setEvents(data.events || [])
      } catch (err) {
        console.error('Failed to fetch events', err)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={6} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">All Events</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>
                        <img
                          src={event.images?.[0]?.url || event.images?.[0] || '/placeholder.jpg'}
                          alt=""
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{event.name}</TableCell>
                      <TableCell>{event.shop?.name || 'N/A'}</TableCell>
                      <TableCell>${event.discountedPrice || event.originalPrice || event.price}</TableCell>
                      <TableCell>{new Date(event.start_Date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(event.end_Date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs text-white ${
                          new Date(event.end_Date) > new Date() ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                          {new Date(event.end_Date) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">No events found</TableCell>
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

export default AdminEventsPage
