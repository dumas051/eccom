import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;