import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectDB();
    const { orderId } = await request.json();
    
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        _id: order._id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        trackingHistory: order.trackingHistory,
        items: order.items,
        amount: order.amount,
        date: order.date,
        address: order.address
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    });
  }
} 