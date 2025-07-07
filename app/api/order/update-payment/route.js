import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import authSeller from "@/lib/authSeller";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized - Seller access required" }, { status: 401 });
        }

        await connectDB();
        const { orderId, paymentStatus, paymentDetails } = await request.json();

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        if (!paymentStatus || !['Pending', 'Paid', 'Failed', 'Refunded'].includes(paymentStatus)) {
            return NextResponse.json({ success: false, message: "Invalid payment status" }, { status: 400 });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        // Update payment status and details
        const updateData = {
            paymentStatus: paymentStatus
        };

        // Add payment details if provided
        if (paymentDetails) {
            updateData.paymentDetails = {
                ...order.paymentDetails,
                ...paymentDetails,
                paymentDate: paymentDetails.paymentDate || new Date()
            };
        }

        // If marking as paid, set payment date
        if (paymentStatus === 'Paid' && !updateData.paymentDetails.paymentDate) {
            updateData.paymentDetails = {
                ...updateData.paymentDetails,
                paymentDate: new Date()
            };
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: updateData },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Payment status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
} 