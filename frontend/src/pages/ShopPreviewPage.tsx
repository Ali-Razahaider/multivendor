import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ShopInfo from '../components/Shop/ShopInfo'
import ShopProfileData from '../components/Shop/ShopProfileData'

const ShopPreviewPage = () => (
  <>
    <Header />
    <main id="main" className="container-page py-8">
      <ShopInfo isOwner={false} />
      <ShopProfileData isOwner={false} />
    </main>
    <Footer />
  </>
)

export default ShopPreviewPage
