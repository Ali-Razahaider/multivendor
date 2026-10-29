import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Layout/Header'
import EventCard from '../components/Home/EventCard'
import { getAllEvents } from '../redux/actions/eventActions'
import { isCurrentEvent } from '../utils/events'
import type { EventData } from '../utils/events'
import { Link } from 'react-router-dom'
import Footer from '../components/Layout/Footer'

const EventPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state: { events: { allEvents?: EventData[]; isLoading: boolean } }) => state.events);
  const currentEvents = allEvents?.filter(isCurrentEvent) || [];

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <Header activeHeading={4} />
      <main className="mx-auto w-11/12 min-h-[60vh] py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Current offers</h1>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[40vh]" role="status" aria-label="Loading offers">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard key={event._id} active={true} data={event} />
          ))
        ) : (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-800">There are no current offers right now.</p>
            <p className="mt-2 text-sm text-gray-600">There is still plenty to explore across the marketplace.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              Browse products
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default EventPage
