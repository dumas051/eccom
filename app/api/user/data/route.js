import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../../config/db";
import User from "../../../../models/User";

export async function GET(request) {
    try {
        await connectDB()
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        const user = await User.findById(userId);

        if(!user){
            return NextResponse.json({ success: false, message: "User not found" });
        }

        // Return user data from Clerk
        return NextResponse.json({ 
            success: true, 
            user
        });
    } catch (error) {
        console.error("Error in user data route:", error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
}