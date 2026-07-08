import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import styles from '../../styles/styles'
import { getShopProducts } from '../../redux/actions/productActions'
import { getShopEvents } from '../../redux/actions/eventActions'
import { productData } from '../../static/data'

const tabs = [
  { id: 'products', label: 'Shop Products' },
  { id: 'reviews', label: 'Shop Reviews' },
  { id: 'events', label: 'Events' },
]

const ShopProfileData = ({ isOwner }) => {
  const [active, setActive] = useState('products')
  const dispatch = useDispatch()
  const { id } = useParams()
  const { products } = useSelector((state) => state.product)
  const { events } = useSelector((state) => state.events)

  useEffect(() => {
    if (id) {
      dispatch(getShopProducts(id))
      dispatch(getShopEvents(id))
    }
  }, [dispatch, id])

  return (
    <div className="w-full bg-[#fff] rounded-[4px] shadow-sm p-5">
      <div className="flex items-center justify-between border-b border-[#e3e3e3] pb-3">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`mr-8 pb-2 cursor-pointer ${active === tab.id ? 'border-b-2 border-b-indigo-500' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              <h5 className={`font-[600] text-[18px] ${active === tab.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                {tab.label}
              </h5>
            </div>
          ))}
        </div>
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} !w-auto !px-4 !h-[36px] !rounded-[5px]`}>
              <span className="text-white text-sm">Go to Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      {active === 'products' && (
        <div className="py-5">
          {(() => {
            const displayProducts = products || []
            return displayProducts.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-[#000000a6] text-[16px]">No products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                {displayProducts.map((product, idx) => (
                  <ProductCard key={product._id || product.id || idx} data={product} />
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {active === 'reviews' && (
        <div className="py-5">
          {(() => {
            const displayProducts = products || []
            const allReviews = displayProducts.flatMap(
              (product) => product.reviews?.map((review) => ({ ...review, productName: product.name })) || []
            )
            return !allReviews || allReviews.length === 0 ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-[#000000a6] text-[16px]">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allReviews.map((review, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-[500] text-[15px] text-blue-500">{review.productName}</h5>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) =>
                          review.rating >= star ? (
                            <AiFillStar key={star} size={16} className="text-yellow-500" />
                          ) : (
                            <AiOutlineStar key={star} size={16} className="text-gray-400" />
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-[#000000a6] text-[14px]">{review.comment}</p>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {active === 'events' && (
        <div className="py-5">
          {!events || events.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-[#000000a6] text-[16px]">No events yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {events.map((event, idx) => (
                <ProductCard key={event._id || idx} data={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ShopProfileData
