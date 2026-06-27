import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'running',
    },
    countInStock: {
        type: Number,
        required: true,
    },
    tags: {
        type: String,
    },
    discountedPrice: {
        type: Number,
    },
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    totalSell: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Event = mongoose.model('Event', eventSchema);
export default Event;