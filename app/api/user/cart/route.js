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

        const { cartData } = await request.json();

        await User.findByIdAndUpdate(userId, { cartItems: cartData });

        return NextResponse.json({ success: true, message: "Cart updated" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
} 