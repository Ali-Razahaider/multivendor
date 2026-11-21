import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useCatalog } from '../../hooks/useCatalog';
import { onImageError, productImage, sizedImage, type Product } from '../../lib/product';

// Groups the catalog by shop so shoppers can discover sellers, not just items.
const ShopSpotlight = () => {
  const { products } = useCatalog();
  const shops = Object.values(
    products.reduce<Record<string, { id: string; name: string; avatar?: string; items: Product[]; sold: number }>>((acc, p) => {
      if (!p.shopId) return acc;
      acc[p.shopId] ??= { id: p.shopId, name: p.shop?.name || 'Shop', avatar: p.shop?.avatar, items: [], sold: 0 };
      acc[p.shopId].items.push(p);
      acc[p.shopId].sold += p.totalSell ?? 0;
      return acc;
    }, {})
  )
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  if (shops.length < 2) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="shops-heading">
      <SectionHeader id="shops-heading" eyebrow="Meet the makers" title="Featured shops" subtitle="Independent sellers with something special." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shops.map((shop) => (
          <Link key={shop.id} to={`/shop/preview/${shop.id}`} className="card group overflow-hidden p-4 transition-shadow hover:shadow-(--shadow-lift)">
            <div className="grid grid-cols-3 gap-1.5">
              {shop.items.slice(0, 3).map((p) => (
                <img key={p._id} src={sizedImage(productImage(p), 220)} onError={onImageError} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img src={shop.avatar || productImage(shop.items[0])} onError={onImageError} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{shop.name}</p>
                <p className="text-xs text-slate-500">{shop.items.length} products · {shop.sold.toLocaleString()} sold</p>
              </div>
              <ArrowRight size={18} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopSpotlight;
