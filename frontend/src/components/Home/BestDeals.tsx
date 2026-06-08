import { productData } from '../../static/data';
import styles from '../../styles/styles';
import ProductCard from '../ProductCard/ProductCard.tsx';
const BestDeals = () => {
    const data = productData && [...productData].sort((a, b) => a.total_sell - b.total_sell).slice(0, 5);

    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1>Best Deals</h1>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {data && data.map((product, idx) => (
                        <ProductCard key={`${product.id}-${idx}`} data={product} />
                    ))}
                </div>
            </div>
        </div>
  );
};

export default BestDeals;
