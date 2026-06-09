import React from 'react';
import styles from '../../styles/styles';

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-6 mt-12 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <span className="font-bold text-lg">Sponsored by</span>
      <div className="flex justify-between w-full">
        <div className=" flex items-center">
          <img
            src="https://images.seeklogo.com/logo-png/12/1/sony-logo-png_seeklogo-129420.png"
            alt=""
            className=""
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div className=" flex items-center">
          <img
            src="https://1000logos.net/wp-content/uploads/2020/09/SpaceX-Logo.png"
            alt=""
            className=""
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div className=" flex items-center">
          <img
            src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/RWCZER-Legal-IP-Trademarks-CP-MS-logo-740x417-1?wid=380&hei=213&fit=crop"
            alt=""
            className=""
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div className=" flex items-center">
          <img
            src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
            alt=""
            className=""
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div className=" flex items-center">
          <img
            src="https://1000logos.net/wp-content/uploads/2018/02/Ford-Logo.png"
            alt=""
            className=""
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>

      </div>
    </div>
  );
};

export default Sponsored;
