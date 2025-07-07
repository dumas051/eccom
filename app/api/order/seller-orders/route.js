import { NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";


export async function GET(request){
    try {
        const {userId} = getAuth(request);

        const isSeller = await authSeller(userId);

        if(!isSeller){
            return NextResponse.json({message: "You are not authorized to access this resource"}, {status: 401});
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const includeArchived = searchParams.get('archived') === 'true';
        const filter = includeArchived ? {} : { archived: { $ne: true } };

        const orders = await Order.find(filter).populate('address items.product')

        return NextResponse.json({ success: true, orders});

    } catch (error) {
        return NextResponse.json({message: "Internal Server Error"});
    }

}