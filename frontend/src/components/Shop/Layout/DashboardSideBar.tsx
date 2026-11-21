import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  BadgePercent, CalendarPlus, LayoutDashboard, LogOut, MessageSquare, Package, PackagePlus,
  ReceiptText, Settings, ShoppingBag, Tag, Wallet,
} from "lucide-react"
import { logoutSeller } from "../../../redux/actions/sellerActions"

const menuItems = [
  { id: 1, icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { id: 2, icon: ShoppingBag, label: "All Orders", path: "/dashboard-orders" },
  { id: 3, icon: Package, label: "All Products", path: "/dashboard-products" },
  { id: 4, icon: PackagePlus, label: "Create Product", path: "/dashboard-create-product" },
  { id: 5, icon: Tag, label: "All Events", path: "/dashboard-events" },
  { id: 6, icon: CalendarPlus, label: "Create Event", path: "/dashboard-create-event" },
  { id: 7, icon: Wallet, label: "Withdraw Money", path: "/dashboard-withdraw-money" },
  { id: 8, icon: MessageSquare, label: "Shop Inbox", path: "/dashboard-messages" },
  { id: 9, icon: BadgePercent, label: "Discount Codes", path: "/dashboard-coupons" },
  { id: 10, icon: ReceiptText, label: "Refunds", path: "/dashboard-refunds" },
  { id: 11, icon: Settings, label: "Settings", path: "/settings" },
]

function DashboardSideBar({ active }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutSeller() as any)
    toast.success("Signed out of your shop")
    navigate("/shop-login", { replace: true })
  }

  const itemClass = (isActive) =>
    `flex w-full items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors 800px:justify-start ${
      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`

  return (
    <nav aria-label="Seller dashboard" className="sticky top-[72px] left-0 z-10 h-[calc(100vh-72px)] w-full overflow-y-auto border-r border-slate-200 bg-white p-2 800px:p-3">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <Link to={item.path} className={itemClass(isActive)} aria-current={isActive ? "page" : undefined} title={item.label}>
                <Icon size={20} aria-hidden="true" />
                <span className="hidden 800px:inline">{item.label}</span>
              </Link>
            </li>
          )
        })}
        <li className="border-t border-slate-100 pt-1">
          <button type="button" onClick={handleLogout} className={`${itemClass(false)} hover:!text-rose-600`} title="Log out">
            <LogOut size={20} aria-hidden="true" />
            <span className="hidden 800px:inline">Log out</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default DashboardSideBar
