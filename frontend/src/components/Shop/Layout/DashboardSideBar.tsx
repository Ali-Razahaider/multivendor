import { AiOutlineGift, AiOutlineFolderAdd } from "react-icons/ai"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { MdOutlineLocalOffer } from "react-icons/md"
import { RxDashboard } from "react-icons/rx"
import { VscNewFile } from "react-icons/vsc"
import { CiMoneyBill, CiSettings } from "react-icons/ci"
import { BiMessageSquareDetail } from "react-icons/bi"
import { HiOutlineReceiptRefund } from "react-icons/hi"
import { Link } from "react-router-dom"

const menuItems = [
  { id: 1, icon: RxDashboard, label: "Dashboard", path: "/dashboard" },
  { id: 2, icon: FiShoppingBag, label: "All Orders", path: "/dashboard-orders" },
  { id: 3, icon: FiPackage, label: "All Products", path: "/dashboard-products" },
  { id: 4, icon: AiOutlineFolderAdd, label: "Create Product", path: "/dashboard-create-product" },
  { id: 5, icon: MdOutlineLocalOffer, label: "All Events", path: "/dashboard-events" },
  { id: 6, icon: VscNewFile, label: "Create Event", path: "/dashboard-create-event" },
  { id: 7, icon: CiMoneyBill, label: "Withdraw Money", path: "/dashboard-withdraw-money" },
  { id: 8, icon: BiMessageSquareDetail, label: "Shop Inbox", path: "/dashboard-messages" },
  { id: 9, icon: AiOutlineGift, label: "Discount Codes", path: "/dashboard-coupouns" },
  { id: 10, icon: HiOutlineReceiptRefund, label: "Refunds", path: "/dashboard-refunds" },
  { id: 11, icon: CiSettings, label: "Settings", path: "/settings" },
]

function DashboardSideBar({ active }) {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <div key={item.id} className="w-full flex items-center p-4">
            <Link to={item.path} className="w-full flex items-center">
              <Icon size={30} color={isActive ? "crimson" : "#555"} />
              <h5
                className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                  isActive ? "text-[crimson]" : "text-[#555]"
                }`}
              >
                {item.label}
              </h5>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardSideBar
