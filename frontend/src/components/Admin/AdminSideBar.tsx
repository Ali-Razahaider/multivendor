import { Link } from "react-router-dom"
import { CalendarRange, HandCoins, LayoutDashboard, Package, ShoppingBag, Store, Users } from "lucide-react"

const menuItems = [
  { id: 1, icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { id: 2, icon: Users, label: "All Users", path: "/admin/users" },
  { id: 3, icon: Store, label: "All Sellers", path: "/admin/sellers" },
  { id: 4, icon: ShoppingBag, label: "All Orders", path: "/admin/orders" },
  { id: 5, icon: Package, label: "All Products", path: "/admin/products" },
  { id: 6, icon: CalendarRange, label: "All Events", path: "/admin/events" },
  { id: 7, icon: HandCoins, label: "Withdraw Requests", path: "/admin/withdraw" },
]

function AdminSideBar({ active }) {
  return (
    <nav aria-label="Admin" className="sticky top-[72px] left-0 z-10 h-[calc(100vh-72px)] w-full overflow-y-auto border-r border-slate-200 bg-white p-2 800px:p-3">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <Link
                to={item.path}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors 800px:justify-start ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="hidden 800px:inline">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default AdminSideBar
