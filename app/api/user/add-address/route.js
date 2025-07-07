import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const address = await request.json();
        console.log('Received address data:', address);
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
        // Create new address document
        const newAddress = await Address.create({ ...address, userId });
        console.log('Address saved successfully:', newAddress);
        return NextResponse.json({ success: true, message: "Address added", newAddress });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}