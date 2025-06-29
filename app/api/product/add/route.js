import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import connectDB from "../../../../config/db";
import Product from "../../../../models/Product";

//Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" })
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");
        const category = formData.get("category");
        const offerPrice = formData.get("offerPrice");
        const stock = formData.get("stock");
        const lowStockThreshold = formData.get("lowStockThreshold");

        const files = formData.getAll("images");
        
        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No images uploaded" })
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const images = result.map((item) => ({
            public_id: item.public_id,
            url: item.secure_url,
        }));

        // Determine stock status based on quantity
        let stockStatus = 'Out of Stock';
        if (stock > 0) {
          if (stock <= (lowStockThreshold || 5)) {
            stockStatus = 'Low Stock';
          } else {
            stockStatus = 'In Stock';
          }
        }

        const productData = {
          name,
          description,
          price: parseFloat(price),
          offerPrice: parseFloat(offerPrice),
          category,
          stock: parseInt(stock) || 0,
          lowStockThreshold: parseInt(lowStockThreshold) || 5,
          stockStatus,
          sellerId: userId,
          images: images
        };

        await connectDB()
        const newProduct = await Product.create(productData)

        return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct })

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}