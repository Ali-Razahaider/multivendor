import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import Logo from '../brand/Logo';

const AdminHeader = () => {
  const { user } = useSelector((state: any) => state.user);
  const avatar = typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url;
  return (
    <header className="sticky top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:h-[72px]">
      <Logo to="/admin/dashboard" subtitle="Admin" markClassName="h-8 w-8" textClassName="text-[1.35rem]" />
      <div className="flex items-center gap-2">
        <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
          <Home size={18} aria-hidden="true" /> <span className="hidden sm:inline">Storefront</span>
        </Link>
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <User size={20} className="text-slate-600" />}
        </span>
      </div>
    </header>
  );
};

export default AdminHeader;
