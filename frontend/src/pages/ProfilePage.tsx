import { useSearchParams } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProfileSidebar, { PROFILE_TABS, type ProfileTab } from '../components/Profile/ProfileSidebar'
import ProfileContent from '../components/Profile/ProfileContent'

const ProfilePage = () => {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const active: ProfileTab = PROFILE_TABS.some((t) => t.id === requested) ? (requested as ProfileTab) : 'profile'

  return (
    <>
      <Header />
      <main id="main" className="container-page py-8 sm:py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My account</h1>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ProfileSidebar active={active} setActive={(tab) => setParams(tab === 'profile' ? {} : { tab })} />
          <ProfileContent active={active} />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage
