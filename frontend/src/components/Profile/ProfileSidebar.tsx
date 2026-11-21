import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { LogOut, MapPin, MessageCircle, Package, RotateCcw, User, LayoutDashboard } from 'lucide-react'
import server from '../../server'

export const PROFILE_TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'orders', icon: Package, label: 'Orders' },
  { id: 'refunds', icon: RotateCcw, label: 'Refunds' },
  { id: 'addresses', icon: MapPin, label: 'Addresses' },
  { id: 'inbox', icon: MessageCircle, label: 'Inbox' },
] as const

export type ProfileTab = (typeof PROFILE_TABS)[number]['id']

function ProfileSidebar({ active, setActive }: { active: ProfileTab; setActive: (tab: ProfileTab) => void }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: any) => state.user)

  const logout = async () => {
    try {
      await axios.post(`${server}user/logout`)
    } catch {
      // The cookie is cleared server-side; sign out locally regardless.
    }
    dispatch({ type: 'LoadUserFail', payload: null })
    toast.success('You have been signed out')
    navigate('/')
  }

  const itemClass = (on: boolean) =>
    `flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
      on ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <aside className="card p-3 lg:sticky lg:top-36">
      <div className="hidden items-center gap-3 border-b border-slate-100 px-2 pb-4 pt-2 lg:flex">
        <img src={user?.avatar?.url} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
      <nav aria-label="Account" className="scrollbar-none flex gap-1 overflow-x-auto lg:mt-3 lg:flex-col lg:overflow-visible">
        {PROFILE_TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} type="button" onClick={() => setActive(id)} aria-current={active === id ? 'page' : undefined} className={itemClass(active === id)}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
        {user?.role === 'admin' && (
          <button type="button" onClick={() => navigate('/admin/dashboard')} className={itemClass(false)}>
            <LayoutDashboard size={18} aria-hidden="true" />
            Admin dashboard
          </button>
        )}
        <button type="button" onClick={logout} className={`${itemClass(false)} hover:!bg-rose-50 hover:!text-rose-600 lg:mt-2 lg:border-t lg:border-slate-100 lg:pt-3`}>
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </nav>
    </aside>
  )
}

export default ProfileSidebar
