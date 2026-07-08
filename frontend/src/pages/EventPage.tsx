import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Layout/Header'
import EventCard from '../components/Home/EventCard'
import { getAllEvents } from '../redux/actions/eventActions'

const EventPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state: any) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <Header activeHeading={4} />
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : allEvents && allEvents.length > 0 ? (
        allEvents.map((event: any) => (
          <EventCard key={event._id} active={true} data={event} />
        ))
      ) : (
        <div className="text-center py-20 text-gray-500 text-xl font-medium">
          No events available at the moment.
        </div>
      )}
    </div>
  )
}

export default EventPage