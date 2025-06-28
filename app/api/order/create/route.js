import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Product from "@/models/Product"
import { inngest } from "@/config/inngest"
import User from "@/models/User"
import Order from "@/models/Order"

export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json()

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
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // clear cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({ success: true, message: "Order created successfully" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}