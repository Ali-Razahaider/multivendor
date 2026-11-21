import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import EventCard from '../components/Home/EventCard'
import { getAllEvents } from '../redux/actions/eventActions'
import { isCurrentEvent } from '../utils/events'
import type { EventData } from '../utils/events'

const EventPage = () => {
  const dispatch = useDispatch()
  const { allEvents, isLoading } = useSelector((state: { events: { allEvents?: EventData[]; isLoading: boolean } }) => state.events)
  const currentEvents = allEvents?.filter(isCurrentEvent) || []

  useEffect(() => {
    dispatch(getAllEvents() as any)
  }, [dispatch])

  return (
    <>
      <Header activeHeading={4} />
      <main id="main" className="container-page min-h-[60vh] py-10">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Limited time</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Deals & offers</h1>
        <p className="mt-2 text-slate-600">Time-limited offers from shops across Bazaarly.</p>
        <div className="mt-8 space-y-8">
          {isLoading && !allEvents?.length ? (
            <div className="skeleton h-96 w-full rounded-3xl" />
          ) : currentEvents.length > 0 ? (
            currentEvents.map((event) => <EventCard key={event._id} data={event} />)
          ) : (
            <div className="card px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-900">No offers are running right now</p>
              <p className="mt-2 text-sm text-slate-600">Check back soon — or browse today’s discounted products.</p>
              <Link to="/products?deals=1" className="btn-primary mt-6">Shop discounted products</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default EventPage
