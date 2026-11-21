import { ProductGrid } from '../ProductCard/ProductCard';
import SectionHeader from './SectionHeader';
import { useCatalog } from '../../hooks/useCatalog';
import { discountPercent, hasDiscount, inStock } from '../../lib/product';

const BestDeals = () => {
  const { products, loading } = useCatalog();
  const deals = products
    .filter((p) => hasDiscount(p) && inStock(p))
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 8);

  if (!loading && deals.length === 0) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="deals-heading">
      <SectionHeader
        id="deals-heading"
        eyebrow="Save more"
        title="Today’s best deals"
        subtitle="The biggest markdowns from shops across the marketplace."
        link={{ to: '/products?sort=discount', label: 'All deals' }}
      />
      <ProductGrid products={deals} loading={loading} />
    </section>
  );
};

export default BestDeals;
