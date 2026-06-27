import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
    },
    minAmount: {
        type: Number,
        default: 0,
    },
    maxAmount: {
        type: Number,
        default: 0,
    },
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    selectedProduct: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
