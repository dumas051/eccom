import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: { type: String, required: true, ref: "User" },
    items: [{ 
          product: { type: String, required: true, ref: "Product" ,},
          quantity: { type: Number, required: true },

        }],

        amount: { type: Number, required: true },
        address: { 
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            pincode: { type: String, required: true },
            area: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true }
        },
        status: {type: String, required: true, default: 'Order Placed'},
        date: {type: Number, required: true},
        paymentMethod: { type: String, required: true, default: 'COD' },
        canCancel: { type: Boolean, default: true },
        trackingNumber: { type: String },
        estimatedDelivery: { type: Date },
        trackingHistory: [{
            status: { type: String, required: true },
            description: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            location: { type: String }
        }],
        returnRequest: {
            status: { type: String, enum: ['None', 'Requested', 'Approved', 'Rejected', 'Refunded'], default: 'None' },
            reason: String,
            requestedAt: Date,
            processedAt: Date,
            message: String, // admin/seller notes
            refundAmount: Number,
            refundMethod: String, // e.g., 'Original Payment', 'Store Credit'
            restocked: { type: Boolean, default: false }
        },
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order;