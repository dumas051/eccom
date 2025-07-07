import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;