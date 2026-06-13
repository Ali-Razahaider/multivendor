import { useState } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import styles from "../styles/styles"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"

const faqData = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by logging into your account and visiting the 'My Orders' section. There you will find the tracking number and a link to the carrier's tracking page.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy from the date of delivery. Items must be unused and in their original packaging. To initiate a return, please contact our support team.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days within the US. Express shipping is available for 2-3 business days. International shipping may take 10-15 business days depending on the destination.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping fees and delivery times vary depending on the destination. You can check the estimated shipping cost at checkout.",
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via email at support@example.com, through the live chat on our website, or by calling our toll-free number at 1-800-123-4567. Our support team is available Monday to Friday, 9 AM to 6 PM.",
  },
]

const Faq = () => {
  const [activeTab, setActiveTab] = useState(null)

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index)
  }

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">FAQ</h2>
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
