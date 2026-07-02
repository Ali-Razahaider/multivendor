import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { productData } from '../../static/data'
import styles from '../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'

function SuggestedProducts({ data }) {
    const { products: apiProducts } = useSelector((state) => state.product)
    const [products, setProducts] = useState(null)

    useEffect(() => {
        if (!data) return

        const allProducts = [...productData, ...(apiProducts || [])]

        let sameCategory = allProducts.filter(
            (i) => i.category === data.category && i.name !== data.name
        )

        if (sameCategory.length === 0) {
            sameCategory = [...allProducts]
                .sort((a, b) => (b.totalSell ?? b.total_sell ?? 0) - (a.totalSell ?? a.total_sell ?? 0))
                .slice(0, 5)
                .filter((i) => i.name !== data.name)
        }

        setProducts(sameCategory)
    }, [data, apiProducts])

    if (!products || products.length === 0) return null

    return (
        <div className={`${styles.section} my-8`}>
            <div className={`${styles.heading}`}>
                <h1>Related Products</h1>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                {products.map((product, idx) => (
                    <ProductCard key={`${product._id || product.id}-${idx}`} data={product} />
                ))}
            </div>
        </div>
    )
}

export default SuggestedProducts
