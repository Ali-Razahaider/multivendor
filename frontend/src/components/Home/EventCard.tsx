import React from 'react'
import Countdown from './Countdown';

function EventCard() {
    return (
        <div className="w-full bg-white rounded-lg p-6 flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <img
                    src="https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large_2x.jpg"
                    alt="iPhone"
                    className="w-full h-64 sm:h-72 lg:h-[420px] object-contain rounded-lg shadow-sm"
                />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-3xl font-semibold mb-3">Iphone 14 pro max 8/256gb</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
                        ducimus eum similique corporis dolor molestias labore accusantium
                        sed accusamus illo voluptate aut reprehenderit sit reiciendis
                        blanditiis doloribus quos cupiditate corrupti. Lorem ipsum dolor
                        sit amet consectetur adipisicing elit. Velit, ducimus eum similique
                        corporis dolor molestias labore accusantium sed accusamus illo
                        voluptate aut reprehenderit sit reiciendis blanditiis doloribus quos
                        cupiditate corrupti.
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-4">
                            <span className="text-red-500 line-through text-lg">1099$</span>
                            <span className="text-2xl font-bold">999$</span>
                        </div>
                        <span className="text-green-500">120 Sold</span>
                    </div>

                    {/* hardcoded target date for now */}
                    <div className="mb-4">
                        <Countdown targetDate={'2026-06-10T12:00:00Z'} />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-black text-white rounded-lg shadow">See Details</button>
                        <button className="px-6 py-3 bg-black text-white rounded-lg shadow">Buy Now</button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard