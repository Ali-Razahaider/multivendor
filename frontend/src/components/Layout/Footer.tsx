import { Link } from 'react-router-dom';
import { Lock, RotateCcw, Truck, Wallet } from 'lucide-react';
import Logo from '../brand/Logo';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Best sellers', to: '/best-selling' },
      { label: 'Deals & events', to: '/events' },
      { label: 'Gifts', to: '/products?category=Gifts' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'Your orders', to: '/profile' },
      { label: 'Help & FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { label: 'Open a shop', to: '/shop-create' },
      { label: 'Seller sign in', to: '/shop-login' },
      { label: 'Seller dashboard', to: '/dashboard' },
    ],
  },
];

const promises = [
  { icon: Lock, title: 'Secure payments', text: 'Card payments processed by Stripe' },
  { icon: Wallet, title: 'Cash on delivery', text: 'Pay when your order arrives' },
  { icon: Truck, title: 'Tracked orders', text: 'Follow every step to your door' },
  { icon: RotateCcw, title: 'Easy refunds', text: 'Request a refund after delivery' },
];

const Footer = () => (
  <footer className="mt-20 bg-slate-950 text-slate-300">
    <div className="border-b border-white/10">
      <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-brand-200 ring-1 ring-white/10">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-400">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="container-page grid gap-10 py-14 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Logo inverted />
        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
          Bazaarly brings independent shops together in one marketplace — discover tech, fashion, beauty, gifts and pet
          supplies from sellers who care.
        </p>
      </div>
      {columns.map((col) => (
        <div key={col.title}>
          <h2 className="text-sm font-semibold text-white">{col.title}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-slate-400 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-white/10">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Bazaarly. All rights reserved.</p>
        <p>Prices in USD. Payments secured by Stripe.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
