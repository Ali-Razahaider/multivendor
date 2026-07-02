import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/styles';
import ProductCard from '../ProductCard/ProductCard.tsx';
import { getAllProducts } from '../../redux/actions/productActions';
import { productData } from '../../static/data';

const FeaturedProducts = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const allProducts = [...productData, ...(products || [])]

  return (
      <div>
          <div className={`${styles.section}`}>
              <div className={`${styles.heading} my-5`}>
                  <h1>Featured Products</h1>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                  {
                    allProducts.map((product, idx) => (
                      <ProductCard key={`${product._id || product.id}-${idx}`} data={product} />
                    ))
                  }
              </div>
          </div>
    </div>
  )
}

export default FeaturedProducts