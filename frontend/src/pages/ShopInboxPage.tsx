import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import DashboardMessages from '../components/Shop/DashboardMessages'

const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={8} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-4">Shop Inbox</h3>
          <DashboardMessages />
        </div>
      </div>
    </div>
  )
}

export default ShopInboxPage
