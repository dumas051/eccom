import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export async function PUT(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { addressId, archived } = await request.json();
        if (!addressId || typeof archived !== 'boolean') {
            return NextResponse.json({ success: false, message: "Address ID and archived status are required" }, { status: 400 });
        }
        const updated = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { $set: { archived } },
            { new: true }
        );
        if (!updated) {
            return NextResponse.json({ success: false, message: "Address not found or not authorized" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: archived ? "Address archived" : "Address unarchived", address: updated });
    } catch (error) {
        console.error("Error archiving address:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
} 