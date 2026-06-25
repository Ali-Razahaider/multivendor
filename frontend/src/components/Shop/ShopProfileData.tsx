import React from 'react'

const ShopProfileData = ({ isOwner }) => {
  return (
    <div className="w-full bg-[#fff] rounded-[4px] shadow-sm p-5">
      <div className="flex items-center border-b border-[#e3e3e3] pb-3">
        <div className="mr-8 pb-2 border-b-2 border-b-[#f63b60] cursor-pointer">
          <h5 className="font-[600] text-[18px]">Shop Products</h5>
        </div>
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-[#000000a6] text-[16px]">No products yet</p>
      </div>
    </div>
  )
}

export default ShopProfileData
