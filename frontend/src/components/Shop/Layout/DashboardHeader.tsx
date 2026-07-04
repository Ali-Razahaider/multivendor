import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiShoppingBag } from 'react-icons/fi';
import { IoPersonOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-20 bg-white shadow sticky items-center justify-between px-4 z-30 flex top-0 left-0">
      <div>
        <Link to="/dashboard">
            <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-indigo-700">
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.96A58.734 58.734 0 0 0 5.69 4.38l-.692-2.587a.75.75 0 0 0-.724-.543H2.25Z" />
              <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            </svg>
            <span className="text-gray-900 text-xl font-extrabold tracking-tight">MultiShop</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="items-center flex mr-4">
          <Link to="/dashboard-coupons" className="mr-4">
            <AiOutlineGift size={30} className="cursor-pointer" />
          </Link>
          <Link to="/dashboard-events" className="mr-4">
            <MdOutlineLocalOffer size={30} className="cursor-pointer" />
          </Link>
          <Link to="/dashboard-products" className="mr-4">
            <FiShoppingBag size={30} className="cursor-pointer" />
          </Link>
          <Link to={`/shop/${seller?._id}`}>
            {seller?.avatar ? (
              <img
                src={typeof seller.avatar === 'string' ? seller.avatar : seller.avatar?.url}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <IoPersonOutline size={28} className="cursor-pointer text-gray-600" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
