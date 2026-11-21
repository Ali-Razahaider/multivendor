import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Gift, Package, Tag, User } from 'lucide-react';
import Logo from '../../brand/Logo';

const shortcuts = [
  { to: '/dashboard-coupons', label: 'Coupons', icon: Gift },
  { to: '/dashboard-events', label: 'Events', icon: Tag },
  { to: '/dashboard-products', label: 'Products', icon: Package },
];

const DashboardHeader = () => {
  const { seller } = useSelector((state: any) => state.seller);
  const avatar = typeof seller?.avatar === 'string' ? seller.avatar : seller?.avatar?.url;
  return (
    <header className="sticky top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:h-[72px]">
      <Logo to="/dashboard" subtitle="Seller" markClassName="h-8 w-8" textClassName="text-[1.35rem]" />
      <nav className="flex items-center gap-1" aria-label="Seller shortcuts">
        {shortcuts.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <Icon size={20} />
          </Link>
        ))}
        <Link to={`/shop/${seller?._id}`} aria-label="My shop" className="ml-2 flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100">
          {avatar ? (
            <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
          ) : (
            <User size={22} className="text-slate-600" />
          )}
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-700 md:inline">{seller?.name}</span>
        </Link>
      </nav>
    </header>
  );
};

export default DashboardHeader;
