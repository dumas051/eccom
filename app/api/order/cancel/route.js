import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectDB();
    const { orderId } = await request.json();
    
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    // Check if order can be cancelled
    if (!order.canCancel) {
      return NextResponse.json({ success: false, message: "Order cannot be cancelled" });
    }

    // Check if order is already cancelled
    if (order.status === "Cancelled") {
      return NextResponse.json({ success: false, message: "Order is already cancelled" });
    }

    // Update order status to cancelled
    order.status = "Cancelled";
    order.canCancel = false;
    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: "Order cancelled successfully" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    });
  }
} 