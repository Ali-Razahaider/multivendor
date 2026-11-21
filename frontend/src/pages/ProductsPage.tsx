import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { ProductGrid } from '../components/ProductCard/ProductCard';
import { categoriesData } from '../static/data';
import { useCatalog } from '../hooks/useCatalog';
import { discountPercent, hasDiscount, inStock, matchesQuery, sellingPrice, type Product } from '../lib/product';

const SORTS: Record<string, { label: string; compare: (a: Product, b: Product) => number }> = {
  featured: { label: 'Featured', compare: (a, b) => (b.ratings ?? 0) * 100 + (b.totalSell ?? 0) / 10 - ((a.ratings ?? 0) * 100 + (a.totalSell ?? 0) / 10) },
  newest: { label: 'Newest', compare: (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() },
  bestselling: { label: 'Best selling', compare: (a, b) => (b.totalSell ?? 0) - (a.totalSell ?? 0) },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => sellingPrice(a) - sellingPrice(b) },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => sellingPrice(b) - sellingPrice(a) },
  rating: { label: 'Top rated', compare: (a, b) => (b.ratings ?? 0) - (a.ratings ?? 0) },
  discount: { label: 'Biggest discount', compare: (a, b) => discountPercent(b) - discountPercent(a) },
};

const PRICE_BANDS = [
  { id: 'under-50', label: 'Under $50', test: (p: number) => p < 50 },
  { id: '50-200', label: '$50 – $200', test: (p: number) => p >= 50 && p <= 200 },
  { id: '200-500', label: '$200 – $500', test: (p: number) => p > 200 && p <= 500 },
  { id: 'over-500', label: 'Over $500', test: (p: number) => p > 500 },
];

const ProductsPage = () => {
  const { products, loading, error, retry } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = SORTS[params.get('sort') || ''] ? (params.get('sort') as string) : 'featured';
  const price = params.get('price') || '';
  const onlyInStock = params.get('stock') === '1';
  const onlyDeals = params.get('deals') === '1';
  const selectedCategory = categoriesData.find((c) => c.title === category);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === price);
    return products
      .filter((p) => (!category || p.category === category) && matchesQuery(p, query))
      .filter((p) => !band || band.test(sellingPrice(p)))
      .filter((p) => !onlyInStock || inStock(p))
      .filter((p) => !onlyDeals || hasDiscount(p))
      .sort(SORTS[sort].compare);
  }, [products, category, query, price, onlyInStock, onlyDeals, sort]);

  const activeFilters = [
    query && { key: 'q', label: `“${query}”` },
    selectedCategory && { key: 'category', label: selectedCategory.displayTitle },
    price && { key: 'price', label: PRICE_BANDS.find((b) => b.id === price)?.label },
    onlyInStock && { key: 'stock', label: 'In stock' },
    onlyDeals && { key: 'deals', label: 'On sale' },
  ].filter(Boolean) as { key: string; label: string }[];

  const title = query ? `Results for “${query}”` : selectedCategory?.displayTitle || 'All products';

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Category</h3>
        <ul className="space-y-1">
          <li>
            <button type="button" onClick={() => update('category', null)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${!category ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              All categories
            </button>
          </li>
          {categoriesData.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => update('category', c.title)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${category === c.title ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                {c.displayTitle}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Price</legend>
        <div className="space-y-2">
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input type="radio" name="price" checked={price === b.id} onChange={() => update('price', b.id)} className="h-4 w-4 accent-brand-600" />
              {b.label}
            </label>
          ))}
          {price && (
            <button type="button" onClick={() => update('price', null)} className="text-xs font-medium text-brand-700 hover:underline">
              Any price
            </button>
          )}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="mb-3 text-sm font-semibold text-slate-900">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input type="checkbox" checked={onlyInStock} onChange={(e) => update('stock', e.target.checked ? '1' : null)} className="h-4 w-4 rounded accent-brand-600" />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input type="checkbox" checked={onlyDeals} onChange={(e) => update('deals', e.target.checked ? '1' : null)} className="h-4 w-4 rounded accent-brand-600" />
          On sale
        </label>
      </fieldset>
    </div>
  );

  return (
    <>
      <Header activeHeading={3} />
      <main id="main" className="container-page py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-800">Home</Link> <span aria-hidden="true">/</span>{' '}
          <span className="text-slate-800">{selectedCategory?.displayTitle || 'Products'}</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {loading ? 'Loading products…' : `${results.length} ${results.length === 1 ? 'product' : 'products'}`}
              {selectedCategory && !query ? ` · ${selectedCategory.subTitle}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setFiltersOpen(true)} className="btn-secondary lg:hidden">
              <SlidersHorizontal size={16} /> Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}
            </button>
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? null : e.target.value)} className="field w-auto pr-8">
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <button key={f.key} type="button" onClick={() => update(f.key, null)} className="badge gap-1.5 bg-white py-1 pl-3 pr-2 text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300">
                {f.label} <X size={13} aria-label="Remove filter" />
              </button>
            ))}
            <button type="button" onClick={() => setParams(sort !== 'featured' ? { sort } : {}, { replace: true })} className="text-xs font-semibold text-brand-700 hover:underline">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>
          <div>
            {error ? (
              <div className="card p-10 text-center">
                <p className="font-semibold text-slate-900">We couldn’t load products.</p>
                <p className="mt-1 text-sm text-slate-600">{error}</p>
                <button type="button" onClick={retry} className="btn-primary mt-5">Try again</button>
              </div>
            ) : !loading && results.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">No products match your filters</p>
                <p className="mt-1 text-sm text-slate-600">Try a different search or remove a filter.</p>
                <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-secondary mt-5">Reset filters</button>
              </div>
            ) : (
              <ProductGrid products={results} loading={loading} skeletons={9} className="lg:grid-cols-3 xl:grid-cols-4" />
            )}
          </div>
        </div>
      </main>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-slate-950/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filters}</div>
            <div className="border-t border-slate-100 p-4">
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary w-full">
                Show {results.length} products
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductsPage;
