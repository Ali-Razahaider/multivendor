import { ProductGrid } from '../ProductCard/ProductCard'
import SectionHeader from '../Home/SectionHeader'
import { useCatalog } from '../../hooks/useCatalog'
import type { Product } from '../../lib/product'

function SuggestedProducts({ data }: { data: Product }) {
  const { products } = useCatalog()
  const others = products.filter((p) => p._id !== data._id)
  const sameCategory = others.filter((p) => p.category === data.category)
  const related = (sameCategory.length >= 4 ? sameCategory : [...sameCategory, ...others.filter((p) => p.category !== data.category)])
    .sort((a, b) => (b.totalSell ?? 0) - (a.totalSell ?? 0))
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="container-page pb-6" aria-labelledby="related-heading">
      <SectionHeader id="related-heading" title="You may also like" link={data.category ? { to: `/products?category=${encodeURIComponent(data.category)}`, label: 'More like this' } : undefined} />
      <ProductGrid products={related} />
    </section>
  )
}

export default SuggestedProducts
