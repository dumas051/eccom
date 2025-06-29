import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function POST(request) {
  try {
    await connectDB();
    const products = await Product.find({});
    let updatedCount = 0;
    const updatedProducts = [];
    for (const product of products) {
      const updates = {
        stock: typeof product.stock === 'number' && !isNaN(product.stock) ? product.stock : 10,
        lowStockThreshold: typeof product.lowStockThreshold === 'number' && !isNaN(product.lowStockThreshold) ? product.lowStockThreshold : 5,
      };
      if (updates.stock <= 0) {
        updates.stockStatus = 'Out of Stock';
      } else if (updates.stock <= updates.lowStockThreshold) {
        updates.stockStatus = 'Low Stock';
      } else {
        updates.stockStatus = 'In Stock';
      }
      await Product.findByIdAndUpdate(
        product._id,
        { $set: updates },
        { new: true, strict: false }
      );
      updatedProducts.push({
        _id: product._id,
        name: product.name,
        stock: updates.stock,
        lowStockThreshold: updates.lowStockThreshold,
        stockStatus: updates.stockStatus
      });
      updatedCount++;
    }
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} products with proper stock information`,
      products: updatedProducts
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
} 