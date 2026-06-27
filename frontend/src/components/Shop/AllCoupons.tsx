import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShopCoupons, deleteCoupon } from '../../redux/actions/couponActions'
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

const AllCoupons = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { coupons, isLoading } = useSelector((state) => state.coupon)

  useEffect(() => {
    if (seller?._id) {
      dispatch(getShopCoupons(seller._id))
    }
  }, [dispatch, seller?._id])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      dispatch(deleteCoupon(id))
      toast.success('Coupon deleted')
    }
  }

  return (
    <>
      {isLoading ? (
        <p className="text-gray-500 text-lg">Loading...</p>
      ) : coupons.length === 0 ? (
        <p className="text-gray-500 text-lg">No coupons yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Amount</TableHead>
              <TableHead>Max Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className="font-medium uppercase">{coupon.name}</TableCell>
                <TableCell>{coupon.value}%</TableCell>
                <TableCell>${coupon.minAmount || 0}</TableCell>
                <TableCell>${coupon.maxAmount || 'No limit'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default AllCoupons
