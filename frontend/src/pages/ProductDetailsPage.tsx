import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import ProductDetails from '../components/ProductDetails/ProductDetails'
import SuggestedProducts from '../components/ProductDetails/SuggestedProducts'
import { useEffect } from 'react'
import { productData } from '../static/data'
const ProductDetailsPage = () => {
    const { name } = useParams()
    const [data, setData] = useState(null)
    const productName = name?.replace(/-/g, ' ')

    useEffect(() => {
        const found = productData.find((item) => item.name === productName)
        setData(found)
    }, )

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
