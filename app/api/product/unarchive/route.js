import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../../config/db";
import Product from "../../../../models/Product";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const { productId } = await request.json();

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }
        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        const product = await Product.findOne({ _id: productId, sellerId: userId });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found or unauthorized" });
        }

        product.archived = false;
        await product.save();

        return NextResponse.json({ success: true, message: "Product restored successfully" });
    } catch (error) {
        console.error("Error unarchiving product:", error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
} 