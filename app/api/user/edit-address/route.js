import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export async function PUT(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { addressId, address } = await request.json();
        if (!addressId) {
            return NextResponse.json({ success: false, message: "Address ID is required" }, { status: 400 });
        }
        if (!address || typeof address !== "object") {
            return NextResponse.json({ success: false, message: "Invalid address data" }, { status: 400 });
        }
        // Validate required fields
        const requiredFields = ['fullName', 'phone', 'pincode', 'area', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !address[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({ 
                success: false, 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            }, { status: 400 });
        }
        // Update address document
        const updated = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { $set: address },
            { new: true }
        );
        if (!updated) {
            return NextResponse.json({ success: false, message: "Address not found or not authorized" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Address updated", updatedAddress: updated });
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
} 