import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();
    const allProducts = await Product.find({});
    const productsWithDetails = allProducts.map(product => ({
      _id: product._id,
      name: product.name,
      sellerId: product.sellerId,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      stockStatus: product.stockStatus,
      category: product.category,
      price: product.price,
      offerPrice: product.offerPrice
    }));
    return NextResponse.json({
      success: true,
      totalProducts: allProducts.length,
      products: productsWithDetails
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
} 