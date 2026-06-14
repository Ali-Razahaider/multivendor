import React from 'react'
import { RxCross1 } from 'react-icons/rx';

function Cart({ setOpenCart }) {
    const cartData = [
        { name: "Iphone 14 Pro Max", description: "Latest iPhone model with advanced features", price: 120000, qty: 1, img: "https://shopo.quomodothemes.website/assets/images/products/apple-iphone-14-pro-max-1.jpg" },
        { name: "Macbook Pro M2", description: "Powerful laptop with M2 chip", price: 150000, qty: 1, img: "https://shopo.quomodothemes.website/assets/images/products/apple-macbook-pro-m2-1.jpg" }
    ]
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-50">
            <div className="fixed top-0 left-0 w-full h-screen bg-white/40" onClick={() => setOpenCart(false)} />
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
                <div className="flex justify-between items-center p-5 border-b">
                    <h1 className="text-2xl font-bold">Shopping Cart</h1>
                    <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                    {cartData.map((item, index) => (
                        <div key={index} className="flex items-center mb-5">
                            <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-md shrink-0" />
                            <div className="ml-5">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-500">{item.description}</p>
                                <p className="text-gray-700 mt-1">Price: ${item.price}</p>
                                <p className="text-gray-700 mt-1">Quantity: {item.qty}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full p-5 border-t">
                    <button className="bg-black text-white w-full py-3 rounded-md font-semibold hover:bg-gray-800 transition">Checkout</button>
                </div>
            </div>
        </div>
    )
}

export default Cart