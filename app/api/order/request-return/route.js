import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await auth();
    const { orderId, reason, refundMethod } = await request.json();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }
    if (order.userId !== userId) {
      return NextResponse.json({ success: false, message: "You can only request a return for your own orders." });
    }
    if (order.status !== 'Delivered' || (order.returnRequest && order.returnRequest.status !== 'None')) {
      return NextResponse.json({ success: false, message: "Return/refund not allowed for this order." });
    }
    order.returnRequest = {
      status: 'Requested',
      reason,
      requestedAt: new Date(),
      refundMethod,
      restocked: false
    };
    await order.save();
    return NextResponse.json({ success: true, message: "Return/refund request submitted." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
} 