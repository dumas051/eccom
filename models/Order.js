import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: { type: String, required: true, ref: "User" },
    items: [{ 
          product: { type: String, required: true, ref: "Product" },
          quantity: { type: Number, required: true, min: 1 }
        }],

        amount: { type: Number, required: true, min: 0 }, // Subtotal (before tax and shipping)
        tax: { type: Number, required: true, default: 0, min: 0 }, // Tax amount
        shippingFee: { type: Number, required: true, default: 0, min: 0 }, // Shipping fee
        totalAmount: { type: Number, required: true, min: 0 }, // Total after tax and shipping
        address: { 
            fullName: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
            pincode: { type: String, required: true, trim: true },
            area: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true }
        },
        status: {type: String, required: true, default: 'Order Placed'},
        date: {type: Number, required: true},
        paymentMethod: { type: String, required: true, default: 'COD' },
        paymentStatus: { 
            type: String, 
            enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
            default: 'Pending' 
        },
        paymentDetails: {
            transactionId: String,
            paymentDate: Date,
            paymentAmount: Number,
            paymentGateway: String, // For online payments
            paymentNotes: String, // For COD payments
            collectedBy: String, // For COD payments
            collectedAt: Date // For COD payments
        },
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
        archived: { type: Boolean, default: false },
        // Store original data when archiving
        originalData: {
            items: [{ 
                product: { type: String, ref: "Product" },
                quantity: { type: Number }
            }],
            amount: { type: Number },
            tax: { type: Number },
            shippingFee: { type: Number },
            totalAmount: { type: Number }
        }
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order;