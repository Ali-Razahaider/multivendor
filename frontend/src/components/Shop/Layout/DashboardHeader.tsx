import React from 'react';
import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiShoppingBag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-20 bg-white shadow sticky items-center justify-between px-4 z-30 flex top-0 left-0">
      <div>
        <Link to="/dashboard">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Logo"
          />
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
          <Link to="/dashboard-products">
            <FiShoppingBag size={30} className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
