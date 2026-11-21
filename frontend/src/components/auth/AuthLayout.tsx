import type { ReactNode } from 'react';
import { BadgeCheck, Lock, Store, Truck } from 'lucide-react';
import Logo from '../brand/Logo';

const shopperPoints = [
  { icon: Store, text: 'Shop independent sellers in one place' },
  { icon: Lock, text: 'Secure card payments or cash on delivery' },
  { icon: Truck, text: 'Track every order to your door' },
];

const sellerPoints = [
  { icon: Store, text: 'Open your shop in minutes' },
  { icon: BadgeCheck, text: 'Reach shoppers across the marketplace' },
  { icon: Lock, text: 'Get paid securely and withdraw any time' },
];

type Props = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'shopper' | 'seller';
  wide?: boolean;
};

// Split-screen layout shared by sign-in, sign-up and password pages.
const AuthLayout = ({ title, subtitle, children, footer, variant = 'shopper', wide = false }: Props) => {
  const points = variant === 'seller' ? sellerPoints : shopperPoints;
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <Logo inverted subtitle={variant === 'seller' ? 'Seller' : undefined} className="relative" />
        <div className="relative">
          <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">
            {variant === 'seller' ? 'Grow your business with Bazaarly' : 'Independent shops. One marketplace.'}
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-brand-50">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon size={18} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-brand-200">© {new Date().getFullYear()} Bazaarly</p>
      </aside>

      <main id="main" className="flex flex-col px-4 py-8 sm:px-6 lg:py-12">
        <div className="lg:hidden">
          <Logo subtitle={variant === 'seller' ? 'Seller' : undefined} />
        </div>
        <div className={`m-auto w-full ${wide ? 'max-w-xl' : 'max-w-md'} pt-8 lg:pt-0`}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          <div className="card mt-8 p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
