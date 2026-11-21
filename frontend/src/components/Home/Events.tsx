import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventCard from './EventCard';
import SectionHeader from './SectionHeader';
import { getAllEvents } from '../../redux/actions/eventActions';
import { isCurrentEvent } from '../../utils/events';
import type { EventData } from '../../utils/events';

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state: { events: { allEvents?: EventData[] } }) => state.events);
  const currentEvent = allEvents?.find(isCurrentEvent);

  useEffect(() => {
    dispatch(getAllEvents() as any);
  }, [dispatch]);

  if (!currentEvent) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="events-heading">
      <SectionHeader id="events-heading" eyebrow="Ends soon" title="Current offers" link={{ to: '/events', label: 'All offers' }} />
      <EventCard data={currentEvent} />
    </section>
  );
};

export default Events;
