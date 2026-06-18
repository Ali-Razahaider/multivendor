import { RxCross1 } from 'react-icons/rx';
import { IoHeartOutline } from 'react-icons/io5';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import styles from '../../styles/styles';

const WishlistSingle = ({ data }) => {
    return (
        <div className="flex items-center p-4 border-b">
            <img src={data.img} alt={data.name} className="w-16 h-16 object-cover rounded-md" />
            <div className="ml-3 flex-1">
                <h5 className="text-[15px] font-medium">{data.name}</h5>
                <h5 className="text-sm text-gray-500">USD ${data.price}</h5>
            </div>
            <AiOutlineShoppingCart size={20} className="text-gray-500 hover:text-blue-500 cursor-pointer" />
        </div>
    )
}

function Wishlist({ setOpenWishlist }) {
    const wishlistData = [
        { name: "Iphone 14 Pro Max", price: 120000, img: "https://shopo.quomodothemes.website/assets/images/products/apple-iphone-14-pro-max-1.jpg" },
        { name: "Macbook Pro M2", price: 150000, img: "https://shopo.quomodothemes.website/assets/images/products/apple-macbook-pro-m2-1.jpg" }
    ]

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50">
            <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
                <div>
                    <div className="flex w-full justify-end pt-5 pr-5">
                        <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishlist(false)} />
                    </div>
                    <div className={`${styles.normalFlex} p-4`}>
                        <IoHeartOutline size={25} />
                        <h5 className="pl-2 text-xl font-medium">{wishlistData.length} items</h5>
                    </div>
                    <br />
                    <div className="w-full border-t">
                        {wishlistData.map((item, index) => (
                            <WishlistSingle key={index} data={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wishlist
