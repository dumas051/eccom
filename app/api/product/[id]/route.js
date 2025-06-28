import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return NextResponse.json({ success: false, message: "Invalid product ID" });
        }
        return NextResponse.json({ success: false, message: error.message });
    }
} 