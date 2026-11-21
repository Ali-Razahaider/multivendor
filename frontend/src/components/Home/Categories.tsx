import { Link } from 'react-router-dom';
import { categoriesData } from '../../static/data';
import SectionHeader from './SectionHeader';
import { useCatalog } from '../../hooks/useCatalog';

const Categories = () => {
  const { products } = useCatalog();
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="categories-heading">
      <SectionHeader id="categories-heading" eyebrow="Explore" title="Shop by category" link={{ to: '/products', label: 'Browse all' }} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categoriesData.map((item) => (
          <Link
            key={item.id}
            to={`/products?category=${encodeURIComponent(item.title)}`}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-200/60"
          >
            <img
              src={item.image_Url}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">{item.displayTitle}</h3>
              <p className="mt-0.5 text-xs text-slate-300">
                {counts[item.title] ? `${counts[item.title]} products` : item.subTitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
