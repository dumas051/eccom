import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = auth();
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

        product.archived = true;
        await product.save();

        return NextResponse.json({ success: true, message: "Product archived successfully" });
    } catch (error) {
        console.error("Error archiving product:", error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
}

export async function PUT(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { productId, archived } = await request.json();
        if (!productId || typeof archived !== 'boolean') {
            return NextResponse.json({ success: false, message: "Product ID and archived status are required" }, { status: 400 });
        }
        // Only allow the seller to archive/unarchive their product
        const updated = await Product.findOneAndUpdate(
            { _id: productId, sellerId: userId },
            { $set: { archived } },
            { new: true }
        );
        if (!updated) {
            return NextResponse.json({ success: false, message: "Product not found or not authorized" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: archived ? "Product archived" : "Product unarchived", product: updated });
    } catch (error) {
        console.error("Error archiving product:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
} 