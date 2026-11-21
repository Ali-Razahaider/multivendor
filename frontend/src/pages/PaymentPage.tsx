import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import Payment from '../components/Payment/Payment'
import Loader from '../components/Layout/Loader'
import server from '../server'

const PaymentPage = () => {
  const [stripeApiKey, setStripeApiKey] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${server}payment/stripeapikey`)
      .then((res) => setStripeApiKey(res.data.stripeApikey || ''))
      .catch(() => setStripeApiKey(''))
      .finally(() => setLoading(false))
  }, [])

  // Only load Stripe.js when card payments are configured.
  const stripePromise = useMemo(() => (stripeApiKey ? loadStripe(stripeApiKey) : null), [stripeApiKey])

  return (
    <>
      <Header />
      <main id="main" className="container-page py-10">
        <h1 className="sr-only">Payment</h1>
        <CheckoutSteps active={2} />
        {loading ? (
          <Loader label="Preparing secure payment" />
        ) : (
          <Elements stripe={stripePromise}>
            <Payment cardEnabled={!!stripePromise} />
          </Elements>
        )}
      </main>
      <Footer />
    </>
  )
}

export default PaymentPage
