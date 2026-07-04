import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoPersonOutline } from 'react-icons/io5';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="w-full h-20 bg-white shadow sticky items-center justify-between px-4 z-30 flex top-0 left-0">
      <div>
        <Link to="/admin/dashboard">
          <h1 className="text-xl font-bold text-[crimson]">Admin Panel</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <Link to="/">
          <h5 className="mr-4 text-[16px] text-[#555] hover:text-[crimson] cursor-pointer">Home</h5>
        </Link>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={typeof user.avatar === 'string' ? user.avatar : user.avatar?.url}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <IoPersonOutline size={24} className="text-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
