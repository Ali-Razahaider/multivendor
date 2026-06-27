import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../redux/actions/productActions'




const AllProducts = () => {
    const {products,isLoading} = useSelector((state) => state.products)
    const {seller} = useSelector((state) => state.seller)
    const dispatch = useDispatch()

     useEffect(() => {
        dispatch(getAllProducts(seller._id))
    }, [dispatch, seller._id])
    
  return (
    <div>AllProducts</div>
  )
}

export default AllProducts