import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const shopLinks = [
  { label: 'All products', to: '/products' },
  { label: 'Best selling', to: '/best-selling' },
  { label: 'Events', to: '/events' },
];

const helpfulLinks = [
  { label: 'Frequently asked questions', to: '/faq' },
  { label: 'Your account', to: '/profile' },
  { label: 'Become a seller', to: '/shop-create' },
];

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight" aria-label="Bazaarly home">
            <ShoppingBag className="h-7 w-7 text-amber-400" aria-hidden="true" />
            Bazaarly
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
            A place to find your next favorite thing. Browse products across everyday essentials, personal style, gifts, tech, and more.
          </p>
          <Link to="/products" className="mt-6 inline-flex items-center font-semibold text-amber-300 hover:text-amber-200">
            Explore the marketplace <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>

        <nav aria-label="Shop links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Shop</h2>
          <ul className="mt-4 space-y-3">
            {shopLinks.map(({ label, to }) => (
              <li key={to}><Link to={to} className="text-sm text-gray-300 hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Helpful links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Helpful links</h2>
          <ul className="mt-4 space-y-3">
            {helpfulLinks.map(({ label, to }) => (
              <li key={to}><Link to={to} className="text-sm text-gray-300 hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    <div className="border-t border-gray-800 px-5 py-5 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} Bazaarly. All rights reserved.
    </div>
  </footer>
);

export default Footer;
