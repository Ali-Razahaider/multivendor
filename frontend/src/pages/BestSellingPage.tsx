import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../styles/styles'
import ProductCard from '../components/ProductCard/ProductCard'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { getAllProducts } from '../redux/actions/productActions'
import { productData } from '../static/data'

const BestSellingPage = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const allProducts = [...productData, ...(products || [])]
    .sort((a, b) => (b.totalSell ?? b.total_sell ?? 0) - (a.totalSell ?? a.total_sell ?? 0))

  return (
    <>
      <Header activeHeading={2} />
      <div className={`${styles.section} flex-col items-center justify-center bg-gray-100 min-h-screen py-10 w-full px-5 md:px-10`}>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 py-5">Best Selling</h1>
        </div>
        {allProducts.length === 0 ? (
          <p className="text-gray-500 text-lg">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product._id || product.id} data={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default BestSellingPage
