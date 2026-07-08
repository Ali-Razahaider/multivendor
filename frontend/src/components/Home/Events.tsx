import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { getAllEvents } from '../../redux/actions/eventActions';

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state: any) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      {!isLoading && allEvents && allEvents.length > 0 && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} py-5`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            <EventCard data={allEvents[0]} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
