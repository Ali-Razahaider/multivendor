import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/styles'
import ProductCard from '../components/ProductCard/ProductCard'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { getAllProducts } from '../redux/actions/productActions'

const BestSellingPage = () => {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.product)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  useEffect(() => {
    if (products) {
      const sorted = [...products].sort((a, b) => {
        const aSold = a.totalSell ?? a.total_sell ?? 0
        const bSold = b.totalSell ?? b.total_sell ?? 0
        return bSold - aSold
      })
      setData(sorted)
    }
  }, [products])

  return (
    <>
      <Header activeHeading={2} />
      <div className={`${styles.section} flex-col items-center justify-center bg-gray-100 min-h-screen py-10 w-full px-5 md:px-10`}>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 py-5">Best Selling</h1>
        </div>
        {isLoading ? (
          <p className="text-gray-500 text-lg">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {data.map((product) => (
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
