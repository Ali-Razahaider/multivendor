import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from '../components/ProductDetails/ProductDetails'
import SuggestedProducts from '../components/ProductDetails/SuggestedProducts'
import { getAllProducts } from '../redux/actions/productActions'
import { productData } from '../static/data'

const ProductDetailsPage = () => {
    const { name } = useParams()
    const [data, setData] = useState(null)
    const { products } = useSelector((state) => state.product)
    const dispatch = useDispatch()
    const productName = name?.replace(/-/g, ' ')

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    useEffect(() => {
        const all = [...productData, ...(products || [])]
        const found = all.find((item) => item.name === productName)
        setData(found)
    }, [productName, products])

    return (
        <>
            <Header activeHeading={3} />
            <ProductDetails data={data} />
            {data && <SuggestedProducts data={data} />}
            <Footer />
        </>
    )
}

export default ProductDetailsPage
