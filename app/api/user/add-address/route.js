import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { address } = await request.json();

        if (Object.keys(address).length === 0) {
            return NextResponse.json({ success: false, message: "Address is empty" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        if (!Array.isArray(user.address)) {
            user.address = [];
        }
        
        user.address.push(address);
        await user.save();

        const newAddress = user.address[user.address.length - 1];

        return NextResponse.json({ success: true, message: "Address added successfully", newAddress });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}