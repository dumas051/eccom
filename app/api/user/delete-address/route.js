import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Address from "@/models/Address";

export async function DELETE(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const { addressId } = await request.json();
        if (!addressId) {
            return NextResponse.json({ success: false, message: "Address ID is required" }, { status: 400 });
        }
        // Delete address document
        const deleted = await Address.findOneAndDelete({ _id: addressId, userId });
        if (!deleted) {
            return NextResponse.json({ success: false, message: "Address not found or not authorized" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Address deleted", deletedAddress: deleted });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
} 