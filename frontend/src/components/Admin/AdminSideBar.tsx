import { RxDashboard } from "react-icons/rx"
import { FiShoppingBag, FiUsers, FiPackage } from "react-icons/fi"
import { MdOutlineLocalOffer } from "react-icons/md"
import { VscNewFile } from "react-icons/vsc"
import { IoStorefrontOutline } from "react-icons/io5"
import { Link } from "react-router-dom"

const menuItems = [
  { id: 1, icon: RxDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { id: 2, icon: FiUsers, label: "All Users", path: "/admin/users" },
  { id: 3, icon: IoStorefrontOutline, label: "All Sellers", path: "/admin/sellers" },
  { id: 4, icon: FiShoppingBag, label: "All Orders", path: "/admin/orders" },
  { id: 5, icon: FiPackage, label: "All Products", path: "/admin/products" },
  { id: 6, icon: MdOutlineLocalOffer, label: "All Events", path: "/admin/events" },
]

function AdminSideBar({ active }) {
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

export default AdminSideBar
