import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: [{ url: { type: String, required: true } }],
    sellerId: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'Out of Stock' },
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;