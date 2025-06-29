import connectDB from '../config/db.js';
import Order from '../models/Order.js';

const fixOrders = async () => {
    try {
        await connectDB();
        
        const orders = await Order.find({});
        
        for (const order of orders) {
            // Update address fields if they exist
            if (order.address) {
                const updatedAddress = {
                    fullName: order.address.fullName || 'N/A',
                    phone: order.address.phone || 'N/A',
                    pincode: order.address.pincode || 'N/A',
                    area: order.address.area || 'N/A',
                    city: order.address.city || 'N/A',
                    state: order.address.state || 'N/A'
                };
                
                order.address = updatedAddress;
                await order.save();
                console.log(`Updated order ${order._id}`);
            }
        }
        
        console.log('All orders updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing orders:', error);
        process.exit(1);
    }
};

fixOrders();
