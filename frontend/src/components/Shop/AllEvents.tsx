import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShopEvents, deleteEvent } from '../../redux/actions/eventActions'
import ProductDetails from '../ProductCard/ProductDetails'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

const AllEvents = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { events, isLoading } = useSelector((state) => state.events)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewEvent, setPreviewEvent] = useState(null)

  useEffect(() => {
    if (seller?._id) {
      dispatch(getShopEvents(seller._id))
    }
  }, [dispatch, seller?._id])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(id))
      toast.success('Event deleted')
    }
  }

  const handlePreview = (event) => {
    setPreviewEvent(event)
    setPreviewOpen(true)
  }

  return (
    <>
      {isLoading ? (
        <p className="text-gray-500 text-lg">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-lg">No events yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const firstImage = event.images?.[0]?.url || event.images?.[0]
              return (
                <TableRow key={event._id}>
                  <TableCell>
                    <img
                      src={firstImage}
                      alt={event.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {event.discountedPrice ? (
                      <span>
                        ${event.discountedPrice}{' '}
                        <span className="line-through text-gray-400 text-sm">
                          ${event.price}
                        </span>
                      </span>
                    ) : (
                      <span>${event.price}</span>
                    )}
                  </TableCell>
                  <TableCell>{event.countInStock}</TableCell>
                  <TableCell>
                    {new Date(event.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(event.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(event)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      {previewOpen && previewEvent && (
        <ProductDetails data={previewEvent} setOpen={setPreviewOpen} />
      )}
    </>
  )
}

export default AllEvents
