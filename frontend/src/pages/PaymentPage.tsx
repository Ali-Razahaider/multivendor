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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${server}payment/stripeapikey`).then((res) => {
      setStripeApiKey(res.data.stripeApikey || '')
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <Elements stripe={loadStripe(stripeApiKey || "pk_test_dummy_key_to_prevent_elements_context_error")}>
          <Payment />
        </Elements>
      )}
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default PaymentPage
