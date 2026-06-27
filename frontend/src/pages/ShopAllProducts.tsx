import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DashboardHeader from '../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar'
import { getShopProducts, deleteProduct } from '../redux/actions/productActions'
import EditProduct from '../components/Shop/EditProduct'
import ProductDetails from '../components/ProductCard/ProductDetails'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

const ShopAllProducts = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { products, isLoading } = useSelector((state) => state.product)
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState(null)

  useEffect(() => {
    if (seller?._id) {
      dispatch(getShopProducts(seller._id))
    }
  }, [dispatch, seller?._id])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
      toast.success('Product deleted')
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setOpen(true)
  }

  const handlePreview = (product) => {
    setPreviewProduct(product)
    setPreviewOpen(true)
  }

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={3} />
        </div>
        <div className="w-full p-8">
          {isLoading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-lg">No products yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const firstImage = product.images?.[0]?.url || product.images?.[0]
                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {product.discountedPrice ? (
                          <span>
                            ${product.discountedPrice}{' '}
                            <span className="line-through text-gray-400 text-sm">
                              ${product.price}
                            </span>
                          </span>
                        ) : (
                          <span>${product.price}</span>
                        )}
                      </TableCell>
                      <TableCell>{product.countInStock}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(product)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {previewOpen && previewProduct && (
        <ProductDetails data={previewProduct} setOpen={setPreviewOpen} />
      )}
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  )
}

export default ShopAllProducts
