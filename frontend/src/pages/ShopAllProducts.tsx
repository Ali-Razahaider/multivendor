import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import { getShopProducts } from '../redux/actions/productActions'
import ProductCard from '../components/ProductCard/ProductCard'

const ShopAllProducts = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { products, isLoading } = useSelector((state) => state.product)

  useEffect(() => {
    if (seller?._id) {
      dispatch(getShopProducts(seller._id))
    }
  }, [dispatch, seller?._id])

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={3} />
        </div>
        <div className="w-full justify-center flex p-8">
          {isLoading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-lg">No products yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} data={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopAllProducts
