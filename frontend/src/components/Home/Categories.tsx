import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { brandingData, categoriesData } from '../../static/data';

const Categories = () => (
  <section className={`${styles.section} mb-14`} id="categories" aria-labelledby="categories-heading">
    <div className="mb-10 grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
      {brandingData.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <span className="shrink-0" aria-hidden="true">{item.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 md:text-base">{item.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500 md:text-sm">{item.Description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mb-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Explore the collection</p>
      <h2 id="categories-heading" className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        Shop by category
      </h2>
      <p className="mt-2 text-sm text-gray-600">Thoughtful finds for every part of your day.</p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categoriesData.map((item) => (
        <Link
          key={item.id}
          to={`/products?category=${encodeURIComponent(item.title)}`}
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              src={item.image_Url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
              {item.displayTitle || item.title}
            </h3>
            <p className="mt-1 hidden text-xs leading-relaxed text-gray-500 sm:block">{item.subTitle}</p>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default Categories;
