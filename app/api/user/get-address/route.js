import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        // Fetch addresses for this user (not archived)
        const addresses = await Address.find({ userId, archived: false });
        return NextResponse.json({ success: true, address: addresses });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}