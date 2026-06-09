import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';

interface NavItem {
  title: string;
  url: string;
}

function Navbar({ active }) {
  return (
    <div className={`${styles.normalFlex} `}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex " key={index}>
            <Link
              to={i.url}
              className={`${active === index + 1 ? 'text-green-900' : 'text-white'} font-semibold text-lg px-3 py-2 rounded-md`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default Navbar;
