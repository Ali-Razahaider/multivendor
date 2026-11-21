import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from '../components/ProductDetails/ProductDetails'
import SuggestedProducts from '../components/ProductDetails/SuggestedProducts'
import server from '../server'
import { useCatalog } from '../hooks/useCatalog'
import { isObjectId, type Product } from '../lib/product'

const DetailsSkeleton = () => (
  <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
    <div className="skeleton aspect-square rounded-3xl" />
    <div className="space-y-4">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-10 w-4/5" />
      <div className="skeleton h-5 w-48" />
      <div className="skeleton h-9 w-40" />
      <div className="skeleton h-12 w-full" />
    </div>
  </div>
)

const slug = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type Status = 'loading' | 'ready' | 'missing' | 'error'

const ProductDetailsPage = () => {
  const { id = '' } = useParams()
  const { products, loading: catalogLoading, retry: retryCatalog } = useCatalog()
  // Fresh copy from the single-product endpoint (latest stock and reviews).
  const [fetched, setFetched] = useState<Product | null>(null)
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'done' | 'notfound' | 'failed'>('idle')
  const [attempt, setAttempt] = useState(0)

  // The catalog is usually already loaded, so the page can render instantly.
  // Legacy links used the product name instead of the id.
  const fromCatalog = isObjectId(id)
    ? products.find((p) => p._id === id)
    : products.find((p) => slug(p.name) === slug(id))

  useEffect(() => {
    if (!isObjectId(id)) return
    let cancelled = false
    setFetched(null)
    setFetchState('loading')
    axios
      .get(`${server}product/${id}`)
      .then(({ data }) => {
        if (cancelled) return
        setFetched(data.product)
        setFetchState('done')
      })
      .catch((err) => {
        if (cancelled) return
        setFetchState(err.response?.status === 404 ? 'notfound' : 'failed')
      })
    return () => {
      cancelled = true
    }
  }, [id, attempt])

  const product = (fetched?._id === id ? fetched : null) || fromCatalog || null

  let status: Status
  if (product) status = 'ready'
  else if (fetchState === 'loading' || catalogLoading) status = 'loading'
  else if (fetchState === 'failed') status = 'error'
  else status = 'missing'

  useEffect(() => {
    if (product) document.title = `${product.name} · Bazaarly`
    return () => {
      document.title = 'Bazaarly — Independent shops, one marketplace'
    }
  }, [product?.name])

  return (
    <>
      <Header activeHeading={3} />
      <main id="main">
        {status === 'loading' && <DetailsSkeleton />}
        {status === 'error' && (
          <div className="container-page py-24 text-center">
            <h1 className="text-2xl font-bold text-slate-900">We couldn’t load this product</h1>
            <p className="mt-2 text-slate-600">Check your connection and try again.</p>
            <button
              type="button"
              className="btn-primary mt-6"
              onClick={() => {
                setAttempt((n) => n + 1)
                retryCatalog()
              }}
            >
              Try again
            </button>
          </div>
        )}
        {status === 'missing' && (
          <div className="container-page py-24 text-center">
            <h1 className="text-2xl font-bold text-slate-900">This product isn’t available</h1>
            <p className="mt-2 text-slate-600">It may have sold out or been removed by the seller.</p>
            <Link to="/products" className="btn-primary mt-6">Browse products</Link>
          </div>
        )}
        {status === 'ready' && product && (
          <>
            <ProductDetails data={product} />
            <SuggestedProducts data={product} />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default ProductDetailsPage
