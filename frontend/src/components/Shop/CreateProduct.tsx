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

const CreateProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.product)

  useEffect(() => {
    if (success) {
      toast.success('Product created successfully')
      dispatch({ type: 'clearErrors' })
      navigate(`/shop/${seller._id}`)
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
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(undefined)
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
    const data = {
      name, description, price, category, countInStock, tags,
      discountedPrice: discountedPrice !== undefined && discountedPrice !== null ? discountedPrice : undefined,
      images,
    }
    try {
      dispatch({ type: 'productCreateRequest' })
      const res = await axios.post(`${server}product/create-product`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      dispatch({ type: 'productCreateSuccess', payload: res.data.product })
      toast.success('Product created successfully')
      dispatch({ type: 'clearErrors' })
      navigate(`/shop/${seller._id}`)
    } catch (error) {
      dispatch({
        type: 'productCreateFail',
        payload: error.response?.data?.message || error.message,
      })
    }
  }

  return (
    <div className="w-full 800px:w-[90%] p-3">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
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
                placeholder="Enter product description"
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
                  value={discountedPrice ?? ''}
                  onChange={(e) => setDiscountedPrice(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                  placeholder="Leave empty for no discount"
                  min="0"
                  step="0.01"
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
              <Label>Product Images</Label>
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

            <Button type="submit">Create Product</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default CreateProduct
