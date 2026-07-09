import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { categoriesData } from '../../static/data'
import axios from 'axios'
import server from '../../server'

const CreateEvent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (success) {
      toast.success('Event created successfully')
      dispatch({ type: 'clearErrors' })
      navigate(`/dashboard-events`)
    }
    if (error) {
      toast.error(error)
      dispatch({ type: 'clearErrors' })
    }
  }, [success, error])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [price, setPrice] = useState(0)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const readers = files.map((file) => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) resolve(reader.result as string)
      }
      reader.readAsDataURL(file as Blob)
    }))
    Promise.all(readers).then((results) => setImages(results))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      toast.error('Start and end dates are required')
      return
    }
    const data = {
      name, description, price, category, countInStock, tags, startDate, endDate,
      discountedPrice: discountedPrice || undefined,
      images,
    }
    try {
      dispatch({ type: 'eventCreateRequest' })
      const res = await axios.post(`${server}event/create-event`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      dispatch({ type: 'eventCreateSuccess', payload: res.data.event })
      toast.success('Event created successfully')
      dispatch({ type: 'clearErrors' })
      navigate(`/dashboard-events`)
    } catch (error) {
      dispatch({
        type: 'eventCreateFail',
        payload: error.response?.data?.message || error.message,
      })
    }
  }

  return (
    <div className="w-full 800px:w-[90%] p-3">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Choose a category</option>
                  {categoriesData.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={5}
                required
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="countInStock">Stock *</Label>
                <Input
                  id="countInStock"
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. electronics, sale"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Event Images</Label>
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {images.map((img, i) => (
                    <img key={i} src={img} className="size-16 object-cover rounded border" alt="" />
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <Button type="submit">Create Event</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default CreateEvent
