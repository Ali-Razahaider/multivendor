import { useState, useEffect } from 'react'
import { productData } from '../../static/data'
import styles from '../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'

function SuggestedProducts({ data }) {
    const [products, setProducts] = useState(null)

    useEffect(() => {
        if (!data) return

        let sameCategory = productData.filter(
            (i) => i.category === data.category && i.name !== data.name
        )

        if (sameCategory.length === 0) {
            sameCategory = [...productData]
                .sort((a, b) => b.total_sell - a.total_sell)
                .slice(0, 5)
                .filter((i) => i.name !== data.name)
        }

        setProducts(sameCategory)
    }, [data])

    if (!products || products.length === 0) return null

    return (
        <div className={`${styles.section} my-8`}>
            <div className={`${styles.heading}`}>
                <h1>Related Products</h1>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                {products.map((product, idx) => (
                    <ProductCard key={`${product.id}-${idx}`} data={product} />
                ))}
            </div>
        </div>
    )
}

export default SuggestedProducts
