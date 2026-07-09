import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { categoriesData } from '../../static/data'
import { updateProduct, clearErrors, getShopProducts } from '../../redux/actions/productActions'
import axios from 'axios'
import server from '../../server'

const EditProduct = ({ product, open, setOpen }) => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.product)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [price, setPrice] = useState(0)
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(undefined)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    dispatch(clearErrors())
  }, [open])

  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setDescription(product.description || '')
      setCountInStock(product.countInStock || 0)
      setCategory(product.category || '')
      setTags(product.tags || '')
      setPrice(product.price || 0)
      setDiscountedPrice(product.discountedPrice ?? undefined)
      setImages(product.images || [])
    }
  }, [product])

  useEffect(() => {
    if (success) {
      toast.success('Product updated successfully')
      dispatch(clearErrors())
      setOpen(false)
      if (seller?._id) dispatch(getShopProducts(seller._id))
    }
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
  }, [success, error])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const readers = files.map((file) => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) resolve(reader.result as string)
      }
      reader.readAsDataURL(file as Blob)
    }))
    Promise.all(readers).then((results) => setImages((prev) => [...prev, ...results]))
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct(product._id, {
        name,
        description,
        price,
        category,
        countInStock,
        tags,
        discountedPrice: discountedPrice ?? null,
        images,
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  id="edit-category"
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
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
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
                <Label htmlFor="edit-price">Price ($) *</Label>
                <Input
                  id="edit-price"
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
                <Label htmlFor="edit-discountedPrice">Discounted Price ($)</Label>
                <Input
                  id="edit-discountedPrice"
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
                <Label htmlFor="edit-stock">Stock *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
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
                  <p className="text-sm text-gray-500">Click to add images</p>
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
                    <div key={i} className="relative group">
                      <img src={img} className="size-16 object-cover rounded border" alt="" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 size-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </CardContent>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProduct
