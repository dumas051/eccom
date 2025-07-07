import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        // Return all products for the seller, including archived
        const products = await Product.find({ sellerId: userId });

        return NextResponse.json({ success: true, products });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}