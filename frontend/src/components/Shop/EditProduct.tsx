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
