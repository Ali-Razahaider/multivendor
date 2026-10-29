import Countdown from './Countdown';
import type { EventData } from '../../utils/events';

interface EventCardProps {
    active?: boolean;
    data: EventData;
}

function EventCard({ active, data }: EventCardProps) {
    const eventData = data;
    const firstImage = eventData.images?.[0];
    const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80";

    return (
        <div className={`w-full bg-white rounded-lg p-6 flex mt-12 flex-col lg:flex-row gap-6 items-center ${active ? 'unset' : 'mb-12'}`}>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={eventData.name}
                    className="w-full h-64 sm:h-72 lg:h-[420px] object-cover rounded-2xl shadow-md border border-gray-100"
                />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-3xl font-semibold mb-3">{eventData.name}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {eventData.description}
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-4">
                            {eventData.discountedPrice ? (
                                <>
                                    <span className="text-red-500 line-through text-lg">{eventData.price}$</span>
                                    <span className="text-2xl font-bold">{eventData.discountedPrice}$</span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold">{eventData.price}$</span>
                            )}
                        </div>
                        <span className="text-green-500">{eventData.totalSell || 0} Sold</span>
                    </div>

                    <div className="mb-4">
                        <Countdown targetDate={eventData.endDate} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EventCard
