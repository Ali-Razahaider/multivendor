import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { ProductGrid } from '../components/ProductCard/ProductCard'
import { useCatalog } from '../hooks/useCatalog'

const BestSellingPage = () => {
  const { products, loading } = useCatalog()
  const ranked = [...products].sort((a, b) => (b.totalSell ?? 0) - (a.totalSell ?? 0))

  return (
    <>
      <Header activeHeading={2} />
      <main id="main" className="container-page py-10">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Loved by shoppers</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Best sellers</h1>
        <p className="mt-2 text-slate-600">The most popular products across every shop, updated as orders come in.</p>
        <div className="mt-8">
          {!loading && ranked.length === 0 ? (
            <p className="card p-10 text-center text-slate-600">No products yet — check back soon.</p>
          ) : (
            <ProductGrid products={ranked} loading={loading} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BestSellingPage
