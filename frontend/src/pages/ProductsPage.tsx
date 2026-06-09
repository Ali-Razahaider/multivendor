import {useEffect, useState} from 'react'
import styles from '../styles/styles'
import ProductCard from '../components/ProductCard/ProductCard'
import Header from '../components/Layout/Header'
import { productData } from '../static/data';
import Footer from '../components/Layout/Footer';
import { useSearchParams } from 'react-router';

const ProductsPage = () => {
    const [ searchParams ] = useSearchParams();
    const category = searchParams.get('category');
    const [data, setData] = useState([]);
    
    useEffect(() => {
        // Fetch products based on category
        if (category) {
            const filteredData = productData.filter((product) => product.category === category);
            setData(filteredData);
        } else {
            setData(productData);
        }
    }, [category]);
        
    
    

    return (
        <>
        <Header activeHeading={3} />
        <div className={`${styles.section} flex-col items-center justify-center bg-gray-100 min-h-screen py-10 w-full px-5 md:px-10  `}>
            <div className="w-full flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 py-5">All Products</h1>
            </div>

            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {data.map((product) => (
                    <ProductCard key={product.id} data={product} />
                ))}
            </div>
            </div>
            <Footer />
        </>
    )
};

export default ProductsPage