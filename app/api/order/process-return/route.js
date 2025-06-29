import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await auth();
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }
    const { orderId, action, message, refundAmount, restock } = await request.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }
    if (!order.returnRequest || order.returnRequest.status !== 'Requested') {
      return NextResponse.json({ success: false, message: "No pending return/refund request." });
    }
    if (action === 'approve') {
      order.returnRequest.status = 'Approved';
      order.returnRequest.processedAt = new Date();
      order.returnRequest.message = message;
      order.returnRequest.refundAmount = refundAmount;
      order.status = 'Refunded';
      if (restock) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
        order.returnRequest.restocked = true;
      }
    } else if (action === 'reject') {
      order.returnRequest.status = 'Rejected';
      order.returnRequest.processedAt = new Date();
      order.returnRequest.message = message;
    }
    await order.save();
    return NextResponse.json({ success: true, message: `Return/refund request ${action}ed.` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
} 