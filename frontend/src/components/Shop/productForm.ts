import { toast } from 'react-toastify'

export const MAX_IMAGES = 6
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** Reads selected image files as data URLs, enforcing type, size and count limits. */
export const readImageFiles = async (fileList: FileList | null, alreadySelected = 0): Promise<string[]> => {
  const files = Array.from(fileList || [])
  const valid = files.filter((file) => {
    if (!file.type.startsWith('image/')) {
      toast.error(`“${file.name}” is not an image`)
      return false
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`“${file.name}” is larger than 5MB`)
      return false
    }
    return true
  })
  const room = Math.max(0, MAX_IMAGES - alreadySelected)
  if (valid.length > room) toast.error(`You can add up to ${MAX_IMAGES} images`)
  return Promise.all(
    valid.slice(0, room).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )
  )
}

/** Returns an error message for invalid pricing/stock input, or null. */
export const validatePricing = ({ price, discountedPrice, countInStock }: { price: any; discountedPrice?: any; countInStock: any }) => {
  const p = Number(price)
  const sale = discountedPrice === '' || discountedPrice === null || discountedPrice === undefined ? 0 : Number(discountedPrice)
  const stock = Number(countInStock)
  if (!Number.isFinite(p) || p <= 0) return 'Enter a price greater than 0'
  if (!Number.isFinite(sale) || sale < 0) return 'Enter a valid sale price'
  if (sale > 0 && sale >= p) return 'Sale price must be lower than the original price'
  if (!Number.isInteger(stock) || stock < 0) return 'Stock must be a whole number of 0 or more'
  return null
}
