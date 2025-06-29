import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import axios from "axios";

export async function POST(request) {
  try {
    await connectDB();
    const { orderId, trackingNumber, estimatedDelivery, trackingUpdate } = await request.json();
    
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    // Update tracking number if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    // Update estimated delivery if provided
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    // Add tracking history entry if provided
    if (trackingUpdate) {
      order.trackingHistory.push({
        status: trackingUpdate.status,
        description: trackingUpdate.description,
        timestamp: new Date(),
        location: trackingUpdate.location || ''
      });
    }

    await order.save();

    // Send tracking update email to customer
    try {
      const user = await User.findById(order.userId);
      if (user && user.emailAddresses && user.emailAddresses.length > 0) {
        const userEmail = user.emailAddresses[0].emailAddress;
        
        // Send tracking update email if tracking number was added or status was updated
        if (trackingNumber || (trackingUpdate && trackingUpdate.status === 'Shipped')) {
          await axios.post('/api/email/send', {
            to: userEmail,
            template: 'orderShipped',
            data: {
              _id: order._id,
              date: order.date,
              amount: order.amount,
              status: order.status,
              trackingNumber: order.trackingNumber,
              estimatedDelivery: order.estimatedDelivery
            }
          });
          console.log('Tracking update email sent successfully');
        }
      }
    } catch (emailError) {
      console.error('Failed to send tracking update email:', emailError);
      // Don't fail the tracking update if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: "Tracking information updated successfully" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    });
  }
} 