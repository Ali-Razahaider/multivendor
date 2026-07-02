import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../styles/styles'
import ProductCard from '../components/ProductCard/ProductCard'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { useSearchParams } from 'react-router'
import { getAllProducts } from '../redux/actions/productActions'
import { productData } from '../static/data'

const ProductsPage = () => {
    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.product)
    const [ searchParams ] = useSearchParams()
    const category = searchParams.get('category')

    useEffect(() => {
      dispatch(getAllProducts())
    }, [dispatch])

    const allProducts = [...productData, ...(products || [])]
    const data = category
      ? allProducts.filter((p) => p.category === category)
      : allProducts

    return (
        <>
        <Header activeHeading={3} />
        <div className={`${styles.section} flex-col items-center justify-center bg-gray-100 min-h-screen py-10 w-full px-5 md:px-10  `}>
            <div className="w-full flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 py-5">All Products</h1>
            </div>

            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {data.map((product, idx) => (
                    <ProductCard key={`${product._id || product.id}-${idx}`} data={product} />
                ))}
                    {data.length === 0 && (
                        <p className="text-gray-500 text-center my-2.5 col-span-full">No products found in this category.</p>
                    )}
                
                </div>
                
            </div>
            <Footer />
        </>
    )
};

export default ProductsPage
