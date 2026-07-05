import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Loader from '../Layout/Loader'
import styles from '../../styles/styles'
import axios from 'axios'
import server from '../../server'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const fallbackShop = {
  _id: 'fallback-shop-1',
  name: 'Apple Inc.',
  description: 'Leading technology company specializing in consumer electronics, software, and services.',
  address: '123 Innovation Drive, Cupertino, CA 95014',
  phoneNumber: '+1 (408) 996-1010',
  avatar: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
  createdAt: '2024-01-15T00:00:00.000Z',
}

const ShopInfo = ({ isOwner }) => {
  const { seller, isLoading: sellerLoading } = useSelector((state) => state.seller)
  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [loggingOut, setLoggingOut] = useState(false)

  const averageRating = products.length
    ? (products.reduce((sum, p) => sum + (p.ratings ?? p.rating ?? 0), 0) / products.length).toFixed(1)
    : 0

  useEffect(() => {
    const shopId = isOwner ? seller?._id : id
    if (!shopId) return
    setLoading(true)
    const promises = [
      isOwner
        ? Promise.resolve({ data: { shop: seller } })
        : axios.get(`${server}shop/get-shop-info/${shopId}`),
      axios.get(`${server}product/shop/${shopId}`),
    ]
    Promise.all(promises)
      .then(([shopRes, prodRes]) => {
        if (!isOwner) setData(shopRes.data.shop)
        setProducts(prodRes.data.products || [])
        setLoading(false)
      })
      .catch(() => {
        if (!isOwner) setData(fallbackShop)
        setLoading(false)
      })
  }, [id, seller])

  const logoutHandler = async () => {
    setLoggingOut(true)
    try {
      const res = await axios.post(`${server}shop/logout`, {}, { withCredentials: true })
      if (res.data.success) {
        window.location.reload()
        navigate('/shop-login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  const displayData = isOwner ? seller : data

  return (
    <>
      {isOwner ? (sellerLoading ? <Loader /> : null) : (loading ? <Loader /> : null)}
      {displayData && (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={typeof displayData?.avatar === 'string' ? displayData.avatar : displayData?.avatar?.url || ''}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{displayData?.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {displayData?.description}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">{products && products.length}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <h4 className="text-[#000000b0]">{averageRating}/5</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">{displayData?.createdAt?.slice(0, 10)}</h4>
          </div>
          {isOwner && (
            <>
              <div className="p-3">
                <h5 className="font-[600]">Address</h5>
                <h4 className="text-[#000000a6]">{displayData?.address}</h4>
              </div>
              <div className="p-3">
                <h5 className="font-[600]">Phone Number</h5>
                <h4 className="text-[#000000a6]">{displayData?.phoneNumber}</h4>
              </div>
            </>
          )}
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px] ${loggingOut ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={logoutHandler}
              >
                <span className="text-white flex items-center justify-center gap-2">
                  {loggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                  Log Out
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {!isOwner && !data && !loading && (
        <div className="p-8 text-center text-gray-500">Shop not found</div>
      )}
    </>
  )
}

export default ShopInfo
