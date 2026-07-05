import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import WithdrawMoney from '../components/Shop/WithdrawMoney'

const ShopWithdrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={7} />
        </div>
        <div className="w-full p-8">
          <WithdrawMoney />
        </div>
      </div>
    </div>
  )
}

export default ShopWithdrawMoneyPage
