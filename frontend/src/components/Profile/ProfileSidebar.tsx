import React from 'react'
import { RxPerson } from 'react-icons/rx';
import { IoBagHandleOutline, IoChatbubbleOutline, IoArrowBackCircleOutline, IoLocationOutline, IoCardOutline } from 'react-icons/io5';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  server  from '../../server';
function ProfileSidebar({active , setActive}) {
    const navigate = useNavigate();
    const logoutHandler = async() => {
        try {
            const res = await axios.post(`${server}user/logout`, {}, { withCredentials: true });
            if(res.data.success){
                navigate('/login');
                window.location.reload();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const sidebarItems = [
      { id: 1, icon: RxPerson, label: 'Profile' },
      { id: 2, icon: IoBagHandleOutline, label: 'Orders' },
      { id: 3, icon: IoChatbubbleOutline, label: 'Inbox' },
      { id: 4, icon: IoArrowBackCircleOutline, label: 'Refunds' },
      { id: 5, icon: RiLogoutCircleRLine, label: 'Logout', onClick: logoutHandler },
      { id: 6, icon: IoLocationOutline, label: 'Track Order' },
      { id: 7, icon: IoCardOutline, label: 'Payment Methods' },
    ];

  return (
      <div className='w-full h-screen bg-white shadow-sm rounded-sm p-3'>
          {sidebarItems.map((item) => (
            <div key={item.id} className="flex items-center cursor-pointer w-full mb-8" onClick={item.onClick || (() => setActive(item.id))}>
                <item.icon size={25} className={`${active === item.id ? "text-[#f63b60]" : "text-black/50"} `} />
                <span className={`pl-3 text-lg font-medium ${active === item.id ? "text-[#f63b60]" : "text-black/50"} `}>{item.label}</span>
            </div>
          ))}
      </div>
  )
}

export default ProfileSidebar