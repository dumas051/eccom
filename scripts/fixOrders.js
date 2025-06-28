const mongoose = require('mongoose');
const Order = require('../models/Order').default; // Adjust if your export is different

const MONGO_URI = 'mongodb+srv://leighandrew13:inzuma11@cluster0.h2zmw9y.mongodb.net'; // <-- Put your connection string here

const DEFAULT_ADDRESS = {
  fullName: 'N/A',
  phone: 'N/A',
  pincode: 'N/A',
  area: 'N/A',
  city: 'N/A',
  state: 'N/A'
};

async function fixOrders() {
  await mongoose.connect(MONGO_URI);

  const orders = await Order.find({});
  for (const order of orders) {
    let changed = false;
    if (typeof order.address !== 'object' || order.address === null) {
      order.address = { ...DEFAULT_ADDRESS };
      changed = true;
    } else {
      for (const key of Object.keys(DEFAULT_ADDRESS)) {
        if (!order.address[key]) {
          order.address[key] = DEFAULT_ADDRESS[key];
          changed = true;
        }
      }
    }
    if (changed) {
      await order.save();
      console.log(`Fixed order ${order._id}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}

fixOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
