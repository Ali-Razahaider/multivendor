import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import server from '../../server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: seller?.name || '',
    description: seller?.description || '',
    address: seller?.address || '',
    phoneNumber: seller?.phoneNumber || '',
    zipCode: seller?.zipCode || '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      if (reader.readyState === 2) {
        try {
          const { data } = await axios.put(`${server}shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true },
          )
          if (data.success) {
            dispatch({ type: 'LoadSellerSuccess', payload: data.shop })
            toast.success('Avatar updated')
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Avatar update failed')
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`${server}shop/update-shop`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      if (data.success) {
        dispatch({ type: 'LoadSellerSuccess', payload: data.shop })
        toast.success('Shop updated')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shop Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full border rounded-md px-3 py-2 text-sm" />
          </div>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Update Shop</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ShopSettings
