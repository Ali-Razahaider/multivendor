import React from 'react'
import Countdown from './Countdown';

interface EventCardProps {
    active?: boolean;
    data?: any;
}

function EventCard({ active, data }: EventCardProps) {
    // If no dynamic data is passed, use a placeholder representation
    const eventData = data || {
        name: "iPhone 15 Pro Max 256GB Natural Titanium",
        description: "Experience the ultimate iPhone with a strong and lightweight titanium design, groundbreaking A17 Pro chip with 6-core GPU, and a 48MP Pro camera system featuring 5x optical zoom. The 6.7-inch Super Retina XDR display with ProMotion delivers stunning visuals.",
        price: 1199,
        discountedPrice: 999,
        totalSell: 120,
        endDate: "2026-12-31T12:00:00Z",
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"]
    };

    const imageUrl = eventData.images && eventData.images[0] ? (eventData.images[0]?.url || eventData.images[0]) : "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80";

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

                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-colors">See Details</button>
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-colors">Buy Now</button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard