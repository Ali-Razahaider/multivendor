import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import AllRefundOrders from '../components/Shop/AllRefundOrders'

const ShopRefundsPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={10} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">Refund Requests</h3>
          <AllRefundOrders />
        </div>
      </div>
    </div>
  )
}

export default ShopRefundsPage
