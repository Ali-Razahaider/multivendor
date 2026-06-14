import { useState } from "react"
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiFillStar, AiOutlineStar } from "react-icons/ai"
import { Link } from "react-router-dom"
import styles from "../../styles/styles"

const ProductDetailsInfo = ({ data }) => {
    const [active, setActive] = useState(1)

    if (!data) return null

    const reviews = data.reviews || []

    return (
        <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded mt-8">
            {/* tabs */}
            <div className="w-full flex justify-between border-b pt-10 pb-2">
                <div className="relative">
                    <h5
                        className="text-black text-lg px-1 leading-5 font-semibold cursor-pointer 800px:text-xl"
                        onClick={() => setActive(1)}
                    >
                        Product Details
                    </h5>
                    {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
                </div>
                <div className="relative">
                    <h5
                        className="text-black text-lg px-1 leading-5 font-semibold cursor-pointer 800px:text-xl"
                        onClick={() => setActive(2)}
                    >
                        Product Reviews
                    </h5>
                    {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
                </div>
                <div className="relative">
                    <h5
                        className="text-black text-lg px-1 leading-5 font-semibold cursor-pointer 800px:text-xl"
                        onClick={() => setActive(3)}
                    >
                        Seller Information
                    </h5>
                    {active === 3 ? <div className={`${styles.active_indicator}`} /> : null}
                </div>
            </div>

            {/* tab content with fixed height */}
            <div className="h-[400px] overflow-y-auto">
                {/* product details tab — product description text */}
                {active === 1 && (
                    <p className="py-2 text-md leading-8 pb-10 whitespace-pre-line">{data.description}</p>
                )}

                {/* reviews tab — user avatars, names, star ratings, and comments */}
                {active === 2 && (
                    <div className="w-full flex flex-col py-3">
                    {reviews.length === 0 ? (
                        <div className="w-full flex justify-center">
                            <h5 className="text-gray-500">No Reviews have for this product!</h5>
                        </div>
                    ) : (
                        reviews.map((item, index) => (
                            <div key={index} className="w-full flex my-2">
                                <div className="w-12.5 h-12.5 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <img src={item.user?.avatar?.url} alt="" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="pl-2">
                                    <div className="w-full flex items-center">
                                        <h1 className="font-medium mr-3">{item.user?.name || "Anonymous"}</h1>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                item.rating >= star ? (
                                                    <AiFillStar key={star} size={14} className="text-yellow-500" />
                                                ) : (
                                                    <AiOutlineStar key={star} size={14} className="text-gray-400" />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{item.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* seller information tab — shop avatar, name, ratings, description, joined date, total products/reviews, visit shop button */}
            {active === 3 && data.shop && (
                <div className="w-full block 800px:flex p-5">
                    <div className="w-full 800px:w-1/2">
                        <Link to={`/shop/preview/${data.shop._id || data.shopId}`}>
                            <div className="flex items-center">
                                <img
                                    src={data?.shop?.shop_avatar?.url}
                                    className="w-12.5 h-12.5 rounded-full"
                                    alt=""
                                />
                                <div className="pl-3">
                                    <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                                    <h5 className="pb-2 text-sm">({data.shop?.ratings || 0}/5) Ratings</h5>
                                </div>
                            </div>
                        </Link>
                        <p className="pt-2 text-gray-600">{data.shop?.description || ""}</p>
                    </div>
                    <div className="w-full 800px:w-1/2 mt-5 800px:mt-0 800px:flex flex-col items-end">
                        <div className="text-left">
                            <h5 className="font-semibold">
                                Joined on: <span className="font-medium">{data.shop?.createdAt?.slice(0, 10) || "N/A"}</span>
                            </h5>
                            <h5 className="font-semibold pt-3">
                                Total Products: <span className="font-medium">{data.shop?.products || 0}</span>
                            </h5>
                            <h5 className="font-semibold pt-3">
                                Total Reviews: <span className="font-medium">{reviews.length}</span>
                            </h5>
                            <Link to="/">
                                <div className={`${styles.button} !rounded !h-10 mt-3`}>
                                    <h4 className="text-white">Visit Shop</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}

function ProductDetails({ data }) {
    const [count, setCount] = useState(1)
    const [click, setClick] = useState(false)
    const [select, setSelect] = useState(0)

    if (!data) return <div className="text-center py-20 text-gray-500">Product not found</div>

    const images = data.images || data.image_Url

    return (
        <div className={`${styles.section} my-8`}>
            {/* main product display */}
            <div className="bg-white rounded-lg p-6">
                <div className="block w-full 800px:flex gap-8">
                    <div className="w-full 800px:w-1/2">
                        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 mb-4 h-75 overflow-hidden">
                            <img src={images?.[select]?.url} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {images?.map((i, index) => (
                                <div
                                    key={index}
                                    className={`${select === index ? "border-2 border-teal-500" : "border border-gray-300"} cursor-pointer rounded-md overflow-hidden w-15 h-15`}
                                    onClick={() => setSelect(index)}
                                >
                                    <img src={i?.url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center border-t mt-6 pt-4 border-gray-200">
                            <img
                                src={data?.shop?.shop_avatar?.url}
                                alt=""
                                className="w-12.5 h-12.5 rounded-full border-2 border-gray-300 p-0.5"
                            />
                            <div className="ml-3">
                                <Link to={`/shop/preview/${data?.shop?._id || data?.shopId}`}>
                                    <h3 className={`${styles.shop_name} pb-0`}>{data.shop?.name}</h3>
                                </Link>
                                <h5 className="text-sm text-gray-500">({data.shop?.ratings || 0}/5) Ratings</h5>
                            </div>
                        </div>
                    </div>
                    <div className="w-full 800px:w-1/2 pt-5">
                        <h1 className={`${styles.productTitle} mb-3`}>{data.name}</h1>
                        <p className="text-gray-700 text-md leading-relaxed mb-4">{data.description}</p>
                        <div className={`${styles.normalFlex} gap-4 mb-4`}>
                            <h4 className={`${styles.productDiscountPrice}`}>${data.discountPrice || data.discount_price}</h4>
                            {data.price && <h3 className={`${styles.price} !pl-0`}>${data.price}</h3>}
                        </div>
                        <div className={`${styles.normalFlex} justify-between pr-3`}>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button className="bg-gray-100 text-gray-700 font-bold px-3 py-1.5 hover:bg-gray-200 text-sm" onClick={() => setCount(count + 1)}>+</button>
                                <span className="bg-white text-gray-800 font-medium px-4 py-1.5 min-w-[40px] text-center text-sm">{count}</span>
                                <button className="bg-gray-100 text-gray-700 font-bold px-3 py-1.5 hover:bg-gray-200 text-sm" onClick={() => count > 1 && setCount(count - 1)}>-</button>
                            </div>
                            <div onClick={() => setClick(!click)} className="cursor-pointer">
                                {click ? <AiFillHeart size={28} className="text-red-500" /> : <AiOutlineHeart size={28} className="text-gray-500" />}
                            </div>
                        </div>
                        <div className={`${styles.button} !w-full !mt-4 !rounded-lg !h-10`}>
                            <span className="text-white flex items-center text-sm">
                                Add to cart <AiOutlineShoppingCart className="ml-2" size={18} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* product details info tabs */}
            <ProductDetailsInfo data={data} />
        </div>
    )
}

export default ProductDetails
