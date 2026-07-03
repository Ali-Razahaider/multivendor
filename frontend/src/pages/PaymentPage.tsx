import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import Payment from '../components/Payment/Payment'
import axios from 'axios'
import server from '../server'

const PaymentPage = () => {
  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    axios.get(`${server}payment/stripeapikey`).then((res) => {
      setStripeApiKey(res.data.stripeApikey)
    }).catch(() => {})
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Payment />
        </Elements>
      )}
      {!stripeApiKey && <Payment />}
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default PaymentPage
