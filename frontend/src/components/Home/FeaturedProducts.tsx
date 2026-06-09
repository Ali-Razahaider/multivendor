import React from 'react'
import styles from '../../styles/styles';
import { productData } from '../../static/data';    
import ProductCard from '../ProductCard/ProductCard.tsx';
const FeaturedProducts = () => {
  return (
      <div>
          <div className={`${styles.section}`}>
              <div className={`${styles.heading} my-5`}>
                  <h1>Featured Products</h1>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                  {
                      productData && productData.map((product, idx) => (
                          <ProductCard key={`${product.id}-${idx}`} data={product} />
                      ))
            }    
              </div>
          </div>
    </div>
  )
}

export default FeaturedProducts