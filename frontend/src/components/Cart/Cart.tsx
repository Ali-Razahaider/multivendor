import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { HiPlus, HiOutlineMinus } from 'react-icons/hi';

const CartSingle = ({ data }) => {
    const [value, setValue] = useState(data.qty);

    return (
        <div className="flex items-center p-4 border-b">
            <img src={data.img} alt={data.name} className="w-16 h-16 object-cover rounded-md" />
            <div className="ml-3 flex-1">
                <h5 className="text-[15px] font-medium">{data.name}</h5>
                <h5 className="text-sm text-gray-500">USD ${data.price}</h5>
                <div className="flex items-center mt-2">
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-[#e44343] rounded-full text-white"
                        onClick={() => setValue(value + 1)}
                    >
                        <HiPlus size={14} />
                    </button>
                    <span className="px-3 font-medium">{value}</span>
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full"
                        onClick={() => setValue(value > 1 ? value - 1 : 1)}
                    >
                        <HiOutlineMinus size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function Cart({ setOpenCart }) {
    const cartData = [
        { name: "Iphone 14 Pro Max", description: "Latest iPhone model with advanced features", price: 120000, qty: 1, img: "https://shopo.quomodothemes.website/assets/images/products/apple-iphone-14-pro-max-1.jpg" },
        { name: "Macbook Pro M2", description: "Powerful laptop with M2 chip", price: 150000, qty: 1, img: "https://shopo.quomodothemes.website/assets/images/products/apple-macbook-pro-m2-1.jpg" }
    ]

    return (
        <div className="fixed top-0 left-0 w-full bg-black/30 h-screen z-50">
            <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
                <div>
                    <div className="flex w-full justify-end pt-5 pr-5">
                        <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
                    </div>
                    <div className={`${styles.normalFlex} p-4`}>
                        <IoBagHandleOutline size={25} />
                        <h5 className="pl-2 text-xl font-medium">{cartData.length} items</h5>
                    </div>
                    <br />
                    <div className="w-full border-t">
                        {cartData.map((item, index) => (
                            <CartSingle key={index} data={item} />
                        ))}
                    </div>
                </div>
                <div className="px-5 mb-3">
                    <Link to="/checkout">
                        <div className="h-[45px] flex items-center justify-center w-full bg-black rounded-[5px]">
                            <h1 className="text-white text-lg font-semibold">Checkout Now</h1>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Cart


