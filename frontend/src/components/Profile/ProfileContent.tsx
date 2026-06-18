import React from 'react'
import { useSelector } from 'react-redux';
function ProfileContent({ active }) {
  const { user } = useSelector((state) => state.user);
  return (
    <div className='w-full'>
      {active === 1 && (
        <div className="flex justify-center w-full">
          <div className="relative">
            <img
              src={user?.avatar?.url}
              className="size-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileContent
