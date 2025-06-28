import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: { type: Array, required: true },
    sellerId: { type: String, required: true },
    
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;