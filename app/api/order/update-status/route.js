import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import axios from "axios";

export async function POST(request) {
  try {
    await connectDB();
    const { orderId, status } = await request.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    // Prevent changing status of cancelled orders
    if (order.status === "Cancelled") {
      return NextResponse.json({ success: false, message: "Cannot update cancelled orders" });
    }

    order.status = status;
    
    // If order is delivered, it can no longer be cancelled
    if (status === "Delivered") {
      order.canCancel = false;
    }
    
    await order.save();

    // Send status update email to customer
    try {
      const user = await User.findById(order.userId);
      if (user && user.emailAddresses && user.emailAddresses.length > 0) {
        const userEmail = user.emailAddresses[0].emailAddress;
        
        let emailTemplate = null;
        if (status === "Confirmed") {
          emailTemplate = 'orderApproved';
        } else if (status === "Delivered") {
          emailTemplate = 'orderShipped';
        }
        
        if (emailTemplate) {
          await axios.post('/api/email/send', {
            to: userEmail,
            template: emailTemplate,
            data: {
              _id: order._id,
              date: order.date,
              amount: order.amount,
              status: order.status,
              trackingNumber: order.trackingNumber,
              estimatedDelivery: order.estimatedDelivery
            }
          });
          console.log(`${status} email sent successfully`);
        }
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
} 