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

  // The homepage highlights complete seller listings; all listings remain in the catalog.
  const sellerHighlights = (products || []).filter((product) =>
    product.name?.trim().length >= 12 &&
    product.description?.trim().length >= 40 &&
    product.images?.length > 0
  )
  const allProducts = [...sellerHighlights, ...productData].slice(0, 10)

  return (
      <div>
          <div className={`${styles.section}`}>
              <div className={`${styles.heading} my-5`}>
                  <h2>Featured finds</h2>
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
