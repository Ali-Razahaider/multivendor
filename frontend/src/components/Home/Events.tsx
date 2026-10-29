import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { getAllEvents } from '../../redux/actions/eventActions';
import { isCurrentEvent } from '../../utils/events';
import type { EventData } from '../../utils/events';

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state: { events: { allEvents?: EventData[]; isLoading: boolean } }) => state.events);
  const currentEvent = allEvents?.find(isCurrentEvent);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      {!isLoading && currentEvent && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} py-5`}>
            <h2>Current offers</h2>
          </div>
          <div className="w-full grid">
            <EventCard data={currentEvent} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
