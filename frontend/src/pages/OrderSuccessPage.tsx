import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h5 className="text-[25px] text-[#000000a1] mb-4">
          Your order is successful!
        </h5>
        <p className="text-gray-500 text-center max-w-md">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default OrderSuccessPage
