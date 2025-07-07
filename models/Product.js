import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Mouse', 'Keyboard'],
        default: 'Mouse'
    },
    subcategory: { 
        type: String,
        enum: ['Gaming Mouse', 'Office Mouse', 'Wireless Mouse', 'Gaming Keyboard', 'Mechanical Keyboard', 'Wireless Keyboard'],
        default: 'Gaming Mouse'
    },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: [{ url: { type: String, required: true } }],
    sellerId: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'Out of Stock' },
    features: [{ type: String }], // For product features like RGB, wireless, etc.
    brand: { type: String, default: 'Generic' },
    archived: { type: Boolean, default: false },
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;