import Header from '../components/Layout/Header'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Checkout from '../components/Checkout/Checkout'
import Footer from '../components/Layout/Footer'

const CheckoutPage = () => (
  <>
    <Header />
    <main id="main" className="container-page py-10">
      <h1 className="sr-only">Checkout</h1>
      <CheckoutSteps active={1} />
      <Checkout />
    </main>
    <Footer />
  </>
)

export default CheckoutPage
