import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'
import { getAllProducts } from '../../redux/actions/productActions'

const BestDeals = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  useEffect(() => {
    if (products) {
      const sorted = [...products]
        .sort((a, b) => {
          const aSold = a.totalSell ?? a.total_sell ?? 0
          const bSold = b.totalSell ?? b.total_sell ?? 0
          return bSold - aSold
        })
        .slice(0, 5)
      setData(sorted)
    }
  }, [products])

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {data.map((product, idx) => (
            <ProductCard key={`${product._id || product.id}-${idx}`} data={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BestDeals
