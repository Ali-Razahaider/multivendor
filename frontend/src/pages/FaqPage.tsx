import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const sections = [
  {
    title: 'Orders & delivery',
    items: [
      {
        q: 'Where can I check my order status?',
        a: 'Open My account → Orders. Each order has a details page and a tracking view that updates as the seller ships it. You’ll also get an email whenever the status changes.',
      },
      {
        q: 'Why did my cart turn into several orders?',
        a: 'Bazaarly is a marketplace, so each shop ships its own items. A cart with products from three shops becomes three orders, each with its own tracking and total.',
      },
      {
        q: 'How is shipping calculated?',
        a: 'Shipping is calculated per shop at checkout and shown before you pay. You’ll always see the exact total on the checkout page.',
      },
    ],
  },
  {
    title: 'Payments',
    items: [
      {
        q: 'Which payment methods can I use?',
        a: 'Pay by credit or debit card (processed securely by Stripe — we never see or store your card number) or choose cash on delivery.',
      },
      {
        q: 'When is my card charged?',
        a: 'Your card is charged when you place the order. If an item sells out while your payment is processing, you’re refunded automatically.',
      },
      {
        q: 'How do coupon codes work?',
        a: 'Coupons are created by individual shops and apply only to that shop’s items. Some have a minimum spend or a maximum discount — checkout will tell you if a code doesn’t apply.',
      },
    ],
  },
  {
    title: 'Refunds & reviews',
    items: [
      {
        q: 'How do I request a refund?',
        a: 'Once an order is delivered, open it from My account → Orders and choose “Request refund”. The seller reviews the request; approved card refunds go back to your original card.',
      },
      {
        q: 'Who can leave reviews?',
        a: 'Only shoppers who received the product. That keeps every review on Bazaarly a verified purchase.',
      },
    ],
  },
  {
    title: 'Selling on Bazaarly',
    items: [
      {
        q: 'How do I open a shop?',
        a: 'Choose “Start selling”, fill in your shop details and confirm your email. You can list products straight away from your dashboard.',
      },
      {
        q: 'How do I get paid?',
        a: 'Earnings from delivered orders (minus the platform fee) go to your shop balance. Add your bank details in the dashboard and request a withdrawal any time.',
      },
    ],
  },
]

const FaqPage = () => (
  <>
    <Header activeHeading={5} />
    <main id="main" className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Help centre</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-slate-600">Quick answers about ordering, paying and selling on Bazaarly.</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={section.title}>
              <h2 id={section.title} className="mb-3 text-lg font-semibold text-slate-900">{section.title}</h2>
              <div className="card divide-y divide-slate-100">
                {section.items.map((item) => (
                  <details key={item.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-slate-900">
                      {item.q}
                      <ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="mt-3 leading-relaxed text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">Still need help?</p>
            <p className="text-sm text-slate-600">Message the seller directly from any product or order page.</p>
          </div>
          <Link to="/profile?tab=orders" className="btn-primary">Go to my orders</Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
)

export default FaqPage
