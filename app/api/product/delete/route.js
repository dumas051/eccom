import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "../../../../lib/authSeller";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { productId } = await request.json();

        const product = await Product.findById(productId);

        if (!product || product.sellerId.toString() !== userId) {
            return NextResponse.json({ success: false, message: "Product not found or unauthorized" });
        }

        for (const image of product.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
} 