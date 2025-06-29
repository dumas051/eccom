import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

export async function GET(request) {
    try {

        await connectDB();

        const products = await Product.find({});
        
        // Debug: Log product information
        console.log(`Found ${products.length} products in database`);
        products.forEach(product => {
            console.log(`Product: ${product.name} - Stock: ${product.stock} - Status: ${product.stockStatus}`);
        });

        return NextResponse.json({ success: true, products });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}