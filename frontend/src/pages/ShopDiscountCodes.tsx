import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import AllCoupons from '../components/Shop/AllCoupons';
import CreateCoupon from '../components/Shop/CreateCoupon';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ShopDiscountCodes = () => {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={9} />
        </div>
        <div className="w-full p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Discount Codes</h2>
            <Button onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'View All Coupons' : 'Create New Coupon'}
            </Button>
          </div>
          {showCreate ? <CreateCoupon /> : <AllCoupons />}
        </div>
      </div>
    </div>
  );
};

export default ShopDiscountCodes;
