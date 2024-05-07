import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
    }],
    orderDate: {
    type: Date,
    default: Date.now
    },
    status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);
