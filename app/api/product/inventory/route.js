import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    if (!sellerId) {
      return NextResponse.json({ success: false, message: "Seller ID is required" });
    }

    // Ensure the user can only access their own inventory
    if (sellerId !== userId) {
      return NextResponse.json({ success: false, message: "Access denied. You can only view your own inventory." });
    }

    // Get all products for the seller
    const products = await Product.find({ sellerId });
    
    console.log(`Found ${products.length} products for seller ${sellerId}`);
    products.forEach(product => {
      console.log(`Product: ${product.name} - Stock: ${product.stock} - Status: ${product.stockStatus}`);
    });
    
    // Calculate inventory summary
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stockStatus === 'In Stock').length;
    const lowStock = products.filter(p => p.stockStatus === 'Low Stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'Out of Stock').length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    // Get low stock alerts
    const lowStockAlerts = products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock');

    return NextResponse.json({ 
      success: true, 
      summary: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
        totalStock
      },
      lowStockAlerts: lowStockAlerts.map(p => ({
        _id: p._id,
        name: p.name,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        stockStatus: p.stockStatus
      }))
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    });
  }
} 