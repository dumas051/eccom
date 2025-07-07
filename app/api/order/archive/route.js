import { NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const { orderId, archived } = await request.json();

        console.log('Archive request:', { userId, orderId, archived });

        const isSeller = await authSeller(userId);
        console.log('Is seller:', isSeller);
        
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" });
        }

        console.log('Order before archive:', order.archived);
        
        let updateData = { archived: !!archived };
        
        if (archived) {
            // When archiving: store original data and clear products
            updateData = {
                ...updateData,
                originalData: {
                    items: order.items,
                    amount: order.amount,
                    tax: order.tax,
                    shippingFee: order.shippingFee,
                    totalAmount: order.totalAmount
                },
                items: [], // Remove all products
                amount: 0, // Reset subtotal
                tax: 0, // Reset tax
                shippingFee: 0, // Reset shipping
                totalAmount: 0 // Reset total
            };
        } else {
            // When unarchiving: restore original data
            if (order.originalData) {
                updateData = {
                    ...updateData,
                    items: order.originalData.items || [],
                    amount: order.originalData.amount || 0,
                    tax: order.originalData.tax || 0,
                    shippingFee: order.originalData.shippingFee || 0,
                    totalAmount: order.originalData.totalAmount || 0,
                    originalData: null // Clear the stored original data
                };
            } else {
                // Fallback if no original data exists
                updateData = {
                    ...updateData,
                    items: [],
                    amount: 0,
                    tax: 0,
                    shippingFee: 0,
                    totalAmount: 0
                };
            }
        }
        
        // Use findByIdAndUpdate to avoid validation issues with existing orders
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true, runValidators: false }
        );
        
        console.log('Order after archive:', updatedOrder.archived);

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Archive API error:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
} 