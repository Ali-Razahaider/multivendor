import { useState } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import styles from "../styles/styles"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"

const faqData = [
  {
    question: "Where can I check my order status?",
    answer: "Sign in and open your account page to view your orders and their latest status.",
  },
  {
    question: "How do I ask about an order or a refund?",
    answer: "Open your account page to review your orders or send a message to the seller. Refund requests and updates appear in the Refunds section of your account.",
  },
  {
    question: "How do I find products from a specific category?",
    answer: "Choose a category from the home page or the category menu. You can also browse all products and search for a product by name.",
  },
  {
    question: "Can I shop from more than one seller?",
    answer: "Yes. Bazaarly brings products from different sellers into one marketplace. Each product page shows the seller's shop details.",
  },
  {
    question: "How do I become a seller?",
    answer: "Select Become a Seller from the site header and create a shop account to get started.",
  },
]

const Faq = () => {
  const [activeTab, setActiveTab] = useState(null)

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index)
  }

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Frequently asked questions</h2>
      <p className="text-gray-600 mb-8">Quick answers to help you shop and sell on Bazaarly.</p>
      <div className="mx-auto max-w-4xl space-y-3">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleTab(index)}
            >
              <span>{item.question}</span>
              {activeTab === index ? (
                <AiOutlineMinus size={18} className="text-gray-500 shrink-0" />
              ) : (
                <AiOutlinePlus size={18} className="text-gray-500 shrink-0" />
              )}
            </button>
            {activeTab === index && (
              <div className="px-6 py-4 text-gray-600 border-t border-gray-200">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const FaqPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  )
}

export default FaqPage
