import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';

function Navbar({ active }) {
  return (
    <nav className="flex h-full items-center gap-1" aria-label="Main navigation">
      {navItems &&
        navItems.map((i, index) => (
          <Link
            to={i.url}
            key={i.url}
            aria-current={active === index + 1 ? 'page' : undefined}
            className={`${active === index + 1 ? 'bg-white/15 text-white' : 'text-indigo-50'} inline-flex h-11 items-center whitespace-nowrap rounded-lg px-3 text-[15px] font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
          >
            {i.title}
          </Link>
        ))}
    </nav>
  );
}

export default Navbar;
