import { Link } from 'react-router-dom';
import { BadgeDollarSign, MessageCircle, PackageCheck } from 'lucide-react';

const perks = [
  { icon: PackageCheck, text: 'List products in minutes' },
  { icon: MessageCircle, text: 'Chat directly with buyers' },
  { icon: BadgeDollarSign, text: 'Withdraw earnings any time' },
];

const SellerCta = () => (
  <section className="container-page py-14 sm:py-16">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-12 text-white sm:px-12">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Turn your passion into a shop</h2>
          <p className="mt-3 max-w-lg text-brand-100">Join independent sellers reaching new customers on Bazaarly. No setup fees — just list and sell.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop-create" className="btn h-12 bg-white px-6 text-base text-brand-700 hover:bg-brand-50">Open your shop</Link>
            <Link to="/shop-login" className="btn h-12 px-6 text-base text-white ring-1 ring-white/30 hover:bg-white/10">Seller sign in</Link>
          </div>
        </div>
        <ul className="grid gap-3">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <Icon size={22} className="text-brand-100" aria-hidden="true" />
              <span className="font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default SellerCta;
