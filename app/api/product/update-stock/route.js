import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    // Check if user is a seller
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Access denied. Seller role required." });
    }

    const { productId, stock, lowStockThreshold } = await request.json();
    
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" });
    }

    // Check if the user owns this product
    if (product.sellerId !== userId) {
      return NextResponse.json({ success: false, message: "Access denied. You can only update your own products." });
    }

    // Always set these fields robustly
    const updates = {
      stock: typeof stock === 'number' && !isNaN(stock) ? stock : 10,
      lowStockThreshold: typeof lowStockThreshold === 'number' && !isNaN(lowStockThreshold) ? lowStockThreshold : 5,
    };
    if (updates.stock <= 0) {
      updates.stockStatus = 'Out of Stock';
    } else if (updates.stock <= updates.lowStockThreshold) {
      updates.stockStatus = 'Low Stock';
    } else {
      updates.stockStatus = 'In Stock';
    }

    // Force update all three fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true, strict: false }
    );

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      product: {
        _id: updatedProduct._id,
        stock: updatedProduct.stock,
        lowStockThreshold: updatedProduct.lowStockThreshold,
        stockStatus: updatedProduct.stockStatus
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
} 