import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'
import { getAllProducts } from '../../redux/actions/productActions'
import { productData } from '../../static/data'

const BestDeals = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const allProducts = [...productData, ...(products || [])]
    .sort((a, b) => (b.totalSell ?? b.total_sell ?? 0) - (a.totalSell ?? a.total_sell ?? 0))
    .slice(0, 5)

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {allProducts.map((product, idx) => (
            <ProductCard key={`${product._id || product.id}-${idx}`} data={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BestDeals
