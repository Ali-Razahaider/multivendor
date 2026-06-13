import React from 'react'
import Header from '../components/Layout/Header'
import EventCard from '../components/Home/EventCard'

const EventPage = () => {
  return (
      <div>
          <Header activeHeading={4} />
          <EventCard active= {true} />
          <EventCard active= {true} />
              
    </div>
  )
}

export default EventPage