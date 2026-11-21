import { ProductGrid } from '../ProductCard/ProductCard';
import SectionHeader from './SectionHeader';
import { useCatalog } from '../../hooks/useCatalog';

const BestSellers = () => {
  const { products, loading } = useCatalog();
  const top = [...products].sort((a, b) => (b.totalSell ?? 0) - (a.totalSell ?? 0)).slice(0, 8);

  if (!loading && top.length === 0) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="top-heading">
      <SectionHeader id="top-heading" eyebrow="Loved by shoppers" title="Best sellers" link={{ to: '/best-selling', label: 'View all' }} />
      <ProductGrid products={top} loading={loading} />
    </section>
  );
};

export default BestSellers;
