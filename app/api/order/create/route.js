import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import Product from "@/models/Product"
import { inngest } from "@/config/inngest"
import User from "@/models/User"
import Order from "@/models/Order"
import axios from "axios"
import { calculateTax, calculateShippingFee, calculateTotal } from "@/lib/taxShipping"

export async function POST(request){
    try {
        await connectDB();
        
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        const reqBody = await request.json()
        const { address, items, paymentMethod = 'COD', gcash } = reqBody

        console.log('Order creation request:', { userId, address, items, paymentMethod });

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid or empty items array" }, { status: 400 });
        }

        if (!address || typeof address !== "object") {
            return NextResponse.json({ success: false, message: "Invalid address" }, { status: 400 });
        }

        // Validate required address fields
        const requiredFields = ['fullName', 'phone', 'pincode', 'area', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !address[field] || address[field].trim() === '');
        
        if (missingFields.length > 0) {
            return NextResponse.json({ 
                success: false, 
                message: `Missing required address fields: ${missingFields.join(', ')}` 
            }, { status: 400 });
        }

        // Patch for compatibility: support both phone and phoneNumber
        if (!address.phone && address.phoneNumber) {
            address.phone = address.phoneNumber;
        }

        // Validate items and calculate subtotal
        let subtotal = 0;
        const validatedItems = [];
        
        for (const item of items) {
            if (!item.product || !item.quantity || item.quantity <= 0) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Invalid item data: missing product ID or invalid quantity" 
                }, { status: 400 });
            }
            
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Product not found: ${item.product}` 
                }, { status: 404 });
            }
            
            // Check stock availability
            if (product.stock < item.quantity) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                }, { status: 400 });
            }
            
            subtotal += product.offerPrice * item.quantity;
            validatedItems.push({
                product: item.product,
                quantity: item.quantity
            });
        }

        // Calculate tax and shipping
        const tax = calculateTax(subtotal, address);
        const shippingFee = calculateShippingFee(subtotal, address);
        const totalAmount = calculateTotal(subtotal, address);

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                items,
                subtotal,
                tax,
                shippingFee,
                totalAmount,
                address,
                paymentMethod,
                date: Date.now()
            }
        })

        // Save order to DB
        const orderData = {
            userId,
            items: validatedItems,
            amount: subtotal, // Subtotal before tax and shipping
            tax: tax,
            shippingFee: shippingFee,
            totalAmount: totalAmount, // Total after tax and shipping
            address,
            status: "Order Placed",
            date: Date.now(),
            paymentMethod,
            paymentStatus: paymentMethod === 'Gcash' ? 'Paid' : (paymentMethod === 'COD' ? 'Pending' : 'Pending'),
            paymentDetails: {
                paymentAmount: totalAmount,
                ...(paymentMethod === 'Gcash' && gcash ? {
                    gcashCustomerNumber: gcash.customerNumber
                } : {})
            }
        };

        console.log('Creating order with data:', orderData);

        const newOrder = new Order(orderData);
        
        // Validate the order before saving
        const validationError = newOrder.validateSync();
        if (validationError) {
            console.error('Order validation error:', validationError);
            return NextResponse.json({ 
                success: false, 
                message: `Order validation failed: ${validationError.message}` 
            }, { status: 400 });
        }
        
        await newOrder.save();
        console.log('Order saved successfully:', newOrder._id);

        // Reduce stock for each product in the order
        for (const item of validatedItems) {
            const product = await Product.findById(item.product);
            if (product) {
                const newStock = product.stock - item.quantity;
                
                // Update stock and status
                const updates = {
                    stock: newStock,
                    stockStatus:
                        newStock <= 0
                            ? 'Out of Stock'
                            : newStock <= (product.lowStockThreshold || 5)
                            ? 'Low Stock'
                            : 'In Stock',
                };
                
                await Product.findByIdAndUpdate(
                    product._id,
                    { $set: updates },
                    { new: true, strict: false }
                );
                
                console.log(`Updated stock for ${product.name}: ${product.stock} -> ${newStock}`);
            }
        }

        // Clear cart
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
            console.log('Cart cleared for user:', userId);
        }

        // Send order confirmation email
        try {
            const userEmail = user.emailAddresses[0]?.emailAddress;
            if (userEmail) {
                await axios.post('/api/email/send', {
                    to: userEmail,
                    template: 'orderConfirmation',
                    data: {
                        _id: newOrder._id,
                        date: newOrder.date,
                        subtotal: newOrder.amount,
                        tax: newOrder.tax,
                        shippingFee: newOrder.shippingFee,
                        totalAmount: newOrder.totalAmount,
                        paymentMethod: newOrder.paymentMethod,
                        status: newOrder.status,
                        items: newOrder.items,
                        address: newOrder.address
                    }
                });
                console.log('Order confirmation email sent successfully');
            }
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order creation if email fails
        }

        return NextResponse.json({ 
            success: true, 
            message: "Order created successfully",
            order: newOrder
        })

    } catch (error) {
        console.error('Order creation error:', error);
        
        // Handle specific MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ 
                success: false, 
                message: `Validation failed: ${validationErrors.join(', ')}` 
            }, { status: 400 });
        }
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json({ 
                success: false, 
                message: "Order already exists" 
            }, { status: 409 });
        }
        
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Internal server error" 
        }, { status: 500 });
    }
}