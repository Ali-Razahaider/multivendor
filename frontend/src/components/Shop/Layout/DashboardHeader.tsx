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
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
            </svg>
            <span className="bazaarly-wordmark text-gray-900 font-extrabold tracking-tight">Bazaarly</span>
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
