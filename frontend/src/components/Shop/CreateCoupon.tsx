import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createCoupon, clearErrors } from '../../redux/actions/couponActions'

const CreateCoupon = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { seller } = useSelector((state: any) => state.seller)
  const { success, error } = useSelector((state: any) => state.coupon)

  useEffect(() => {
    if (success) {
      toast.success('Coupon created successfully')
      dispatch(clearErrors())
      navigate('/dashboard-coupons')
    }
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
  }, [success, error])

  const [name, setName] = useState('')
  const [value, setValue] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!/^[A-Za-z0-9_-]{3,30}$/.test(name)) {
      toast.error('Codes must be 3–30 letters, numbers, dashes or underscores')
      return
    }
    if (!Number.isFinite(value) || value < 1 || value > 100) {
      toast.error('Discount must be between 1% and 100%')
      return
    }
    if ((minAmount || 0) < 0 || (maxAmount || 0) < 0) {
      toast.error("Amounts can't be negative")
      return
    }
    dispatch(
      createCoupon({
        name,
        value,
        minAmount: minAmount || undefined,
        maxAmount: maxAmount || undefined,
        selectedProduct: selectedProduct || undefined,
      })
    )
  }

  return (
    <div className="w-full 800px:w-[90%] p-3">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Coupon Code *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  pattern="[A-Za-z0-9_-]{3,30}"
                  title="3–30 letters, numbers, dashes or underscores"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Discount Value (%) *</Label>
                <Input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.valueAsNumber)}
                  placeholder="10"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min spend ($)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Max discount ($, 0 = no cap)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.valueAsNumber)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="selectedProduct">Specific Product (optional)</Label>
              <Input
                id="selectedProduct"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                placeholder="Product ID or leave blank for all products"
              />
            </div>

            <Separator />

            <Button type="submit">Create Coupon</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default CreateCoupon
