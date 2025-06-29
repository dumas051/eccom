import connectDB from '../config/db.js';
import Product from '../models/Product.js';

const fixStockInformation = async () => {
  try {
    await connectDB();
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database`);
    
    if (products.length === 0) {
      console.log('No products found in database. Please add some products first.');
      process.exit(0);
    }
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updates = {};
      
      // Check if stock is missing or invalid
      if (product.stock === undefined || product.stock === null) {
        updates.stock = 10; // Default stock
        needsUpdate = true;
        console.log(`Product "${product.name}" - Setting stock to 10`);
      }
      
      // Check if lowStockThreshold is missing or invalid
      if (product.lowStockThreshold === undefined || product.lowStockThreshold === null) {
        updates.lowStockThreshold = 5; // Default threshold
        needsUpdate = true;
        console.log(`Product "${product.name}" - Setting low stock threshold to 5`);
      }
      
      // Calculate stock status based on current stock
      const currentStock = updates.stock || product.stock;
      const currentThreshold = updates.lowStockThreshold || product.lowStockThreshold;
      
      let newStockStatus = 'Out of Stock';
      if (currentStock > 0) {
        if (currentStock <= currentThreshold) {
          newStockStatus = 'Low Stock';
        } else {
          newStockStatus = 'In Stock';
        }
      }
      
      // Check if stock status needs updating
      if (product.stockStatus !== newStockStatus) {
        updates.stockStatus = newStockStatus;
        needsUpdate = true;
        console.log(`Product "${product.name}" - Updating stock status to "${newStockStatus}"`);
      }
      
      // Update the product if needed
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updates);
        updatedCount++;
      }
    }
    
    console.log(`\nUpdated ${updatedCount} products with proper stock information`);
    
    // Display final status
    const finalProducts = await Product.find({});
    console.log('\nFinal product stock status:');
    finalProducts.forEach(product => {
      console.log(`${product.name} - Stock: ${product.stock} (${product.stockStatus})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing stock information:', error);
    process.exit(1);
  }
};

fixStockInformation(); 