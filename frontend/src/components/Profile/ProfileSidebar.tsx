import React from 'react'
import { RxPerson } from 'react-icons/rx';
import { IoBagHandleOutline, IoHeartOutline } from 'react-icons/io5';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
function ProfileSidebar({active , setActive}) {
    const navigate = useNavigate();

    const sidebarItems = [
      { id: 1, icon: RxPerson, label: 'Profile' },
      { id: 2, icon: IoBagHandleOutline, label: 'Orders' },
      { id: 3, icon: IoHeartOutline, label: 'Wishlist' },
      { id: 4, icon: RiLogoutCircleRLine, label: 'Logout' },
    ];

  return (
      <div className='w-full h-[100vh] bg-white shadow-sm rounded-[4px] p-3'>
          {sidebarItems.map((item) => (
            <div key={item.id} className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(item.id)}>
                <item.icon size={30} className={`${active === item.id ? "text-[#f63b60]" : "text-[#00000080]"} `} />
                <span className={`pl-3 text-[18px] font-[500] ${active === item.id ? "text-[#f63b60]" : "text-[#00000080]"} `}>{item.label}</span>
            </div>
          ))}
      </div>
  )
}

export default ProfileSidebar