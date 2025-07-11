import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { NextResponse } from "next/server"



export async function GET(request){

    try {
        const {userId} = getAuth(request)
        
        await connectDB()
        const { searchParams } = new URL(request.url);
        const includeArchived = searchParams.get('archived') === 'true';
        const filter = includeArchived ? { userId } : { userId, archived: { $ne: true } };
        const orders = await Order.find(filter).populate('items.product')

        return NextResponse.json({success: true, orders})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
        
    }


}