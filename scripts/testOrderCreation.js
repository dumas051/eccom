import connectDB from '../config/db.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const testOrderCreation = async () => {
    try {
        await connectDB();
        console.log('Connected to database');

        // Test data
        const testOrderData = {
            userId: 'test_user_123',
            items: [
                {
                    product: '507f1f77bcf86cd799439011', // Example product ID
                    quantity: 2
                }
            ],
            amount: 1000, // Subtotal
            tax: 100, // Tax amount
            shippingFee: 50, // Shipping fee
            totalAmount: 1150, // Total
            address: {
                fullName: 'Test User',
                phone: '1234567890',
                pincode: '12345',
                area: 'Test Area',
                city: 'Test City',
                state: 'Test State'
            },
            status: 'Order Placed',
            date: Date.now(),
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
            paymentDetails: {
                paymentAmount: 1150
            }
        };

        console.log('Testing order creation with data:', testOrderData);

        // Create a test order
        const newOrder = new Order(testOrderData);
        
        // Validate the order
        const validationError = newOrder.validateSync();
        if (validationError) {
            console.error('Order validation error:', validationError);
            return;
        }

        console.log('Order validation passed');

        // Try to save the order
        await newOrder.save();
        console.log('Order saved successfully:', newOrder._id);

        // Clean up - delete the test order
        await Order.findByIdAndDelete(newOrder._id);
        console.log('Test order cleaned up');

        console.log('✅ Order creation test passed!');

    } catch (error) {
        console.error('❌ Order creation test failed:', error);
    } finally {
        process.exit(0);
    }
};

testOrderCreation(); 