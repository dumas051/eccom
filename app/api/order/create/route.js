import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Product from "@/models/Product"
import { inngest } from "@/config/inngest"
import User from "@/models/User"
import Order from "@/models/Order"
import axios from "axios"

export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const { address, items, paymentMethod = 'COD' } = await request.json()

        if (!userId || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid request" })
        }

        if (!address || typeof address !== "object") {
            return NextResponse.json({ success: false, message: "Invalid address" });
        }

        // Patch for compatibility: support both phone and phoneNumber
        if (!address.phone && address.phoneNumber) {
            address.phone = address.phoneNumber;
        }

        // calculate total amount
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                items,
                amount: amount + Math.floor(amount * 0.12),
                address,
                paymentMethod,
                date: Date.now()
            }
        })

        // Save order to DB
        const orderData = {
            userId,
            items,
            amount: amount + Math.floor(amount * 0.12),
            address,
            status: "Order Placed",
            date: Date.now(),
            paymentMethod
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Reduce stock for each product in the order
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                const newStock = (typeof product.stock === 'number' ? product.stock : 0) - item.quantity;
                if (newStock < 0) {
                    return NextResponse.json({ 
                        success: false, 
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                    });
                }
                // Update stock and status robustly
                const updates = {
                    stock: newStock,
                    stockStatus:
                        newStock <= 0
                            ? 'Out of Stock'
                            : newStock <= (product.lowStockThreshold || 5)
                            ? 'Low Stock'
                            : 'In Stock',
                };
                await Product.findByIdAndUpdate(
                    product._id,
                    { $set: updates },
                    { new: true, strict: false }
                );
            }
        }

        // clear cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        // Send order confirmation email
        try {
            const userEmail = user.emailAddresses[0]?.emailAddress;
            if (userEmail) {
                await axios.post('/api/email/send', {
                    to: userEmail,
                    template: 'orderConfirmation',
                    data: {
                        _id: newOrder._id,
                        date: newOrder.date,
                        amount: newOrder.amount,
                        paymentMethod: newOrder.paymentMethod,
                        status: newOrder.status,
                        items: newOrder.items,
                        address: newOrder.address
                    }
                });
                console.log('Order confirmation email sent successfully');
            }
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order creation if email fails
        }

        return NextResponse.json({ success: true, message: "Order created successfully" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}