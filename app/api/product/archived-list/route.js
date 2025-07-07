import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        const products = await Product.find({ sellerId: userId, archived: true });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching archived products:", error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
} 