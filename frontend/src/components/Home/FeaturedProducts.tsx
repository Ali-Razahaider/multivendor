import { ProductGrid } from '../ProductCard/ProductCard';
import SectionHeader from './SectionHeader';
import { useCatalog } from '../../hooks/useCatalog';

const FeaturedProducts = () => {
  const { products, loading } = useCatalog();
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8);

  if (!loading && newest.length === 0) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="new-heading">
      <SectionHeader id="new-heading" eyebrow="Just in" title="New arrivals" link={{ to: '/products?sort=newest', label: 'See what’s new' }} />
      <ProductGrid products={newest} loading={loading} />
    </section>
  );
};

export default FeaturedProducts;
