import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Store } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

const Hero = () => {
  const { products } = useCatalog();
  const shopCount = new Set(products.map((p) => p.shopId)).size;

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <img
        src="/images/marketplace-hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-brand-900/40" />
      <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-3xl" aria-hidden="true" />

      <div className="container-page relative py-16 sm:py-20 lg:py-28">
        <div className="animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
            <Store size={14} aria-hidden="true" />
            {shopCount > 0 ? `${shopCount} independent shops · ${products.length}+ products` : 'Independent shops, one marketplace'}
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover more of <span className="bg-gradient-to-r from-brand-200 to-amber-200 bg-clip-text text-transparent">what you love</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Tech, fashion, beauty, gifts and pet supplies from sellers who care — with secure checkout and cash on delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary h-12 px-6 text-base">
              Start shopping <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/best-selling" className="btn h-12 bg-white/10 px-6 text-base text-white ring-1 ring-white/20 hover:bg-white/15">
              Best sellers
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" aria-hidden="true" />
              <dt className="sr-only">Payments</dt>
              <dd>Secure Stripe payments</dd>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} className="fill-amber-400 text-amber-400" aria-hidden="true" />
              <dt className="sr-only">Reviews</dt>
              <dd>Reviews from verified buyers</dd>
            </div>
          </dl>
        </div>

      </div>
    </section>
  );
};

export default Hero;
