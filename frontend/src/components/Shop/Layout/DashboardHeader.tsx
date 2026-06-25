import React from 'react';
import { useSelector } from 'react-redux';

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-20 bg-white shadow sticky items-center justify-between px-4 z-30 flex top-0 left-0">
      
    </div>
  );
};

export default DashboardHeader;
