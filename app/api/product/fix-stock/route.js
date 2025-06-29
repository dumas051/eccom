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

    // Get all products for this seller
    const products = await Product.find({ sellerId: userId });
    
    console.log(`Found ${products.length} products for seller ${userId} to fix stock`);
    products.forEach(product => {
      console.log(`Product: ${product.name} - Current Stock: ${product.stock} - Current Status: ${product.stockStatus}`);
    });
    
    if (products.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No products found. Please add some products first." 
      });
    }
    
    let updatedCount = 0;
    const updatedProducts = [];
    
    for (const product of products) {
      // Always set these fields robustly
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
      // Force update all three fields
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